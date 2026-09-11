export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
