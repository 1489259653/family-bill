import axios from 'axios';
import { User, Family, Transaction as TransactionType } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，自动添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理token过期
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    return await api.post('/auth/login', data);
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return await api.post('/auth/register', data);
  }
};

export const familiesAPI = {
  // 创建家庭
  create: async (data: CreateFamilyData): Promise<{ success: boolean; data: Family }> => {
    return await api.post('/families', data);
  },

  // 加入家庭
  join: async (data: JoinFamilyData): Promise<{ success: boolean; data: Family }> => {
    return await api.post('/families/join', data);
  },

  // 获取当前用户的家庭信息
  getCurrent: async (): Promise<{ success: boolean; data: Family | null }> => {
    return await api.get('/families/current');
  },

  // 获取家庭所有成员
  getMembers: async (): Promise<{ success: boolean; data: User[] }> => {
    return await api.get('/families/members');
  },

  // 退出家庭
  leave: async (): Promise<{ success: boolean }> => {
    return await api.post('/families/leave');
  },

  // 获取家庭邀请码
  getInvitationCode: async (): Promise<{ success: boolean; data?: { invitationCode: string } }> => {
    return await api.get('/families/invitation-code');
  }
};

export const transactionsAPI = {
  // 获取交易列表，支持按账单类型筛选
  getAll: async (billType?: 'all' | 'personal' | 'family'): Promise<TransactionType[]> => {
    const params: Record<string, string> = {};
    if (billType === 'personal') {
      params.isFamilyBill = 'false';
    } else if (billType === 'family') {
      params.isFamilyBill = 'true';
    }
    return await api.get('/transactions', { params });
  },

  // 创建交易
  create: async (data: CreateTransactionData): Promise<TransactionType> => {
    return await api.post('/transactions', data);
  },

  // 更新交易
  update: async (id: number, data: Partial<CreateTransactionData>): Promise<TransactionType> => {
    return await api.patch(`/transactions/${id}`, data);
  },

  // 删除交易
  delete: async (id: number): Promise<void> => {
    return await api.delete(`/transactions/${id}`);
  },

  // 获取交易汇总信息
  getSummary: async (): Promise<{ income: number; expense: number; balance: number }> => {
    return await api.get('/transactions/summary');
  }
};