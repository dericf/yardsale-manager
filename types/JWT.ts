import { UUID } from "./General";

export interface JWTToken {
  email: string;
  aud: string;
  exp: number;
  alg: string;
  expires_at: string;
  "https://hasura.io/jwt/claims": HasuraClaims;
}

interface HasuraClaims {
  "x-hasura-allowed-roles": Array<string>;
  "x-hasura-default-role": string;
  "x-hasura-user-id": UUID;
  "x-hasura-org-id": string;
  "x-hasura-role": string;
}
