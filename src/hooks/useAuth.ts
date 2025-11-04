import { LoginData, RegisterData, AuthResponse, fetcher } from '../services/api';

// Auth相关hooks
export const apiUseAuth = () => {
  // 登录函数
  const login = async (data: LoginData): Promise<AuthResponse> => {
    return await fetcher<AuthResponse>('/auth/login', 'POST', data);
  };

  // 注册函数
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    return await fetcher<AuthResponse>('/auth/register', 'POST', data);
  };

  return { login, register };
};