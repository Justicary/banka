import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TarjetaBancaria = ({
  cuenta,
  nombreUsuario,
  mostrarSaldo = true,
}: TarjetaBancariaProps) => {
  return (
    <div className="flex flex-col">
      <Link href={`/`} className="bank-card">
        <div className="bank-card_content">
          <h1 className="text-16 font-semibold text-white">
            {cuenta.nombre || "Banco Tio McPato"}
          </h1>
          <p className="font-ibm-plex-serif font-black text-white">
            {formatAmount(cuenta?.saldoActual || 0)}
          </p>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {nombreUsuario.split(" ")[0]} {nombreUsuario.split(" ")[2]}
              </h1>
              <h2 className="text-12 font-semibold text-white">●●/●●</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{cuenta.mascara || "4242"}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src="/icons/Paypass.svg" width={20} height={24} alt="pay" />
          <Image
            className="ml-5"
            src="/icons/mastercard.svg"
            width={45}
            height={32}
            alt="mastercard"
          />
        </div>
        <Image
          className="absolute left-0 top-0"
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
        />
      </Link>

      {/* COPIAR */}
    </div>
  );
};

export default TarjetaBancaria;
