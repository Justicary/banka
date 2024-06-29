// 👉 Modulos Externos
"use client";
import React from "react";
import CountUp from "react-countup";

const ContadorAnimado = ({ cantidad }: { cantidad: number }) => {
  return (
    <div className="w-full">
      <CountUp
        decimal="."
        decimals={2}
        duration={2.75}
        prefix="$ "
        end={cantidad}
      />
    </div>
  );
};

export default ContadorAnimado;
