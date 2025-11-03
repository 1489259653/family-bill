import React from 'react';
import { Typography, Space } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Header: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
      <Space direction="vertical" size="small">
        <Title level={1} style={{ color: 'white', margin: 0 }}>
          <DollarOutlined /> 家庭记账本
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
          轻松管理家庭收支
        </Text>
      </Space>
    </div>
  );
};

export default Header;