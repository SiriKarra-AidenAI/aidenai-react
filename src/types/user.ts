export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token?: string;
}
