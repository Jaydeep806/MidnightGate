export type NetworkId = 'devnet' | 'testnet' | 'preprod' | 'mainnet';

export interface MidnightNetworkProvider {
  networkId: NetworkId;
  nodeUrl: string;
  indexerUrl?: string;
  submitTx: (signedTx: any) => Promise<string>;
  queryContractState?: (contractAddress: string) => Promise<any>;
  getBlockHeight?: () => Promise<number>;
}
