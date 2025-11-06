import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Tabs } from "antd";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { TabPane } = Tabs;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const onLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // 使用username或邮箱登录
      await login(values.username, values.password);
      message.success("登录成功！");
      navigate("/");
    } catch (error: any) {
      // 更友好的错误提示
      let errorMessage = "登录失败，请稍后重试";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await register(values.username, values.email, values.password);
      message.success("注册成功！");
      navigate("/");
    } catch (error: any) {
      // 更友好的错误提示
      let errorMessage = "注册失败，请稍后重试";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5dc", // 纸黄色背景
        backgroundImage: `
          repeating-linear-gradient(transparent, transparent 50px, rgba(200, 180, 140, 0.1) 50px, rgba(200, 180, 140, 0.1) 51px),
          repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(200, 180, 140, 0.1) 50px, rgba(200, 180, 140, 0.1) 51px),
          linear-gradient(to right, rgba(255,255,250,0.3), rgba(255,248,225,0.1))
        `, // 类纸纹路效果
        backgroundSize: '100% 100%',
      }}
    >
      <Card
        title="家庭记账本"
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        headStyle={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
      >
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="登录" key="login">
            <Form name="login" onFinish={onLogin} autoComplete="off" layout="vertical">
              <Form.Item name="username" rules={[{ required: true, message: "请输入用户名/邮箱" }]}>
                <Input prefix={<UserOutlined />} placeholder="用户名/邮箱" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "请输入密码" },
                  { min: 6, message: "密码至少6位" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form name="register" onFinish={onRegister} autoComplete="off" layout="vertical">
              <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
                <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱地址" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱地址" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "请输入密码" },
                  { min: 6, message: "密码至少6位" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginForm;
