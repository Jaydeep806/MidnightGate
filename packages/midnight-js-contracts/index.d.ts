export interface Contract<L = any, C = any> {
  address: string;
  circuits: C;
  initialState: L;
}
