"use server";

import { Client } from "dwolla-v2";

/**Dwolla es un procesador de pagos que utilizamos para mover dinero de una cuenta a otra usando Plaid como intermediario.
 * Plaid asegura los datos de la transferencia y Dwolla se asegura de que la transferencia sea exitosa. */

const getEntorno = (): "production" | "sandbox" => {
  const entorno = process.env.DWOLLA_ENV as string;

  switch (entorno) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "El entorno de Dwolla debe ser alguno de estos dos: `sandbox` ó `production`."
      );
  }
};

const dwollaCliente = new Client({
  environment: getEntorno(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const crearFuenteFinanciamiento = async (
  opciones: CrearFuenteFinanciamientoOpciones
) => {
  try {
    return await dwollaCliente
      .post(`customers/${opciones.customerId}/funding-sources`, {
        name: opciones.fundingSourceName,
        plaidToken: opciones.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("❌ Error al crear la fuente de financiamiento: ", err);
  }
};

export const crearAutorizacionEnDemanda = async () => {
  try {
    const autorizacionEnDemanda = await dwollaCliente.post(
      "on-demand-authorizations"
    );
    const ligasAutorizadas = autorizacionEnDemanda.body._links;
    return ligasAutorizadas;
  } catch (err) {
    console.error("❌ Error al crear la autorización en demanda: ", err);
  }
};

export const crearClienteDwolla = async (
  nuevoCliente: crearClienteDwollaParams
) => {
  try {
    return await dwollaCliente
      .post("customers", nuevoCliente)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("❌ [dwolla.actions] crearClienteDwolla(65): ", err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaCliente
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("❌ Falló la transferencia de fondos: ", err);
  }
};

export const addFuenteFinanciamiento = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaLigasAutorizadas = await crearAutorizacionEnDemanda();

    // add funding source to the dwolla customer & get the funding source url
    const fuenteFinanciamientoOpciones = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaLigasAutorizadas,
    };
    return await crearFuenteFinanciamiento(fuenteFinanciamientoOpciones);
  } catch (err) {
    console.error("❌ Falló la transferencia de fondos: ", err);
  }
};
