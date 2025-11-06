import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Select, Space, Table, Tag } from "antd";
import type { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useMemo, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Transaction } from "../types";
import { CATEGORIES } from "../types";

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
  const { logout, theme } = useAuth();
  
  // 按钮保持默认样式，不再根据主题调整
  
  // 使用useEffect监听主题变化，为指定类的单元格设置黑色背景
  useEffect(() => {
    const setActionCellBackground = () => {
      // 获取所有符合指定类的单元格
      const cells = document.querySelectorAll('.ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-right-first');
      
      if (theme === 'dark') {
        // 深色模式：设置黑色背景
        cells.forEach(cell => {
          (cell as HTMLElement).style.backgroundColor = '#000';
        });
      } else {
        // 浅色模式：移除自定义背景色
        cells.forEach(cell => {
          (cell as HTMLElement).style.backgroundColor = '';
        });
      }
    };
    
    // 初始设置
    setActionCellBackground();
    
    // 添加窗口大小改变事件监听器（表格可能会重新渲染）
    window.addEventListener('resize', setActionCellBackground);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', setActionCellBackground);
    };
  }, [theme]);
  const handleDelete = async (id: number) => {
    try {
      await onDeleteTransaction(id);
      message.success("删除成功");
    } catch (error) {
      // 处理401未授权错误
      const errorObj = error as any;
      if (errorObj.statusCode === 401) {
        message.error("登录已过期，请重新登录");
        logout();
      } else {
        message.error("删除失败");
      }
    }
  };

  // 定义表格列配置
  const columns: ColumnType<Transaction>[] = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color={type === "income" ? "green" : "red"}>{type === "income" ? "收入" : "支出"}</Tag>
      ),
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: string | number) => `¥${amount}`,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string, record: Transaction) => {
        if (!category) return "-";
        
        // 根据交易类型获取对应的分类标签
        const categoryList = CATEGORIES[record.type as keyof typeof CATEGORIES] || [];
        const categoryItem = categoryList.find(item => item.value === category);
        
        return categoryItem?.label || category;
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
      render: (description: string) => description || "-",
    },
    {
      title: "支付人",
      dataIndex: "payer",
      key: "payer",
      width: 150,
      render: (payer: any) => (typeof payer === "string" ? payer : payer?.username || "-"),
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date: string | Date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "账单类型",
      dataIndex: "isFamilyBill",
      key: "isFamilyBill",
      width: 120,
      render: (isFamilyBill: boolean) =>
        isFamilyBill ? <Tag color="blue">家庭账单</Tag> : <Tag color="default">个人账单</Tag>,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      className: theme === 'dark' ? 'dark-mode-action-column' : '',
      render: (_: undefined, record: Transaction) => (
        <Popconfirm
          title="确定要删除这条记录吗？"
          onConfirm={() => record.id && handleDelete(Number(record.id))}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
        title={`交易记录 (${transactions.length} 条)`}
        style={{ marginTop: 24 }}
        extra={
          <Space>
            <Select
              value={filters.billType || "all"}
              style={{ width: 150 }}
              onChange={(value) => onUpdateFilters({ billType: value })}
            >
              <Select.Option value="all">全部账单</Select.Option>
              <Select.Option value="personal">个人账单</Select.Option>
              <Select.Option value="family">家庭账单</Select.Option>
            </Select>
            {Object.keys(filters).some((key) => filters[key] !== "all" && filters[key] !== "") && (
              <Button type="link" onClick={onClearFilters}>
                清除筛选
              </Button>
            )}
          </Space>
        }
      >
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
        scroll={{ x: "max-content" }}
        loading={transactions.length === 0 && !filters}
        locale={{
          emptyText: transactions.length === 0 ? "暂无交易记录" : "暂无数据",
        }}
        size="middle"
      />
    </Card>
  );
};

export default TransactionList;
