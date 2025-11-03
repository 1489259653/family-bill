import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, DatePicker, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TransactionFormData } from '../types';
import { CATEGORIES } from '../types';
import dayjs from 'dayjs';

interface TransactionFormProps {
  onAddTransaction: (data: TransactionFormData) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (values: any) => {
    const formData: TransactionFormData = {
      type: values.type,
      category: values.category,
      amount: values.amount,
      description: values.description,
      date: values.date.format('YYYY-MM-DD')
    };
    
    onAddTransaction(formData);
    form.resetFields();
    message.success('交易添加成功！');
  };

  const handleTypeChange = (value: 'income' | 'expense') => {
    setTransactionType(value);
    form.setFieldValue('category', undefined);
  };

  return (
    <Card title="添加交易" style={{ marginBottom: '24px' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'income',
          date: dayjs()
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择交易类型' }]}
          >
            <Select onChange={handleTypeChange}>
              <Select.Option value="income">收入</Select.Option>
              <Select.Option value="expense">支出</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {CATEGORIES[transactionType].map(category => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="金额 (¥)"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入交易描述' }]}
        >
          <Input placeholder="交易说明" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} style={{ width: '100%' }}>
            添加交易
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TransactionForm;