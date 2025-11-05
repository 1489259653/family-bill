import React from 'react';
import { Card, Statistic, Row, Col, Collapse, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;

interface SummaryCardsProps {
  totalIncome: string;
  totalExpense: string;
  balance: string;
  personalIncome?: string;
  personalExpense?: string;
  familyIncome?: string;
  familyExpense?: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  totalIncome, 
  totalExpense, 
  balance, 
  personalIncome = 0,
  personalExpense = 0,
  familyIncome = 0,
  familyExpense = 0
}) => {
  // 计算个人和家庭的余额
  const personalBalance = Number.parseFloat(personalIncome as string) - Number.parseFloat(personalExpense as string);
  const familyBalance = Number.parseFloat(familyIncome as string) - Number.parseFloat(familyExpense as string);
  
  // 判断是否有家庭账单数据
  const hasFamilyData = Number.parseFloat(familyIncome as string) > 0 || Number.parseFloat(familyExpense as string) > 0;

  return (
    <div>
      {/* 总览卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={24} md={8}>
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
        </Col>
        <Col span={24} md={8}>
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
        </Col>
        <Col span={24} md={8}>
          <Card>
            <Statistic
              title="结余"
              value={balance}
              precision={2}
              valueStyle={{ color: Number.parseFloat(balance as string) >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="¥"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 详细分类汇总（如果有家庭数据） */}
      {hasFamilyData && (
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="账单分类明细" key="1">
                <Row gutter={[16, 16]}>
                  {/* 个人账单 */}
                  <Col span={24} md={12}>
                    <Card title="个人账单" bordered={true}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title="收入"
                            value={personalIncome}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<UserOutlined />}
                            suffix="¥"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="支出"
                            value={personalExpense}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<UserOutlined />}
                            suffix="¥"
                          />
                        </Col>
                        <Col span={24}>
                          <Text strong>余额: </Text>
                          <Text style={{ color: personalBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                            {personalBalance.toFixed(2)} ¥
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  
                  {/* 家庭账单 */}
                  <Col span={24} md={12}>
                    <Card title="家庭账单" bordered={true}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title="收入"
                            value={familyIncome}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<HomeOutlined />}
                            suffix="¥"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="支出"
                            value={familyExpense}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<HomeOutlined />}
                            suffix="¥"
                          />
                        </Col>
                        <Col span={24}>
                          <Text strong>余额: </Text>
                          <Text style={{ color: familyBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                            {familyBalance.toFixed(2)} ¥
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SummaryCards;