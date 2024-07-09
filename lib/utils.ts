/* eslint-disable no-prototype-builtins */
// ( ͡❛ ͜ʖ ͡❛) 👉 Modulos Externos
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaccion[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extraeIDClienteDeURL(url: string) {
  // Divide la cadena de texto en partes usando '/'
  const partes = url.split("/");

  // Extrae la ultima parte que representa el ID del cliente.
  const clienteID = partes[partes.length - 1];

  return clienteID;
}

export function encriptarID(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

/**Genera un esquema Zod para el tipo de autenticación dado.
 * @param {string} tipo - El tipo de autenticación, puede ser "sign-in" o "sign-up".
 * @return {z.ZodObject} - Objeto esquema Zod con la estructura correcta en base al tipo de autenticación.*/
export const esquemaAUTH = (tipo: string) =>
  z.object({
    // Registro
    apellidos:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().min(3, "Apellidos demasiado cortos..."),
    codigoPostal:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().min(5, "Código postal demasiado corto..."),
    curp:
      tipo === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(5, "NSS demasiado corto...")
            .max(16, "NSS demasiado largo..."),
    direccion1:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().max(50, "Dirección demasiado larga..."),
    ciudad:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().min(2, "Ciudad demasiado corta..."),
    estado:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().min(2, "Estado demasiado corto..."),
    fdn:
      tipo === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(
              10,
              "Tu fecha de nacimiento debe observar el formato AAAA-MM-DD."
            )
            .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
              message:
                "El formato de la fecha de nacimiento debe ser AAAA-MM-DD",
            }),
    nombres:
      tipo === "sign-in"
        ? z.string().optional()
        : z.string().min(3, "Nombre demasiado corto..."),
    // Ambos
    email: z.string().email("Correo invalido..."),
    password: z.string().min(8, "Contraseña demasiado corta..."),
  });
