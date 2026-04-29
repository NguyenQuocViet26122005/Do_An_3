import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  WarningOutlined,
  BellOutlined,
  ToolOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
    ];

    if (user?.vaiTro === 'Admin') {
      return [
        ...commonItems,
        {
          key: 'toanha',
          icon: <HomeOutlined />,
          label: 'Quản lý tòa nhà',
        },
        {
          key: 'phong',
          icon: <HomeOutlined />,
          label: 'Quản lý phòng',
        },
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'Quản lý người dùng',
        },
      ];
    }

    if (user?.vaiTro === 'CanBo') {
      return [
        ...commonItems,
        {
          key: 'toanha',
          icon: <HomeOutlined />,
          label: 'Quản lý tòa nhà',
        },
        {
          key: 'phong',
          icon: <HomeOutlined />,
          label: 'Quản lý phòng',
        },
        {
          key: 'dangky',
          icon: <FileTextOutlined />,
          label: 'Duyệt đăng ký',
        },
        {
          key: 'hopdong',
          icon: <FileTextOutlined />,
          label: 'Quản lý hợp đồng',
        },
        {
          key: 'hoadon',
          icon: <DollarOutlined />,
          label: 'Quản lý hóa đơn',
        },
        {
          key: 'vipham',
          icon: <WarningOutlined />,
          label: 'Quản lý vi phạm',
        },
        {
          key: 'baotri',
          icon: <ToolOutlined />,
          label: 'Quản lý bảo trì',
        },
        {
          key: 'thongbao',
          icon: <BellOutlined />,
          label: 'Gửi thông báo',
        },
        {
          key: 'baocao',
          icon: <BarChartOutlined />,
          label: 'Báo cáo thống kê',
        },
      ];
    }

    if (user?.vaiTro === 'SinhVien') {
      return [
        ...commonItems,
        {
          key: 'phong',
          icon: <HomeOutlined />,
          label: 'Xem phòng trống',
        },
        {
          key: 'dangky',
          icon: <FileTextOutlined />,
          label: 'Đăng ký phòng',
        },
        {
          key: 'hopdong',
          icon: <FileTextOutlined />,
          label: 'Hợp đồng của tôi',
        },
        {
          key: 'hoadon',
          icon: <DollarOutlined />,
          label: 'Hóa đơn của tôi',
        },
        {
          key: 'vipham',
          icon: <WarningOutlined />,
          label: 'Vi phạm của tôi',
        },
        {
          key: 'baotri',
          icon: <ToolOutlined />,
          label: 'Yêu cầu bảo trì',
        },
        {
          key: 'thongbao',
          icon: <BellOutlined />,
          label: 'Thông báo',
        },
      ];
    }

    return commonItems;
  };

  const handleMenuClick = (key: string) => {
    const basePath = user?.vaiTro === 'Admin' ? '/admin' : 
                     user?.vaiTro === 'CanBo' ? '/canbo' : '/sinhvien';
    navigate(`${basePath}/${key}`);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      const basePath = user?.vaiTro === 'Admin' ? '/admin' : 
                       user?.vaiTro === 'CanBo' ? '/canbo' : '/sinhvien';
      navigate(`${basePath}/profile`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="logo">
          <Text strong style={{ color: 'white', fontSize: collapsed ? '16px' : '20px' }}>
            {collapsed ? 'KTX' : 'Quản lý KTX'}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={getMenuItems()}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <Space>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div><Text strong>{user?.hoTen}</Text></div>
                  <div><Text type="secondary" style={{ fontSize: '12px' }}>{user?.vaiTro}</Text></div>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
