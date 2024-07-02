// 👉 Modulos Externos
import Image from "next/image";
import { useRouter } from "next/navigation";
// 👉 Modulos Internos
import { desconectarCuenta } from "@/lib/actions/user.actions";

const PiePagina = ({ usuario, tipo = "desktop" }: PiePaginaProps) => {
  const enrutador = useRouter();
  const controlDesconectar = async () => {
    const desconectado = await desconectarCuenta();
    if (desconectado) enrutador.push("/sign-in");
  };
  return (
    <footer className="footer">
      <div className={tipo === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{usuario?.nombres[0]}</p>
      </div>
      <div
        className={tipo === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-normal text-gray-700">
          {usuario?.nombres}
        </h1>
        <p className="text-14 truncate font-semibold text-gray-700 font-semibold">
          {usuario?.email}
        </p>
      </div>
      <div className="footer_image" onClick={controlDesconectar}>
        <Image src="/icons/logout.svg" fill alt="icono descontectar" />
      </div>
    </footer>
  );
};

export default PiePagina;
