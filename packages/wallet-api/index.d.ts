export interface WalletAPI {
  getAddress: () => Promise<string>;
  sign: (data: Uint8Array) => Promise<Uint8Array>;
}
