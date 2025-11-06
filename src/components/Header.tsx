import { FileTextOutlined, HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Typography } from "antd";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userMenu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<SettingOutlined />}
        onClick={() => {
          // 跳转到家庭管理区域
          const familyManagerElement = document.querySelector(
            ".ant-card:has(.family-manager-title)"
          );
          if (familyManagerElement) {
            familyManagerElement.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        家庭管理
      </Menu.Item>
      <Menu.Item key="2" danger onClick={logout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            <HomeOutlined /> 家庭记账本
          </Title>
        </Link>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ background: "transparent", borderBottom: 0 }}
      >
        <Menu.Item key="/" icon={<FileTextOutlined />}>
          <Link to="/" style={{ color: "#666" }}>
            账单管理
          </Link>
        </Menu.Item>
      </Menu>

      {user && (
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ color: "#666" }}>欢迎，{user.username}</span>
          </div>
        </Dropdown>
      )}
    </AntHeader>
  );
};

export default Header;
