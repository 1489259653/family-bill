import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFormData, FilterOptions } from '../types';
import { getStoredTransactions, saveTransactions, calculateSummary } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    payer: 'all',
    date: ''
  });

  useEffect(() => {
    setTransactions(getStoredTransactions());
  }, []);

  const addTransaction = useCallback((formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString()
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  }, [transactions]);

  const deleteTransaction = useCallback((id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  }, [transactions]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: 'all',
      category: 'all',
      payer: 'all',
      date: ''
    });
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    if (filters.payer !== 'all' && transaction.payer !== filters.payer) {
      return false;
    }
    if (filters.date && transaction.date !== filters.date) {
      return false;
    }
    return true;
  });

  const summary = calculateSummary(transactions);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    filters,
    summary,
    addTransaction,
    deleteTransaction,
    updateFilters,
    clearFilters
  };
};