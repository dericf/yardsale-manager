export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  initials: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}