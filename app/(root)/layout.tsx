// 👉 Modulos Externos
import Image from "next/image";
// 👉 Modulos Internos
import BarraLateral from "@/components/BarraLateral";
import NavegadorMovil from "@/components/NavegadorMovil";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuarioFake: Partial<Usuario> = {
    nombres: "Victor Eduardo",
    apellidos: "Mancera Gallardo",
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <BarraLateral usuario={usuarioFake} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            alt="icono menu"
            width={30}
            height={30}
          />
          <div>
            <NavegadorMovil usuario={usuarioFake} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
