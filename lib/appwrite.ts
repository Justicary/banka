"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function crearSesionCliente() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies().get("sesion-appwrite");

  if (!session || !session.value) {
    throw new Error(
      "❌ Ya no existe información de la sesión en las cookies. Redireccinando a sign-in..."
    );
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}
/**
 * Crea un cliente admin(control total) utilizando las credenciales especificadas.
 * @returns Un objeto que contiene las instancias de las clases Account, Databases y Users.*/
export async function crearAdminCliente(): Promise<{
  account: Account;
  database: Databases;
  user: Users;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
