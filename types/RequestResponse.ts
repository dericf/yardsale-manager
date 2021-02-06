export interface GenericResponse {
  STATUS: "OK" | "ERROR" | "UNAUTHORIZED";
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
