// 👉 Modulos Externos
import React from "react";
// 👉 Modulos Internos
import EncabezadoCaja from "@/components/EncabezadoCaja";
import SaldoTotalCaja from "@/components/SaldoTotalCaja";

const Inicio = () => {
  const estaLoggeado = { nombre: "Victor" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <EncabezadoCaja
            nombre={estaLoggeado.nombre || "Invitado"}
            subtitulo="Accesa y controla tu cuenta y transacciones de forma eficiente."
            tipo="saludo"
            titulo="Bienvenido"
          />
        </header>
        <SaldoTotalCaja cuentas={[]} totalBancos={1} totalSaldoActual={9999} />
      </div>
    </section>
  );
};

export default Inicio;
