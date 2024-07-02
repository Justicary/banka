"use server";

import { ID, Query } from "node-appwrite";
import { crearAdminCliente, crearSesionCliente } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
// import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// Destructuracion, renombre y acceso a las varables de entorno.
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

export const registrar = async ({ password, ...values }: registrarParams) => {
  const { email, nombres, apellidos } = values;

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

    if (!nuevaCuentaUsuario) throw new Error("Error al crear el usuario.");

    // Crea un cliente en Dwolla
    // const dwollaCustomerUrl = await createDwollaCustomer({
    //   direccion1: values.direccion1,
    //   ciudad: values.ciudad,
    //   fdn: values.fdn,
    //   email: values.email,
    //   nombres: values.nombres,
    //   apellidos: values.apellidos,
    //   estado: values.estado,
    //   codigoPostal: values.codigoPostal,
    //   curp: values.curp,
    //   tipo: "personal",
    // });

    // if (!dwollaCustomerUrl)
    //   throw new Error("Error al crear el cliente en Dwolla.");

    // const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const nuevoUsuario = await database.createDocument(
      DATABASE_ID!,
      USUARIOS_COLLECTION_ID!,
      ID.unique(),
      {
        ...values,
        usuarioID: nuevaCuentaUsuario.$id,
        dwollaCustomerID: "dwollaID",
        dwollaCustomerUrl: "dwollaUrl",
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("sesion-appwrite", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(nuevoUsuario);
  } catch (error) {
    console.error("Error", error);
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

export const createLinkToken = async (usuario: Usuario) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: usuario.$id,
      },
      client_name: `${usuario.nombres} ${usuario.apellidos}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await crearAdminCliente();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    // const fundingSourceUrl = await addFundingSource({
    //   dwollaCustomerId: user.dwollaCustomerId,
    //   processorToken,
    //   bankName: accountData.name,
    // });

    // If the funding source URL is not created, throw an error
    // if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl: "", // TODO: Corregir a solo fundingSourceUrl
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await crearAdminCliente();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await crearAdminCliente();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANCOS_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
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
