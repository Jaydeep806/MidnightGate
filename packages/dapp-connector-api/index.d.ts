export interface DAppConnectorAPI {
  apiVersion: string;
  name: string;
  icon: string;
  isEnabled: () => Promise<boolean>;
  enable: () => Promise<DAppConnectorWalletAPI>;
}

export interface DAppConnectorWalletAPI {
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses?: () => Promise<string[]>;
  getChangeAddress?: () => Promise<string>;
  getBalance?: () => Promise<string>;
  signData?: (addr: string, payload: string) => Promise<string>;
  signTx?: (tx: any) => Promise<string>;
  submitTx?: (tx: any) => Promise<string>;
  state?: () => Promise<{ address: string; network: string; [key: string]: any }>;
}
