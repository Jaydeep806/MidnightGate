class MidnightHttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async getHealth() {
    return { status: 'healthy', version: '0.2.0' };
  }
  async postProof(payload) {
    return { proof: '0xproof', digest: '0xdigest' };
  }
}

module.exports = { MidnightHttpClient };
