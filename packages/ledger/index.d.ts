export interface LedgerState {
  verified_nullifiers: Set<string>;
  total_verified_investors: bigint;
  default_threshold_usd: bigint;
  authority_id: string;
}
