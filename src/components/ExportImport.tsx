import React from 'react';
import { Button, Space, message } from 'antd';
import { ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Transaction, CATEGORIES } from '../types';

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ transactions, onImport }) => {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      message.warning('没有数据可导出');
      return;
    }

    const headers = ['日期', '类型', '分类', '金额', '描述'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type === 'income' ? '收入' : '支出',
        getCategoryLabel(t.category),
        t.amount,
        `"${t.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `家庭记账_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('数据导出成功');
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').slice(1);
        
        const importedTransactions = lines
          .filter(line => line.trim())
          .map(line => {
            const [date, typeStr, categoryStr, amountStr, description] = line.split(',');
            
            return {
              id: Date.now().toString() + Math.random(),
              type: typeStr === '收入' ? 'income' : 'expense',
              category: getCategoryValue(categoryStr),
              amount: parseFloat(amountStr),
              description: description.replace(/^"/, '').replace(/"$/, ''),
              date: date,
              timestamp: new Date().toISOString()
            } as Transaction;
          });

        onImport(importedTransactions);
        message.success(`成功导入 ${importedTransactions.length} 条记录`);
      } catch (error) {
        message.error('导入失败，请检查文件格式');
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const getCategoryLabel = (value: string) => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    const category = allCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const getCategoryValue = (label: string) => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    const category = allCategories.find(cat => cat.label === label);
    return category ? category.value : label;
  };

  return (
    <Space style={{ marginBottom: '16px', justifyContent: 'center', width: '100%' }}>
      <Button icon={<ExportOutlined />} onClick={exportToCSV}>
        导出数据
      </Button>
      
      <input
        type="file"
        accept=".csv"
        onChange={importFromCSV}
        style={{ display: 'none' }}
        id="import-file"
      />
      <Button 
        icon={<ImportOutlined />}
        onClick={() => document.getElementById('import-file')?.click()}
      >
        导入数据
      </Button>
    </Space>
  );
};

export default ExportImport;