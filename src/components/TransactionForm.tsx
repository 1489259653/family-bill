import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, DatePicker, Form, InputNumber, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { type CreateTransactionData, useFamilies } from "../services/api";
import { CATEGORIES, type TransactionFormData } from "../types";

interface TransactionFormProps {
  onAddTransaction: (data: CreateTransactionData) => Promise<any>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [currentUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const { currentFamily, familyMembers } = useFamilies();
  const { logout } = useAuth();
  const isInFamily = !!currentFamily;

  const handleSubmit = async (values: any) => {
    // 确保payerId在家庭账单模式下有值
    const payerId =
      values.isFamilyBill && isInFamily
        ? values.payerId || (currentUser?.id as number)
        : values.payer || undefined;

    const formData: TransactionFormData = {
      type: values.type,
      category: values.category,
      amount: values.amount,
      description: values.description,
      date: values.date.toDate(),
      isFamilyBill: values.isFamilyBill || false,
      payerId: payerId,
    };
    try {
      await onAddTransaction(formData as CreateTransactionData);
      form.resetFields(["description", "amount", "category"]);
      message.success("交易添加成功！");
    } catch (error) {
      // 处理401未授权错误
      const errorObj = error as any;
      if (errorObj.statusCode === 401) {
        message.error("登录已过期，请重新登录");
        logout();
      } else {
        message.error("添加交易失败");
      }
    }
  };

  const handleTypeChange = (value: "income" | "expense") => {
    setTransactionType(value);
    form.setFieldValue("category", undefined);
  };

  return (
    <Card title="添加交易" style={{ marginBottom: "24px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "income",
          date: dayjs(),
          payerId: currentUser?.id, // 初始化支付人ID
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: "请选择交易类型" }]}
          >
            <Select onChange={handleTypeChange}>
              <Select.Option value="income">收入</Select.Option>
              <Select.Option value="expense">支出</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select placeholder="请选择分类">
              {CATEGORIES[transactionType].map((category) => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="金额 (¥)"
            rules={[{ required: true, message: "请输入金额" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item name="date" label="日期" rules={[{ required: true, message: "请选择日期" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {isInFamily && (
          <Form.Item name="isFamilyBill" valuePropName="checked" style={{ marginBottom: "16px" }}>
            <Checkbox>家庭账单</Checkbox>
          </Form.Item>
        )}

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isFamilyBill !== currentValues.isFamilyBill
          }
        >
          {({ getFieldValue }) => {
            const isFamilyBill = getFieldValue("isFamilyBill");
            if (isFamilyBill && isInFamily) {
              return (
                <Form.Item
                  name="payerId"
                  label="支付人"
                  rules={[{ required: true, message: "请选择支付人" }]}
                >
                  <Select placeholder="请选择支付人" defaultValue={currentUser?.id}>
                    {familyMembers?.map((member: any) => (
                      <Select.Option key={member.id} value={member.id}>
                        {member.username}
                      </Select.Option>
                    )) || []}
                  </Select>
                </Form.Item>
              );
            }
          }}
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: "请输入交易描述" }]}
        >
          <TextArea placeholder="交易说明" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
          >
            添加交易
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TransactionForm;
