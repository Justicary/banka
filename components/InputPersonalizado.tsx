// 👉 Modulos Externos
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { esquemaAUTH } from "@/lib/utils";

const esquema = esquemaAUTH("sign-up");

interface InputPersonalizadoProps<
  T extends z.ZodTypeAny,
  K extends typeof esquema
> {
  /**Descripción del campo.*/
  descripcion: string;
  /**Etiqueta del campo.*/
  etiqueta: string;
  /**Formulario a validar.*/
  formulario: z.infer<T>;
  /**Nombre del campo.*/
  nombreCampo: FieldPath<z.infer<K>>; // TODO: Mejorar el tipado de este campo.
  /**Deshabilitar entrada.*/
  deshabilitado?: boolean;
  /**Tipo de entrada.*/
  tipo?: "text" | "number" | "email" | "password" | "date";
}

const InputPersonalizado: React.FC<
  InputPersonalizadoProps<z.ZodTypeAny, typeof esquema>
> = ({
  descripcion,
  etiqueta,
  formulario,
  nombreCampo,
  deshabilitado = false,
  tipo = "text",
}) => {
  return (
    <FormField
      control={formulario.control}
      name={nombreCampo}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{etiqueta}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                className="input-class"
                placeholder={descripcion}
                type={tipo}
                disabled={deshabilitado}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default InputPersonalizado;
