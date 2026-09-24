export interface WitnessContext {
  userAssetValue: bigint;
  userSecretSalt: Uint8Array | string;
}

export interface CompactRuntimeWitnessContext {
  witnessContext: WitnessContext;
  evaluate: <T>(witnessFn: () => T) => T;
}
