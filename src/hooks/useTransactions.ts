import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFormData, FilterOptions } from '../types';
import { transactionsAPI } from '../services/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    payer: 'all',
    date: '',
    billType: 'all'
  });
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    personalIncome: 0,
    personalExpense: 0,
    familyIncome: 0,
    familyExpense: 0
  });

  // 加载交易数据
  const loadTransactions = useCallback(async (billType?: 'all' | 'personal' | 'family') => {
    try {
      const data = await transactionsAPI.getAll(billType);
      setAllTransactions(data);
      setTransactions(data);
      
      // 计算汇总信息
      // 总收入和总支出
      const income = data
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = data
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // 个人账单汇总
      const personalIncome = data
        .filter(t => t.type === 'income' && !t.isFamilyBill)
        .reduce((sum, t) => sum + t.amount, 0);
      const personalExpense = data
        .filter(t => t.type === 'expense' && !t.isFamilyBill)
        .reduce((sum, t) => sum + t.amount, 0);
      
      // 家庭账单汇总
      const familyIncome = data
        .filter(t => t.type === 'income' && t.isFamilyBill)
        .reduce((sum, t) => sum + t.amount, 0);
      const familyExpense = data
        .filter(t => t.type === 'expense' && t.isFamilyBill)
        .reduce((sum, t) => sum + t.amount, 0);
      
      setSummary({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        personalIncome,
        personalExpense,
        familyIncome,
        familyExpense
      });
    } catch (error) {
      console.error('加载交易数据失败:', error);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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
      
      const newTransaction = await transactionsAPI.create(transactionData);
      
      // 重新加载数据以保持同步
      const currentBillType = filters.billType === 'all' ? undefined : filters.billType;
      loadTransactions(currentBillType);
      
      return newTransaction;
    } catch (error) {
      console.error('添加交易失败:', error);
      throw error;
    }
  }, [filters.billType, loadTransactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await transactionsAPI.delete(id);
      // 重新加载数据
      const currentBillType = filters.billType === 'all' ? undefined : filters.billType;
      loadTransactions(currentBillType);
    } catch (error) {
      console.error('删除交易失败:', error);
      throw error;
    }
  }, [filters.billType, loadTransactions]);

  const updateFilters = useCallback(async (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // 如果更新了账单类型，调用API重新筛选
    if (newFilters.billType !== undefined) {
      const billType = newFilters.billType === 'all' ? undefined : newFilters.billType;
      loadTransactions(billType);
    } else {
      // 其他筛选逻辑在前端处理
      filterTransactions(updatedFilters);
    }
  }, [filters, loadTransactions]);

  const clearFilters = useCallback(async () => {
    const resetFilters: FilterOptions = {
      type: 'all',
      category: 'all',
      payer: 'all',
      date: '',
      billType: 'all'
    };
    setFilters(resetFilters);
    loadTransactions(); // 加载所有数据
  }, [loadTransactions]);

  // 前端筛选逻辑
  const filterTransactions = useCallback((currentFilters: FilterOptions) => {
    let filtered = [...allTransactions];
    
    if (currentFilters.type !== 'all') {
      filtered = filtered.filter(t => t.type === currentFilters.type);
    }
    
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(t => t.category === currentFilters.category);
    }
    
    if (currentFilters.date) {
      filtered = filtered.filter(t => t.date === currentFilters.date);
    }
    
    setTransactions(filtered);
  }, [allTransactions]);

  // 当筛选条件变化时进行前端筛选（除了billType）
  useEffect(() => {
    if (filters.billType === 'all') {
      filterTransactions(filters);
    }
  }, [filters, filterTransactions]);

  return {
    transactions,
    allTransactions,
    filters,
    summary,
    addTransaction,
    deleteTransaction,
    updateFilters,
    clearFilters
  };
};