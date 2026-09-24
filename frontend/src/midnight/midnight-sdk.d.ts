declare module '@midnight-ntwrk/dapp-connector-api' {
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
}

declare module '@midnight-ntwrk/midnight-js-network-provider' {
  export type NetworkId = 'devnet' | 'testnet' | 'preprod' | 'mainnet';

  export interface MidnightNetworkProvider {
    networkId: NetworkId;
    nodeUrl: string;
    indexerUrl?: string;
    submitTx: (signedTx: any) => Promise<string>;
    queryContractState?: (contractAddress: string) => Promise<any>;
    getBlockHeight?: () => Promise<number>;
  }
}

declare module '@midnight-ntwrk/compact-runtime' {
  export interface WitnessContext {
    userAssetValue: bigint;
    userSecretSalt: Uint8Array | string;
  }

  export interface CompactRuntimeWitnessContext {
    witnessContext: WitnessContext;
    evaluate: <T>(witnessFn: () => T) => T;
  }
}

declare module '@midnight-ntwrk/midnight-js-types' {
  export type ContractAddress = string;
  export type NullifierHash = string;
  export type ProofBytes = Uint8Array;
}

declare module '@midnight-ntwrk/ledger' {
  export interface LedgerState {
    verified_nullifiers: Set<string>;
    total_verified_investors: bigint;
    default_threshold_usd: bigint;
    authority_id: string;
  }
}

declare module '@midnight-ntwrk/midnight-js-contracts' {
  export interface Contract<L = any, C = any> {
    address: string;
    circuits: C;
    initialState: L;
  }
}

declare module '@midnight-ntwrk/midnight-js-http-client' {
  export class MidnightHttpClient {
    constructor(baseUrl: string);
    getHealth(): Promise<{ status: string; version: string }>;
    postProof(payload: any): Promise<{ proof: string; digest: string }>;
  }
}

declare module '@midnight-ntwrk/wallet-api' {
  export interface WalletAPI {
    getAddress: () => Promise<string>;
    sign: (data: Uint8Array) => Promise<Uint8Array>;
  }
}

declare module '@midnight-ntwrk/wallet' {
  export interface KeyPair {
    publicKey: string;
    secretKey: string;
  }
}
