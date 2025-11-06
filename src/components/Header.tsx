import { FileTextOutlined, HomeOutlined, SettingOutlined, UserOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Typography } from "antd";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
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
        background: "var(--bg-secondary)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title level={2} style={{ margin: 0, color: "var(--text-primary)" }}>
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
          <Link to="/" style={{ color: "var(--text-secondary)" }}>
                账单管理
              </Link>
        </Menu.Item>
      </Menu>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            type="text"
            icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            style={{ color: "var(--text-secondary)", fontSize: "18px" }}
            title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          />
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ color: "var(--text-secondary)" }}>欢迎，{user.username}</span>
            </div>
          </Dropdown>
        </div>
      )}
    </AntHeader>
  );
};

export default Header;
