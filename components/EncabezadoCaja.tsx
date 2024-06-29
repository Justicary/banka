import React from "react";

const EncabezadoCaja = ({
  nombre,
  subtitulo,
  tipo = "titulo",
  titulo,
}: EncabezadoCajaProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {titulo}
        {tipo === "saludo" && (
          <span className="text-bankGradient">&nbsp;{nombre}</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtitulo}</p>
    </div>
  );
};

export default EncabezadoCaja;
