import { useState } from "react";
import useSWR from "swr";
import { buildUrlWithParams, type CreateTransactionData, fetcher } from "../services/api";

// 交易汇总数据类型
export interface TransactionSummary {
  income: string;
  expense: string;
  balance: string;
}

// 默认汇总数据，避免undefined错误
const defaultSummary: TransactionSummary = {
  income: "0",
  expense: "0",
  balance: "0",
};

// Transactions相关hooks
export const useTransactions = (billType?: "all" | "personal" | "family") => {
  // 添加filters状态管理
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    dateRange: null,
    type: "",
    isFamilyBill: undefined,
  });

  // 构建查询URL
  const getTransactionsUrl = () => {
    const params: Record<string, string> = {};
    if (billType === "personal") {
      params.isFamilyBill = "false";
    } else if (billType === "family") {
      params.isFamilyBill = "true";
    }
    return buildUrlWithParams("/transactions", params);
  };

  // 获取所有交易（不筛选billType）
  const { data: allTransactions = [] } = useSWR(
    buildUrlWithParams("/transactions"),
    fetcher<any[]>
  );

  // 获取交易列表（可能按billType筛选）
  const {
    data: transactions = [],
    error: transactionsError,
    mutate: mutateTransactions,
  } = useSWR(getTransactionsUrl(), fetcher<any[]>);

  // 获取交易汇总
  // {income: "0", expense: "22.5", balance: "-22.5"}
  const {
    data: summaryData,
    error: summaryError,
    mutate: mutateSummary,
  } = useSWR<TransactionSummary>("/transactions/summary", fetcher);

  // 使用默认值确保summary不为undefined
  const summary = summaryData || defaultSummary;
  // 创建交易（重命名为addTransaction以匹配App.tsx中的使用）
  const addTransaction = async (data: CreateTransactionData) => {
    // Convert Date object to string in YYYY-MM-DD format for API
    const formattedData = data;

    const result = await fetcher("/transactions", "POST", formattedData);
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  // 更新交易
  const updateTransaction = async (id: number, data: Partial<CreateTransactionData>) => {
    // Format date if it's included in the update data
    const formattedData = { ...data };

    const result = await fetcher(`/transactions/${id}`, "PATCH", formattedData);
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  // 删除交易
  const deleteTransaction = async (id: number) => {
    const result = await fetcher(`/transactions/${id}`, "DELETE");
    mutateTransactions(); // 重新获取交易列表
    mutateSummary(); // 重新获取汇总信息
    return result;
  };

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 清除筛选条件
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      dateRange: null,
      type: "",
      isFamilyBill: undefined,
    });
  };

  return {
    transactions,
    allTransactions,
    filters,
    summary,
    transactionsError,
    summaryError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilters,
    clearFilters,
    refreshTransactions: mutateTransactions,
    refreshSummary: mutateSummary,
  };
};
