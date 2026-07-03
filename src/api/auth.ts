import { apiClient } from './client';
import type { AuthCredentials, LoginResponse } from '../types/user';

export const authApi = {
  login: (credentials: AuthCredentials) =>
    apiClient
      .post<LoginResponse>('/auth/login', credentials)
      .then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),

  me: () =>
    apiClient
      .get<LoginResponse>('/auth/me')
      .then((r) => r.data),
};
