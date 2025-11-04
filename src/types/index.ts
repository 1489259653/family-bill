export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Family {
  id: number;
  name: string;
  invitationCode: string;
  description?: string;
  createdAt: string;
}

export interface Transaction {
  id: string | number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  payer: User | string;
  date: string;
  timestamp?: string;
  isFamilyBill: boolean;
  family?: Family;
  user?: User;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  payer: string | number;
  date: string;
  isFamilyBill: boolean;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  payer: string;
  date: string;
  billType?: 'all' | 'personal' | 'family';
}

export const CATEGORIES = {
  income: [
    { value: 'salary', label: '工资' },
    { value: 'bonus', label: '奖金' },
    { value: 'investment', label: '投资收益' },
    { value: 'other-income', label: '其他收入' }
  ],
  expense: [
    { value: 'food', label: '餐饮' },
    { value: 'shopping', label: '购物' },
    { value: 'transportation', label: '交通' },
    { value: 'housing', label: '住房' },
    { value: 'entertainment', label: '娱乐' },
    { value: 'healthcare', label: '医疗' },
    { value: 'education', label: '教育' },
    { value: 'other-expense', label: '其他支出' }
  ]
} as const;