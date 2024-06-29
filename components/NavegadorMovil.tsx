"use client";
// 👉 Modulos Externos
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// 👉 Modulos Internos
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
const NavegadorMovil = ({ usuario }: BarraLateralProps) => {
  const rutaActual = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            className="cursor-pointer"
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
          />
        </SheetTrigger>
        <SheetContent className="border-none bg-white" side="left">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 px-4"
          >
            <Image src="/icons/logo.svg" width={34} height={34} alt="Logo" />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              Banka
            </h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((link) => {
                  const isActive =
                    link.route === rutaActual ||
                    rutaActual.startsWith(`${link.route}/`);
                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        key={link.label}
                        href={link.route}
                        aria-label={link.label}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                        <Image
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                          src={link.imgURL}
                          width={20}
                          height={20}
                          alt={link.label}
                        />

                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}
                        >
                          {link.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USUARIO
              </nav>
            </SheetClose>
            PIE DE PAGINA
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default NavegadorMovil;
