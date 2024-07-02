// 👉 Modulos Externos
import Image from "next/image";
import { redirect } from "next/navigation";
// 👉 Modulos Internos
import BarraLateral from "@/components/BarraLateral";
import NavegadorMovil from "@/components/NavegadorMovil";
import { getUsuarioRegistrado } from "@/lib/actions/user.actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuarioRegistrado: Usuario = await getUsuarioRegistrado();
  if (!usuarioRegistrado) redirect("/sign-in");
  return (
    <main className="flex h-screen w-full font-inter">
      <BarraLateral usuario={usuarioRegistrado} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            alt="icono menu"
            width={30}
            height={30}
          />
          <div>
            <NavegadorMovil usuario={usuarioRegistrado} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
