// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Externos
import React from "react";
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Internos
import EncabezadoCaja from "@/components/EncabezadoCaja";
import SaldoTotalCaja from "@/components/SaldoTotalCaja";
import BarraLateralDerecha from "@/components/BarraLateralDerecha";
import { getUsuarioRegistrado } from "@/lib/actions/user.actions";

const Inicio = async () => {
  const usuario: Usuario = await getUsuarioRegistrado();

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <EncabezadoCaja
            nombre={usuario?.nombres || "Invitado"}
            subtitulo="Accesa y controla tu cuenta y transacciones de forma eficiente."
            tipo="saludo"
            titulo="Bienvenido"
          />
          <SaldoTotalCaja
            cuentas={[]}
            totalBancos={1}
            totalSaldoActual={9999}
          />
        </header>
        TRANSACCIONES RECIENTES
      </div>
      <BarraLateralDerecha
        bancos={[{ saldoActual: 1000 }, { saldoActual: 2000 }]}
        usuario={usuario}
        transacciones={[]}
      />
    </section>
  );
};

export default Inicio;
