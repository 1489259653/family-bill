import { useState, useCallback } from 'react';
import { Transaction, TransactionFormData, FilterOptions } from '../types';
import { useTransactions as useSWRTransactions } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useTransactions = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    payer: 'all',
    date: '',
    billType: 'all'
  });
  
  const { transactions = { data: [] }, createTransaction, updateTransaction, deleteTransaction: swrDeleteTransaction } = useSWRTransactions() || {};
  const { logout } = useAuth();
  const allTransactions = transactions?.data || [];

  // 计算汇总信息
  const summary = {
    totalIncome: allTransactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    totalExpense: allTransactions
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    balance: allTransactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0) - 
      allTransactions
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    personalIncome: allTransactions
      .filter((t: Transaction) => t.type === 'income' && !t.isFamilyBill)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    personalExpense: allTransactions
      .filter((t: Transaction) => t.type === 'expense' && !t.isFamilyBill)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    familyIncome: allTransactions
      .filter((t: Transaction) => t.type === 'income' && t.isFamilyBill)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    familyExpense: allTransactions
      .filter((t: Transaction) => t.type === 'expense' && t.isFamilyBill)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
  };

  const addTransaction = useCallback(async (formData: TransactionFormData) => {
    try {
      // 转换为API需要的格式
      const transactionData = {
        type: formData.type,
        category: formData.category,
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        isFamilyBill: formData.isFamilyBill || false,
        payerId: formData.isFamilyBill && typeof formData.payer === 'number' ? formData.payer : undefined
      };
      
      const newTransaction = await createTransaction(transactionData);
      return newTransaction;
    } catch (error) {
      console.error('添加交易失败:', error);
      // 处理401未授权错误
      const errorObj = error as any;
      if (errorObj.statusCode === 401) {
        logout();
      }
      throw error;
    }
  }, [createTransaction, logout]);

  const deleteTransaction = useCallback(async (transactionId: number) => {
    try {
      await swrDeleteTransaction(transactionId);
    } catch (error) {
      console.error('删除交易失败:', error);
      // 处理401未授权错误
      const errorObj = error as any;
      if (errorObj.statusCode === 401) {
        logout();
      }
      throw error;
    }
  }, [swrDeleteTransaction, logout]);

  // 计算经过筛选的交易列表
  const filteredTransactions = useCallback(() => {
    let filtered = [...allTransactions];
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.date) {
      filtered = filtered.filter(t => t.date === filters.date);
    }
    
    return filtered;
  }, [allTransactions, filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  }, [filters]);

  const clearFilters = useCallback(() => {
    const resetFilters: FilterOptions = {
      type: 'all',
      category: 'all',
      payer: 'all',
      date: '',
      billType: 'all'
    };
    setFilters(resetFilters);
  }, []);

  return {
    transactions: filteredTransactions(),
    allTransactions,
    filters,
    summary,
    addTransaction,
    deleteTransaction,
    updateFilters,
    clearFilters
  };
};