import React from 'react';
import { Card, List, Button, Tag, Space, Popconfirm, message, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';



interface TransactionListProps {
  transactions: Transaction[];
  filters: any;
  onUpdateFilters: (filters: any) => void;
  onClearFilters: () => void;
  onDeleteTransaction: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  filters,
  onUpdateFilters,
  onClearFilters,
  onDeleteTransaction,
}) => {
  const { logout } = useAuth();
  const handleDelete = async (id: number) => {
    try {
      await onDeleteTransaction(id);
      message.success('删除成功');
    } catch (error) {
      // 处理401未授权错误
      const errorObj = error as any;
      if (errorObj.statusCode === 401) {
        message.error('登录已过期，请重新登录');
        logout();
      } else {
        message.error('删除失败');
      }
    }
  };

  return (
    <Card 
      title={`交易记录 (${transactions.length} 条)`}
      style={{ marginTop: 24 }}
      extra={
        <Space>
          <Select
            defaultValue={filters.billType || 'all'}
            style={{ width: 150 }}
            onChange={(value) => onUpdateFilters({ billType: value })}
          >
            <Select.Option value="all">全部账单</Select.Option>
            <Select.Option value="personal">个人账单</Select.Option>
            <Select.Option value="family">家庭账单</Select.Option>
          </Select>
          {Object.keys(filters).some(key => filters[key] !== 'all' && filters[key] !== '') && (
            <Button type="link" onClick={onClearFilters}>
              清除筛选
            </Button>
          )}
        </Space>
      }
    >
      <List
        dataSource={transactions}
        renderItem={(transaction) => (
          <List.Item
            actions={[
              <Popconfirm
                title="确定要删除这条记录吗？"
                onConfirm={() => transaction.id && handleDelete(Number(transaction.id))}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>{(transaction as Transaction).title || ''}</span>
                  <Tag color={transaction.type === 'income' ? 'green' : 'red'}>
                    {transaction.type === 'income' ? '收入' : '支出'}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <span>金额: ¥{transaction.amount}</span>
                  <span>分类: {transaction.category}</span>
                  {transaction.isFamilyBill && (
                    <Tag color="blue">家庭账单</Tag>
                  )}
                  {transaction.description && (
                    <span>备注: {transaction.description}</span>
                  )}
                  {transaction.payer && (
                    <span>支付人: {typeof transaction.payer === 'string' ? transaction.payer : transaction.payer.username}</span>
                  )}
                  <span>日期: {dayjs(transaction.date).format('YYYY-MM-DD')}</span>
                </Space>
              }
            />
          </List.Item>
        )}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
    </Card>
  );
};

export default TransactionList;