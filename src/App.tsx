import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExportImport from './components/ExportImport';
import FamilyManager from './components/FamilyManager';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { useTransactions } from './hooks/useTransactions';
import '@ant-design/v5-patch-for-react-19';

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
    clearFilters
  } = useTransactions();

  const handleImport = (importedTransactions: any[]) => {
    const updatedTransactions = [...importedTransactions, ...allTransactions];
    localStorage.setItem('family-finance-transactions', JSON.stringify(updatedTransactions));
    window.location.reload();
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Header />
          
          <ExportImport 
            transactions={allTransactions} 
            onImport={handleImport} 
          />
          
          <FamilyManager />
          
          <SummaryCards 
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            balance={summary.balance}
            personalIncome={summary.personalIncome}
            personalExpense={summary.personalExpense}
            familyIncome={summary.familyIncome}
            familyExpense={summary.familyExpense}
          />
          <div className='mt-14'>
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
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginForm />} 
      />
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