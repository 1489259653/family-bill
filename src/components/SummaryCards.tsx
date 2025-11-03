import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      <Card>
        <Statistic
          title="总收入"
          value={totalIncome}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
          suffix="¥"
        />
      </Card>
      
      <Card>
        <Statistic
          title="总支出"
          value={totalExpense}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
          prefix={<ArrowDownOutlined />}
          suffix="¥"
        />
      </Card>
      
      <Card>
        <Statistic
          title="结余"
          value={balance}
          precision={2}
          valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
          prefix={<DollarOutlined />}
          suffix="¥"
        />
      </Card>
    </div>
  );
};

export default SummaryCards;