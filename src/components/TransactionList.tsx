import React from 'react';
import { Card, List, Select, Button, DatePicker, Space, Tag, Popconfirm } from 'antd';
import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { Transaction, CATEGORIES } from '../types';
import dayjs from 'dayjs';

interface TransactionListProps {
  transactions: Transaction[];
  filters: any;
  onUpdateFilters: (filters: any) => void;
  onClearFilters: () => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  filters,
  onUpdateFilters,
  onClearFilters,
  onDeleteTransaction
}) => {
  const getCategoryLabel = (value: string) => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    const category = allCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const getTypeColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'green' : 'red';
  };

  const usedCategories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <Card 
      title="交易记录" 
      extra={
        <Button icon={<FilterOutlined />} onClick={onClearFilters}>
          清除筛选
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space wrap>
          <Select
            value={filters.type}
            onChange={value => onUpdateFilters({ type: value })}
            style={{ width: 120 }}
          >
            <Select.Option value="all">所有类型</Select.Option>
            <Select.Option value="income">收入</Select.Option>
            <Select.Option value="expense">支出</Select.Option>
          </Select>

          <Select
            value={filters.category}
            onChange={value => onUpdateFilters({ category: value })}
            style={{ width: 120 }}
            placeholder="分类筛选"
          >
            <Select.Option value="all">所有分类</Select.Option>
            {usedCategories.map(category => (
              <Select.Option key={category} value={category}>
                {getCategoryLabel(category)}
              </Select.Option>
            ))}
          </Select>

          <DatePicker
            value={filters.date ? dayjs(filters.date) : null}
            onChange={date => onUpdateFilters({ date: date ? date.format('YYYY-MM-DD') : '' })}
            placeholder="日期筛选"
          />
        </Space>

        <List
          dataSource={transactions}
          locale={{ emptyText: '暂无交易记录' }}
          renderItem={transaction => (
            <List.Item
              actions={[
                <Popconfirm
                  title="确定要删除这条记录吗？"
                  onConfirm={() => onDeleteTransaction(transaction.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tag color={getTypeColor(transaction.type)}>
                    {transaction.type === 'income' ? '收入' : '支出'}
                  </Tag>
                }
                title={transaction.description}
                description={
                  <Space>
                    <span>{getCategoryLabel(transaction.category)}</span>
                    <span>{dayjs(transaction.date).format('YYYY-MM-DD')}</span>
                  </Space>
                }
              />
              <div style={{ fontWeight: 'bold', color: transaction.type === 'income' ? '#3f8600' : '#cf1322' }}>
                {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
              </div>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
};

export default TransactionList;