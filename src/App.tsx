import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExportImport from './components/ExportImport';
import { useTransactions } from './hooks/useTransactions';

const { Content } = Layout;

const App: React.FC = () => {
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
    <ConfigProvider locale={zhCN}>
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
            
            <SummaryCards 
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              balance={summary.balance}
            />
            
            <TransactionForm onAddTransaction={addTransaction} />
            
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
    </ConfigProvider>
  );
};

export default App;