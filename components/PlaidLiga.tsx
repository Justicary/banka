"use client";
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Externos
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Internos
import { Button } from "./ui/button";
import {
  crearLigaToken,
  intercambiarTokenPublico,
} from "@/lib/actions/user.actions";

const PlaidLiga = ({ usuario, variante }: PlaidLigaProps) => {
  const enrutador = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const getLigaToken = async () => {
      const datos = await crearLigaToken(usuario);
      setToken(datos?.linkToken);
    };
    getLigaToken();
  }, [usuario]);

  // Metodos y variables para controlar la conectividad con PLAID
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      await intercambiarTokenPublico({ tokenPublico: public_token, usuario });
      enrutador.push("/");
    },
    [enrutador, usuario]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const controlPrimario = () => open();
  const controlFantasma = () => {};
  const controlDefault = () => {};
  return (
    <>
      {variante === "primario" ? (
        <Button
          className="plaidlink-primary"
          disabled={!ready}
          onClick={controlPrimario}
        >
          Conectar banco
        </Button>
      ) : variante === "fantasma" ? (
        <Button className="plaidlink-primary" onClick={controlFantasma}>
          Conectar banco
        </Button>
      ) : (
        <Button className="plaidlink-primary" onClick={controlDefault}>
          Conectar banco
        </Button>
      )}
    </>
  );
};

export default PlaidLiga;
