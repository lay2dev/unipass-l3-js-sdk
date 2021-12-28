export enum ActionType {
  REGISTER = 0,
  ADD_LOCAL_KEY,
  QUICK_ADD_LOCAL_KEY,
  DEL_LOCAL_KEY,
  UPDATE_QUICK_LOGIN,
  UPDATE_RECOVERY_EMAIL,
  START_RECOVERY_1,
  START_RECOVERY_2,
  COMPLETE_RECOVERY,
  CANCEL_RECOVERY,
}

export enum RpcActionType {
  REGISTER = 'register',
  QuickRegister = 'quick_register',
  ADD_KEY = 'add_key',
  DEL_KEY = 'delete_key',
  RECOVERY_ADD = 'recovery_add_key',
  RECOVERY_REPLACE = 'recovery_replace',
  UPDATE_QUICK_LOGIN = 'update_quick_login',
  UPDATE_RECOVERY_EMAIL = 'update_recovery_email',
  START_RECOVERY_1 = 'start_recovery_1',
  START_RECOVERY_2 = 'start_recovery_2',
  FINISH_RECOVERY = 'finish_recovery',
  CANCEL_RECOVERY = 'cancel_recovery',
}

export enum KeyType {
  RSA,
  Secp256K1,
  Secp256R1,
}

export enum ChainId {
  devNet = 0,
  mainNet,
}

export interface UserInfoResult {
  registerEmail: string;
  quickLogin: boolean;
  localKeys: Pubkey[];
  username: string;
  nonce: string;
  recoveryEmail?: RecoveryEmail;
  pendingState?: {
    pendingKey: Pubkey;
    replaceOld: boolean;
    startBlock: number;
  };
  commitStatus?: string;
}
export interface RecoveryEmail {
  threshold: number;
  firstN: number;
  emails: string[];
}

export interface Pubkey {
  rsaPubkey?: { e: number; n: string };
  secp256k1?: string;
  secp256r1?: string;
}
export interface Targets {
  to: string;
  amount: string;
}

export interface Message {
  message: string;
}

export interface TransactionInner {
  type: string;
  nonce: string;
  username: string;
  pubkey?: pubkey;
  action: Action;
}
export interface pubkey {
  type: string;
  value: any;
}

export interface HashRawData {
  chainId: ChainId;
  action: ActionType;
  pubKey?: string;
  keyType?: KeyType;
  username: string;
  registerEmail: string;
  nonce?: string;
  threshold?: number;
  resetKeys?: boolean;
  quickLogin?: boolean;
  recoveryEmail?: string[] | null;
  source?: string;
  ethSig?: string;
}

export interface Action {
  registerEmail?: string;
  oriUsername?: string;
  pubkey?: Pubkey;
  recoveryEmail?: RecoveryEmail | null;
  quickLogin?: boolean;
  source?: string;
  replaceOld?: boolean;
}

export interface TxStatus {
  ckbTxHash: string;
  status: string;
}

export interface TransactionResult {
  transactionInner: TransactionInner;
  txStatus: TxStatus;
}

export interface TransactionTemple {
  txStatus: string;
  hash: string;
}

export interface ResponseInfo {
  jsonrpc: string;
  result:
    | string
    | UserInfoResult[]
    | TransactionResult
    | TransactionResult[]
    | TransactionTemple[];
  id: number;
  error: ResponseError;
}

export interface ResponseError {
  code: number;
  message: string;
  data: string;
}

export interface TransactionParams {
  inner: TransactionInner;
  sig: Sign;
}
export interface Sign {
  signature: string;
  emailHeader?: string[] | string;
  oldkeySignature?: string;
  unipassSignature?: string;
  adminSignature?: string;
}

export interface UniTokenModel {
  transform(): any;
  serializeJson(): object | string;
}

export interface FormatOptions {
  section?: 'integer' | 'decimal';
  pad?: boolean;
  commify?: boolean;
  fixed?: number;
}
