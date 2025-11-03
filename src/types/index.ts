export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  timestamp: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  date: string;
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