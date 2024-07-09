import Image from "next/image";
import Link from "next/link";
import React from "react";
import TarjetaBancaria from "./TarjetaBancaria";

const BarraLateralDerecha = ({
  bancos,
  transacciones,
  usuario,
}: BarraLateralDerechaProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />

        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {usuario?.nombres?.[0]}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {usuario?.nombres} {usuario?.apellidos}
            </h1>
            <p className="profile-email">
              {usuario?.email || "email@inexistente"}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">Mis Bancos</h2>
          <Link href="/" className="flex gap-2">
            <Image
              className="size-6"
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="agregar"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              Agregar Banco
            </h2>
          </Link>
        </div>
        {bancos.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <TarjetaBancaria
                key={bancos[0].$id}
                cuenta={bancos[0]}
                nombreUsuario={`${usuario?.nombres.split(" ")[0]} ${
                  usuario?.apellidos.split(" ")[0]
                }`}
                mostrarSaldo={false}
              />
            </div>
            {bancos[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <TarjetaBancaria
                  key={bancos[1].$id}
                  cuenta={bancos[1]}
                  nombreUsuario={`${usuario?.nombres.split(" ")[0]} ${
                    usuario?.apellidos.split(" ")[0]
                  }`}
                  mostrarSaldo={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default BarraLateralDerecha;
