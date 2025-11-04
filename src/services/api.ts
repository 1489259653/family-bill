import axios from 'axios';
import useSWR from 'swr';
import { User, Family, Transaction as TransactionType } from '../types';

const API_BASE_URL = 'http://localhost:3001';

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
export const fetcher = async (url: string, method: string = 'GET', data?: any) => {
  const config: any = {
    method,
    url,
  };

  if (method !== 'GET' && data) {
    config['data'] = data;
  }

  try {
    const response = await axiosInstance(config);
    return response;
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
  date: string;
  isFamilyBill: boolean;
  payerId?: number;
}

// 工具函数：处理查询参数
const buildUrlWithParams = (baseUrl: string, params?: Record<string, string>) => {
  if (!params || Object.keys(params).length === 0) return baseUrl;
  const queryString = new URLSearchParams(params).toString();
  return `${baseUrl}?${queryString}`;
};

// Auth相关hooks
export const useAuth = () => {
  // 登录函数
  const login = async (data: LoginData): Promise<AuthResponse> => {
    return await fetcher('/auth/login', 'POST', data);
  };

  // 注册函数
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    return await fetcher('/auth/register', 'POST', data);
  };

  return { login, register };
};

// Families相关hooks
export const useFamilies = () => {
  // 获取当前家庭信息
  const { data: currentFamily, error: currentFamilyError, mutate: mutateCurrentFamily } = 
    useSWR('/families/current', fetcher);

  // 获取家庭成员
  const { data: familyMembers, error: familyMembersError, mutate: mutateFamilyMembers } = 
    useSWR('/families/members', fetcher);

  // 获取邀请码
  const { data: invitationCode, error: invitationCodeError } = 
    useSWR('/families/invitation-code', fetcher);

  // 创建家庭
  const createFamily = async (data: CreateFamilyData) => {
    const result = await fetcher('/families', 'POST', data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 加入家庭
  const joinFamily = async (data: JoinFamilyData) => {
    const result = await fetcher('/families/join', 'POST', data);
    mutateCurrentFamily(); // 重新获取当前家庭信息
    return result;
  };

  // 退出家庭
  const leaveFamily = async () => {
    const result = await fetcher('/families/leave', 'POST');
    mutateCurrentFamily(null); // 清除当前家庭信息
    return result;
  };

  return {
    currentFamily,
    currentFamilyError,
    familyMembers,
    familyMembersError,
    invitationCode,
    invitationCodeError,
    createFamily,
    joinFamily,
    leaveFamily,
    refreshCurrentFamily: mutateCurrentFamily,
    refreshFamilyMembers: mutateFamilyMembers
  };
};

// Transactions相关hooks
export const useTransactions = (billType?: 'all' | 'personal' | 'family') => {
  // 构建查询URL
  const getTransactionsUrl = () => {
    const params: Record<string, string> = {};
    if (billType === 'personal') {
      params.isFamilyBill = 'false';
    } else if (billType === 'family') {
      params.isFamilyBill = 'true';
    }
    return buildUrlWithParams('/transactions', params);
  };

  // 获取交易列表
  const { 
    data: transactions, 
    error: transactionsError, 
    mutate: mutateTransactions 
  } = useSWR(getTransactionsUrl(), fetcher);

  // 获取交易汇总
  const { 
    data: summary, 
    error: summaryError, 
    mutate: mutateSummary 
  } = useSWR('/transactions/summary', fetcher);

  // 创建交易
  const createTransaction = async (data: CreateTransactionData) => {
    const result = await fetcher('/transactions', 'POST', data);
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  // 更新交易
  const updateTransaction = async (id: number, data: Partial<CreateTransactionData>) => {
    const result = await fetcher(`/transactions/${id}`, 'PATCH', data);
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  // 删除交易
  const deleteTransaction = async (id: number) => {
    const result = await fetcher(`/transactions/${id}`, 'DELETE');
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  return {
    transactions,
    transactionsError,
    summary,
    summaryError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: mutateTransactions,
    refreshSummary: mutateSummary
  };
};