/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type registrarParams = {
  nombres?: string;
  apellidos?: string;
  direccion1?: string;
  direccion2?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  fdn?: string;
  curp?: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type Usuario = {
  $id: string;
  email: string;
  usuarioId: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  nombres: string;
  apellidos: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  fdn: string;
  curp: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare type Cuenta = {
  id: string;
  saldoDisponible: number;
  saldoActual: number;
  nombreOficial: string;
  mascara: string;
  institucionId: string;
  nombre: string;
  tipo: string;
  subtipo: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Transaccion = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  type: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};

declare type Banco = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type crearClienteDwollaParams = {
  /**Nombres legales del individuo.*/
  firstName: string;
  /**Apellidos legales del individuo.*/
  lastName: string;
  /**Correo electrónico del individuo.*/
  email: string;
  /**Tipo de identidad del cliente verificado. "Personal" para individuos y "Business" para empresas.*/
  type: string;
  /**Dirección fisica del individuo(calle y numero).*/
  address1: string;
  /**(opcional)Departamento, piso, suite, lote, etc.*/
  address2?: string;
  /**Ciudad de residencia del individuo.*/
  city: string;
  /**Estado de residencia del individuo.*/
  state: string;
  /**Codigo postal del individuo.*/
  postalCode: string;
  /**Fecha de nacimiento del individuo en formato YYYY-MM-DD. Entre 18 y 125 años.*/
  dateOfBirth: string;
  /**Los ultimos 4 digitos del numero de identidad del individuo.*/
  ssn: string;
};

declare interface TarjetaBancariaProps {
  cuenta: Partial<Cuenta>;
  nombreUsuario: string;
  mostrarSaldo?: boolean;
}

declare interface BankInfoProps {
  cuenta: Cuenta;
  appwriteItemId?: string;
  tipo: "full" | "card";
}

declare interface EncabezadoCajaProps {
  nombre?: string;
  subtitulo: string;
  tipo?: "titulo" | "saludo";
  titulo: string;
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: Usuario;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLigaProps {
  usuario: Usuario;
  variante?: "primario" | "fantasma";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Cuenta[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Cuenta;
  appwriteItemId?: string;
}

declare interface SaldoTotalCajaProps {
  cuentas: Cuenta[];
  totalBancos: number;
  totalSaldoActual: number;
}

declare interface PiePaginaProps {
  usuario: Usuario;
  tipo?: "mobile" | "desktop";
}

declare interface BarraLateralDerechaProps {
  usuario: Usuario;
  transacciones: Transaccion[];
  bancos: Partial<Banco>[] & Partial<Cuenta>[];
}

declare interface BarraLateralProps {
  usuario: Usuario;
}

declare interface RecentTransactionsProps {
  accounts: Cuenta[];
  transactions: Transaccion[];
  appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaccion[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaccion[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface GraficoDonaProps {
  cuentas: Cuenta[];
}

declare interface PaymentTransferFormProps {
  accounts: Cuenta[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CrearFuenteFinanciamientoOpciones {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface iniciarSesionProps {
  email: string;
  password: string;
}

declare interface getUsuarioInfoProps {
  usuarioID: string;
}

declare interface intercambiarTokenPublicoProps {
  tokenPublico: string;
  usuario: Usuario;
}

declare interface crearCuentaBancariaProps {
  tokenPermanente: string;
  usuarioID: string;
  cuentaID: string;
  bancoID: string;
  fuenteFinanciamientoURL: string;
  shareableID: string;
}

declare interface getBancosProps {
  usuarioID: string;
}

declare interface getBancoProps {
  documentoID: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}
