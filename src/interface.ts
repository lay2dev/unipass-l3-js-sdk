export enum ActionType {
  REGISTER = 0,
  ADD_LOCAL_KEY,
  QUICK_ADD_LOCAL_KEY,
  DEL_LOCAL_KEY,
  UPDATE_QUICK_LOGIN,
  UPDATE_RECOVERY_EMAIL,
  START_RECOVERY,
  CANCEL_RECOVERY,
  COMPLETE_RECOVERY,
}

export enum RpcActionType {
  REGISTER = 'register',
  ADD_KEY = 'add_key',
  DEL_KEY = 'delete_key',
  UPDATE_QUICK_LOGIN = 'update_quick_login',
  UPDATE_RECOVERY_EMAIL = 'update_recovery_email',
}

export enum KeyType {
  RSA,
  Secp256K1,
  Secp256R1,
}

export interface UserInfoResult {
  registerEmail: string;
  quickLogin: boolean;
  localKeys: Pubkey[];
  recoveryEmail: RecoveryEmail;
  username: string;
  nonce: string;
  pendingState?: {
    pendingKey: string;
    replaceOld: boolean;
    timeCell: string;
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
}

export interface Action {
  registerEmail?: string;
  username?: string;
  pubkey?: Pubkey;
  recoveryEmail?: RecoveryEmail | null;
  quickLogin?: boolean;
  source?: string;
}

export interface TxStatus {
  ckbTxHash: string;
  status: string;
}

export interface TransactionResult {
  transactionInner: TransactionInner;
  txStatus: TxStatus;
}

export interface ResponseInfo {
  jsonrpc: string;
  result: string | UserInfoResult[] | TransactionResult | TransactionResult[];
  id: number;
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
