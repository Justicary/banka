// 👉 Modulos Externos
import React from "react";
// 👉 Modulos Internos
import EncabezadoCaja from "@/components/EncabezadoCaja";
import SaldoTotalCaja from "@/components/SaldoTotalCaja";
import BarraLateralDerecha from "@/components/BarraLateralDerecha";

const Inicio = () => {
  const usuarioFake: Partial<Usuario> = {
    nombres: "Victor Eduardo",
    apellidos: "Mancera Gallardo",
    email: "vemancera@gmail.com",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <EncabezadoCaja
            nombre={usuarioFake.nombres || "Invitado"}
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
        usuario={usuarioFake}
        transacciones={[]}
      />
    </section>
  );
};

export default Inicio;
