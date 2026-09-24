export class MidnightHttpClient {
  constructor(baseUrl: string);
  getHealth(): Promise<{ status: string; version: string }>;
  postProof(payload: any): Promise<{ proof: string; digest: string }>;
}
