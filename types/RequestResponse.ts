import { executionAsyncResource } from "async_hooks"
import { generateKeyPair } from "crypto"

export interface GenericResponse {
  STATUS: "OK" | "ERROR" | "UNAUTHORIZED";
  MESSAGE?: string
}

export interface LoginResponse extends GenericResponse {
  MESSAGE: "User not found" | "Wrong password" | "Email not confirmed";
  token: string;
  refreshToken: string;
  user: any;
}

export interface RegisterResponse extends GenericResponse {
  MESSAGE:
    | "An account with that email already exists. Please try again."
    | "An account with that email already exists. Please try again."
    | "Email not confirmed";
}

export interface ConfirmResetPassword extends GenericResponse {
  MESSAGE:
  | "User not found"
  | "Reset code does not match"
  | "Passwords do not match"
}