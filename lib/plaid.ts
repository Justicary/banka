import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuracion = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

export const clientePlaid = new PlaidApi(configuracion);
