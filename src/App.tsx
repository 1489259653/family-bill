import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/locale/zh_CN";
import type React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ExportImport from "./components/ExportImport";
import FamilyManager from "./components/FamilyManager";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useTransactions } from "./hooks/useTransactions";
import "@ant-design/v5-patch-for-react-19";
import type { Transaction } from "./types";

const { Content } = Layout;

const Dashboard: React.FC = () => {
  const {
    transactions,
    allTransactions,
    filters,
    summary,
    addTransaction,
    deleteTransaction,
    updateFilters,
    clearFilters,
  } = useTransactions();

  const handleImport = (importedTransactions: Transaction[]) => {
    const updatedTransactions = [...importedTransactions, ...allTransactions];
    localStorage.setItem("family-finance-transactions", JSON.stringify(updatedTransactions));
    window.location.reload();
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        backgroundImage: `
          repeating-linear-gradient(transparent, transparent 50px, var(--bg-line-horizontal) 50px, var(--bg-line-horizontal) 51px),
          repeating-linear-gradient(90deg, transparent, transparent 50px, var(--bg-line-vertical) 50px, var(--bg-line-vertical) 51px),
          linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-end))
        `,
        backgroundSize: '100% 100%',
      }}
    >
      <Content style={{ padding: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Header />

          <ExportImport transactions={allTransactions} onImport={handleImport} />

          <FamilyManager />

          <SummaryCards
            totalIncome={summary.income}
            totalExpense={summary.expense}
            balance={summary.balance}
          />
          <div className="mt-14">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>

          <TransactionList
            transactions={transactions}
            filters={filters}
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </Content>
    </Layout>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginForm />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
