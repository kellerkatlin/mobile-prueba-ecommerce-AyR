export interface RegisterRequest {
  nombres: string;

  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
