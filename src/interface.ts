export interface TokenInfoResult {
  symbol: string;
  name: string;
  decimal: number;
  issuer: string;
  totalSupply: string;
}

export interface Targets {
  to: string;
  amount: string;
}

export interface Message {
  message: string;
}

export interface UniTransaction {
  typeId: string;
  from: string;
  nonce: string;
  totalAmount: string;
  fee: string;
  targets: Targets[];
}

export interface TxStatus {
  ckbTxHash: string;
  status: string;
}

export interface TransactionResult {
  transaction: UniTransaction;
  txStatus: TxStatus;
}

export interface ResponseInfo {
  jsonrpc: string;
  result: string | TokenInfoResult | TransactionResult;
  id: number;
}

export interface TransactionParams {
  raw: UniTransaction;
  sig: string;
}

export interface UniTokenModel {
  transform(): any;
  serializeJson(): object;
}

export interface FormatOptions {
  section?: 'integer' | 'decimal';
  pad?: boolean;
  commify?: boolean;
  fixed?: number;
}
