import axios from 'axios';

import { User } from '../types';

// 根据环境变量设置API基础URL
// 本地开发环境通过Vite代理访问API，生产环境通过Nginx代理
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动附加token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理响应
axiosInstance.interceptors.response.use(
  (response) => {
    // 直接返回响应数据，无论后端是否包装
    return response.data;
  },
  (error) => {
    // 避免多个并发请求同时触发重定向
    if (error.response?.status === 401) {
      // 检查是否已经在处理重定向
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 使用setTimeout避免阻塞当前执行栈
        setTimeout(() => {
          window.location.href = '/login';
        }, 0);
      }
    }
    // 抛出响应中的数据或者原始错误
    throw error.response?.data || error;
  }
);

// fetcher函数
export const fetcher = async <T = any>(url: string, method: string = 'GET', data?: any): Promise<T> => {
  const config: any = {
    method,
    url,
  };

  if (method !== 'GET' && data) {
    config['data'] = data;
  }

  try {
    const response = await axiosInstance(config);
    return response as T;
  } catch (error) {
    throw error;
  }
};

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateFamilyData {
  name: string;
  description?: string;
}

export interface JoinFamilyData {
  invitationCode: string;
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  isFamilyBill: boolean;
  payerId?: number;
}

// 工具函数：处理查询参数
export const buildUrlWithParams = (baseUrl: string, params?: Record<string, string>) => {
  if (!params || Object.keys(params).length === 0) return baseUrl;
  const queryString = new URLSearchParams(params).toString();
  return `${baseUrl}?${queryString}`;
};

// 先导入hooks中的函数
import { apiUseAuth as importedApiUseAuth } from '../hooks/useAuth';
import * as familiesHooks from '../hooks/useFamilies';
import * as transactionsHooks from '../hooks/useTransactions';

// 重新导出hooks中的内容
export const apiUseAuth = importedApiUseAuth;
// 为了兼容现有的导入，保留useAuth导出
export const useAuth = importedApiUseAuth;

// 导出其他hooks
export const useFamilies = familiesHooks.useFamilies;
export const useTransactions = transactionsHooks.useTransactions;