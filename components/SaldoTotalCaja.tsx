// 👉 Modulos Externos
import React from "react";
// 👉 Modulos Internos
import ContadorAnimado from "./ContadorAnimado";
import GraficoDona from "./GraficoDona";

const SaldoTotalCaja = ({
  cuentas = [],
  totalSaldoActual,
  totalBancos,
}: SaldoTotalCajaProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <GraficoDona cuentas={cuentas} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Cuentas Bancarias: {totalBancos}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Saldo Actual Total</p>
          <div className="total-balance-amount flex-center gap-2">
            <ContadorAnimado cantidad={totalSaldoActual} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaldoTotalCaja;
