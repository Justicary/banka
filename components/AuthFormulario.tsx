"use client";
// 👉 Modulos Externos
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// 👉 Modulos Internos
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { esquemaAUTH } from "@/lib/utils";
import InputPersonalizado from "./InputPersonalizado";
import { iniciarSesion, registrar } from "@/lib/actions/user.actions";

const AuthFormulario = ({ tipo }: { tipo: "sign-in" | "sign-up" }) => {
  const enrutador = useRouter();
  const esquema = esquemaAUTH(tipo);
  const [usuario, setUsuario] = useState(null);
  const [estaCargando, setEstaCargando] = useState(false);
  // 1. Define el formulario.
  const formulario = useForm<z.infer<typeof esquema>>({
    resolver: zodResolver(esquema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define un controlador de envío.
  const alEnviar = async (values: z.infer<typeof esquema>) => {
    setEstaCargando(true);
    // Realizar algo con los valores.
    try {
      // Iniciar sesión en Appwrite & crear un token.
      if (tipo === "sign-up") {
        const nuevoUsuario = await registrar(values);
        setUsuario(nuevoUsuario);
      }
      if (tipo === "sign-in") {
        const respuesta = await iniciarSesion({
          email: values.email,
          password: values.password,
        });
        if (respuesta) {
          /** Navegar a Inicio */
          enrutador.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEstaCargando(false);
    }
    // ✅ Será type-safe y validado.
    console.log(values);
  };
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Banka Logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Banka
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {usuario
              ? "Ligar Cuenta"
              : tipo === "sign-in"
              ? "Iniciar Sesion"
              : "Crear Cuenta"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {usuario
              ? "Liga tu cuenta para iniciar"
              : "Por favor completa el formulario"}
          </p>
        </div>
      </header>
      {usuario ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <>
          <Form {...formulario}>
            <form
              onSubmit={formulario.handleSubmit(alEnviar)}
              className="space-y-8"
            >
              {tipo === "sign-up" && (
                <>
                  {/* Formulario SIGN-UP */}
                  <div className="flex gap-4">
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="nombres"
                      descripcion="Escribe tu nombre"
                      etiqueta="Nombre(s)"
                    />
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="apellidos"
                      descripcion="Escribe tus apellidos"
                      etiqueta="Apellidos"
                    />
                  </div>
                  <InputPersonalizado
                    formulario={formulario}
                    nombreCampo="direccion1"
                    descripcion="Escribe tu dirección"
                    etiqueta="Dirección"
                  />
                  <InputPersonalizado
                    formulario={formulario}
                    nombreCampo="ciudad"
                    descripcion="Ej. Guadalajara"
                    etiqueta="Ciudad"
                  />
                  <div className="flex gap-4">
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="estado"
                      descripcion="Ej. CDMX"
                      etiqueta="Estado"
                    />
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="codigoPostal"
                      descripcion="Ej. 72000"
                      etiqueta="Código Postal"
                    />
                  </div>
                  <div className="flex gap-4">
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="fdn"
                      descripcion="dd/mm/aaaa"
                      etiqueta="Fecha de Nacimiento"
                    />
                    <InputPersonalizado
                      formulario={formulario}
                      nombreCampo="curp"
                      descripcion="Ej. ABCD123456HPLNLC78"
                      etiqueta="CURP"
                    />
                  </div>
                </>
              )}
              {/* Formulario SIGN-IN */}
              <InputPersonalizado
                formulario={formulario}
                nombreCampo="email"
                descripcion="Escribe tu correo electrónico"
                tipo="email"
                etiqueta="Email"
              />
              <InputPersonalizado
                formulario={formulario}
                nombreCampo="password"
                descripcion="Escribe tu contraseña"
                tipo="password"
                etiqueta="Contraseña"
              />
              <div className="flex flex-col gap-4">
                <Button
                  className="form-btn"
                  type="submit"
                  disabled={estaCargando}
                >
                  {estaCargando ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Cargando...
                    </>
                  ) : tipo === "sign-in" ? (
                    "Iniciar Sesion"
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {tipo === "sign-in"
                ? "¿Aún no tienes una cuenta?"
                : "¿Ya tienes una cuenta?"}{" "}
            </p>
            <Link
              href={tipo === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {tipo === "sign-in" ? "Crear Cuenta" : "Iniciar Sesion"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthFormulario;
