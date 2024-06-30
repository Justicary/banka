"use client";
// 👉 Modulos Externos
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
// 👉 Modulos Internos
import { cn } from "@/lib/utils";
import { ligasBarraLateral } from "@/constants";

const BarraLateral = ({ usuario }: BarraLateralProps) => {
  const rutaActual = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image
            className="size-[24px] max-xl:size-14"
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Logo"
          />
          <h1 className="sidebar-logo">Banka</h1>
        </Link>
        {ligasBarraLateral.map((link) => {
          const isActive =
            link.route === rutaActual ||
            rutaActual.startsWith(`${link.route}/`);
          return (
            <Link
              key={link.label}
              href={link.route}
              aria-label={link.label}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              <div className="relative size-6">
                <Image
                  className={cn({ "brightness-[3] invert-0": isActive })}
                  src={link.imgURL}
                  fill
                  alt={link.label}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {link.label}
              </p>
            </Link>
          );
        })}
        USUARIO
      </nav>
      PIE DE PAGINA
    </section>
  );
};

export default BarraLateral;
