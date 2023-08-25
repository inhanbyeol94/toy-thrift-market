export interface IClientVerifyIdentity {
  code: string;
  type: number;
  sequence: number;
  verify: boolean;
}
