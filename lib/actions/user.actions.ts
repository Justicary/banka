"use server";
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Externos
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Internos
import { crearAdminCliente, crearSesionCliente } from "../appwrite";
import { encriptarID, extraeIDClienteDeURL, parseStringify } from "../utils";
import { clientePlaid } from "@/lib/plaid";
import { addFuenteFinanciamiento, crearClienteDwolla } from "./dwolla.actions";

// Variables de entorno: Destructura & renombra.
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USUARIOS_COLLECTION_ID: USUARIOS_COLLECTION_ID,
  APPWRITE_BANCOS_COLLECTION_ID: BANCOS_COLLECTION_ID,
} = process.env;

export const getUsuarioInfo = async ({ usuarioID }: getUsuarioInfoProps) => {
  try {
    //OJO: Crea y destructura un admin. Expone la clase Database.
    const { database } = await crearAdminCliente();

    //OJO: Accesa a la base de datos de usuarios y aplica una consulta(query).
    const user = await database.listDocuments(
      DATABASE_ID!,
      USUARIOS_COLLECTION_ID!,
      [Query.equal("usuarioID", [usuarioID])]
    );

    //OJO: Retorna la primera ocurrencia.
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const iniciarSesion = async ({
  email,
  password,
}: iniciarSesionProps) => {
  try {
    //OJO: Crea y destructura un admin. Expone la clase Account.
    const { account } = await crearAdminCliente();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("sesion-appwrite", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const usuario = await getUsuarioInfo({ usuarioID: session.userId });

    return parseStringify(usuario);
  } catch (error) {
    console.error("Error", error);
  }
};

export const registrar = async ({ password, ...valores }: registrarParams) => {
  const { email, nombres, apellidos } = valores;

  // Se llama "transacción atomica" a una transacción que es una de dos, funciona o es rechazada. No tiene otra forma de hacerlo.
  let nuevaCuentaUsuario;

  try {
    //Crea y destructura un admin. Expone las clases Account(Auth) y Database.
    const { account, database } = await crearAdminCliente();

    //Crea una nueva cuenta de usuario en AUTH.
    nuevaCuentaUsuario = await account.create(
      ID.unique(),
      email,
      password,
      `${nombres} ${apellidos}`
    );

    if (!nuevaCuentaUsuario)
      throw new Error("al crear cuenta en Appwrite auth...");

    const dwollaCliente = {
      address1: valores.direccion1!,
      address2: valores.direccion2,
      city: valores.ciudad!,
      dateOfBirth: valores.fdn!,
      email: valores.email!,
      firstName: valores.nombres!,
      lastName: valores.apellidos!,
      state: "CA", // valores.estado!.toUpperCase().substring(0, 2),
      postalCode: valores.codigoPostal!,
      ssn: valores.curp!.slice(-4),
      type: "personal",
    };

    // Crea un cliente en Dwolla
    const dwollaClienteURL = await crearClienteDwolla(dwollaCliente);

    if (!dwollaClienteURL) {
      console.log("ℹ Objeto enviado a DWOLLA : ", dwollaCliente);
      throw new Error("al crear cliente en DWOLLA:");
    }

    // Extrae el ID del cliente desde el URL.
    const dwollaClienteID = extraeIDClienteDeURL(dwollaClienteURL);

    const nuevoUsuario = await database.createDocument(
      DATABASE_ID!,
      USUARIOS_COLLECTION_ID!,
      ID.unique(),
      {
        ...valores,
        usuarioID: nuevaCuentaUsuario.$id,
        dwollaClienteID,
        dwollaClienteURL,
      }
    );

    if (!nuevoUsuario)
      throw new Error("al crear usuario en Appwrite database...");

    // Crea una sesión de usuario en APPWRITE.
    const sesion = await account.createEmailPasswordSession(email, password);

    cookies().set("sesion-appwrite", sesion.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(nuevoUsuario);
  } catch (error) {
    console.error("❌ Error en transacción atómica(registrar) ", error);
    // console.log("ℹ Valores recibidos(user.actions):", valores);
  }
};

export async function getUsuarioRegistrado() {
  try {
    const { account } = await crearSesionCliente();
    const resultado = await account.get();

    const usuario = await getUsuarioInfo({ usuarioID: resultado.$id });

    return parseStringify(usuario);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const desconectarCuenta = async () => {
  try {
    const { account } = await crearSesionCliente();

    cookies().delete("sesion-appwrite");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const crearLigaToken = async (usuario: Usuario) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: usuario.$id,
      },
      client_name: `${usuario.nombres} ${usuario.apellidos}`,
      products: ["auth"] as Products[],
      language: "es",
      country_codes: ["US"] as CountryCode[], // ["MX"] NO SOPORTADO POR PLAID
    };

    const response = await clientePlaid.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const crearCuentaBancaria = async ({
  usuarioID,
  bancoID,
  cuentaID,
  tokenPermanente,
  fuenteFinanciamientoURL,
  shareableID,
}: crearCuentaBancariaProps) => {
  try {
    //OJO: Crea un registro en la base de datos bancos en Appwrite.
    const { database } = await crearAdminCliente();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      ID.unique(),
      {
        bancoID,
        cuentaID,
        fuenteFinanciamientoURL,
        shareableID,
        tokenPermanente,
        usuarioID,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.error("❌ Error al crear la cuenta bancaria en Appwrite: ", error);
  }
};

export const intercambiarTokenPublico = async ({
  tokenPublico,
  usuario,
}: intercambiarTokenPublicoProps) => {
  try {
    // Intercambia el token público por un token de acceso permanente y un item_id.
    const respuesta = await clientePlaid.itemPublicTokenExchange({
      public_token: tokenPublico,
    });

    const tokenPermanente = respuesta.data.access_token;
    const itemId = respuesta.data.item_id;

    // Obtiene la información de las cuentas desde Plaid usando el token permanente.
    const getCuentas = await clientePlaid.accountsGet({
      access_token: tokenPermanente,
    });

    // Almacena la información de la cuenta base del arreglo de cuentas.
    const cuentaDatos = getCuentas.data.accounts[0];

    // Dwolla es un procesador de pagos que usaremos para mover dinero de una cuenta a otra utilizando plaid.
    // Crea un token de procesador para Dwolla usando el token permanente y el ID de cuentaDatos.
    const solicitud: ProcessorTokenCreateRequest = {
      access_token: tokenPermanente,
      account_id: cuentaDatos.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const respuestaCrearToken = await clientePlaid.processorTokenCreate(
      solicitud
    );
    const processorToken = respuestaCrearToken.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fuenteFinanciamientoURL = await addFuenteFinanciamiento({
      dwollaCustomerId: usuario.dwollaCustomerId,
      processorToken,
      bankName: cuentaDatos.name,
    });

    // Si el URL de la fuente de saldo no se crea, emite un error.
    if (!fuenteFinanciamientoURL) throw Error;

    // Crea una nueva cuenta bancaria en la base de datos utilizand usuarioID, itemId, account ID, tokenPermanente, funding source URL y shareableId.
    await crearCuentaBancaria({
      usuarioID: usuario.$id,
      bancoID: itemId,
      cuentaID: cuentaDatos.account_id,
      tokenPermanente,
      fuenteFinanciamientoURL,
      shareableID: encriptarID(cuentaDatos.account_id),
    });

    // Revalida la ruta para reflejar los cambios.
    revalidatePath("/");

    // Regresa una respuesta de éxito.
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error(
      "Ocurrió un error mientras se creaba el token de intercambio:",
      error
    );
  }
};

export const getBancos = async ({ usuarioID: userId }: getBancosProps) => {
  try {
    const { database } = await crearAdminCliente();

    const bancos = await database.listDocuments(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      [Query.equal("usuarioID", [userId])]
    );

    return parseStringify(bancos.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBanco = async ({ documentoID }: getBancoProps) => {
  try {
    const { database } = await crearAdminCliente();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      [Query.equal("$id", [documentoID])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await crearAdminCliente();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
