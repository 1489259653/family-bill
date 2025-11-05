import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, message, Modal, List, Tag, Divider, Typography } from 'antd';
import { PlusOutlined, UserAddOutlined, HomeOutlined, TeamOutlined, KeyOutlined, CopyOutlined } from '@ant-design/icons';
import { useFamilies } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FamilyMember } from '../types';

const { Title, Text } = Typography;

const FamilyManager: React.FC = () => {
  const { 
    currentFamily, 
    currentFamilyError, 
    familyMembers, 
    familyMembersError,
    invitationCode,
    invitationCodeError,
    createFamily,
    joinFamily,
    leaveFamily
  } = useFamilies();
  // 判断用户是否已加入家庭
  const isInFamily = !!currentFamily;
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  
  const [createForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  // 检查是否有错误
  const { logout } = useAuth();

  React.useEffect(() => {
    if (currentFamilyError || familyMembersError) {
      console.error('获取家庭信息失败:', currentFamilyError || familyMembersError);
      
      // 处理401未授权错误
      if ((currentFamilyError?.statusCode === 401 || familyMembersError?.statusCode === 401)) {
        message.error('登录已过期，请重新登录');
        logout();
      } else {
        message.error('获取家庭信息失败');
      }
    }
  }, [currentFamilyError, familyMembersError, logout]);

  // 创建家庭
  const handleCreateFamily = async (values: any) => {
    try {
      await createFamily(values);
      message.success('家庭创建成功！');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      console.error('创建家庭失败:', error);
      message.error('创建家庭失败，请重试');
    }
  };

  // 加入家庭
  const handleJoinFamily = async (values: any) => {
    try {
      await joinFamily(values);
      message.success('成功加入家庭！');
      setJoinModalVisible(false);
      joinForm.resetFields();
    } catch (error) {
      console.error('加入家庭失败:', error);
      message.error('邀请码无效或已过期，请重试');
    }
  };

  // 获取邀请码
  const handleGetInvitationCode = () => {
    if (invitationCodeError) {
        return message.error('获取邀请码出错');
      }
      console.log(invitationCode)
      if (invitationCode) {
        setInviteModalVisible(true);
    }
  };

  // 复制邀请码
  const handleCopyInvitationCode = () => {
    navigator.clipboard.writeText(invitationCode || '');
    message.success('邀请码已复制到剪贴板');
  };

  // 退出家庭
  const handleLeaveFamily = async () => {
    Modal.confirm({
      title: '确认退出家庭',
      content: '退出家庭后，您将无法查看家庭账单，确定要退出吗？',
      onOk: async () => {
        try {
          await leaveFamily();
          message.success('成功退出家庭');
        } catch (error) {
          console.error('退出家庭失败:', error);
          message.error('退出家庭失败，请重试');
        }
      }
    });
  };

  return (
    <Card 
      title={
        <Space align="center">
          <HomeOutlined /> 家庭管理
        </Space>
      }
      style={{ marginBottom: '24px' }}
    >
      {!isInFamily ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text style={{ fontSize: '16px', display: 'block', textAlign: 'center', marginBottom: '20px' }}>
            您还没有加入任何家庭，创建或加入一个家庭开始家庭记账吧！
          </Text>
          
          <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              style={{ minWidth: '150px' }}
            >
              创建家庭
            </Button>
            
            <Button 
              icon={<UserAddOutlined />}
              onClick={() => setJoinModalVisible(true)}
              style={{ minWidth: '150px' }}
            >
              加入家庭
            </Button>
          </Space>
        </Space>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>{currentFamily.name}</Title>
            {currentFamily.description && (
              <Text type="secondary">{currentFamily.description}</Text>
            )}
          </div>
          
          <Divider />
          
          <div>
            <Space align="center" style={{ marginBottom: '16px' }}>
              <TeamOutlined /> 
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>家庭成员 ({familyMembers.length}人)</span>
            </Space>
            
            <List 
              dataSource={familyMembers}
              renderItem={(member:FamilyMember) => (
                <List.Item
                  actions={[
                    (member.isAdmin) && (
                      <Tag color="green">管理员</Tag>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={member.username}
                    description={member.email}
                  />
                </List.Item>
              )}
            />
          </div>
          
          <Divider />
          
          <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              icon={<KeyOutlined />}
              onClick={handleGetInvitationCode}
              style={{ minWidth: '150px' }}
            >
              邀请成员
            </Button>
            
            <Button 
                danger
                onClick={handleLeaveFamily}
                style={{ minWidth: '150px' }}
            >
              退出家庭
            </Button>
          </Space>
        </Space>
      )}

      {/* 创建家庭模态框 */}
      <Modal
        title="创建新家庭"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateFamily}
        >
          <Form.Item
            name="name"
            label="家庭名称"
            rules={[{ required: true, message: '请输入家庭名称' }]}
          >
            <Input placeholder="请输入家庭名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="家庭描述"
          >
            <Input.TextArea placeholder="请输入家庭描述（可选）" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              创建家庭
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 加入家庭模态框 */}
      <Modal
        title="加入家庭"
        open={joinModalVisible}
        onCancel={() => setJoinModalVisible(false)}
        footer={null}
      >
        <Form
          form={joinForm}
          layout="vertical"
          onFinish={handleJoinFamily}
        >
          <Form.Item
            name="invitationCode"
            label="邀请码"
            rules={[{ required: true, message: '请输入邀请码' }]}
          >
            <Input placeholder="请输入家庭邀请码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              加入家庭
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 邀请码模态框 */}
      <Modal
        title="家庭邀请码"
        open={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary">请将以下邀请码分享给您的家人：</Text>
          
          <div style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '8px', 
            textAlign: 'center',
            fontSize: '18px',
            letterSpacing: '2px',
            fontWeight: 'bold'
          }}>
            {invitationCode}
          </div>
          
          <Button 
            type="primary" 
            icon={<CopyOutlined />}
            onClick={handleCopyInvitationCode}
            style={{ width: '100%' }}
          >
            复制邀请码
          </Button>
          
          <Text type="secondary" style={{ fontSize: '12px' }}>
            邀请码有效期为24小时，请尽快分享给您的家人。
          </Text>
        </Space>
      </Modal>
    </Card>
  );
};

export default FamilyManager;