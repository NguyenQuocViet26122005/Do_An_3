import React from 'react';
import { Card, Descriptions, Tag, Typography } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const AdminProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <Title level={2}>Thông tin cá nhân</Title>
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ tên">{user?.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò"><Tag color="red">Admin</Tag></Descriptions.Item>
          <Descriptions.Item label="Mã tài khoản">{user?.maTaiKhoan}</Descriptions.Item>
          <Descriptions.Item label="Mã người dùng">{user?.maNguoiDung}</Descriptions.Item>
          <Descriptions.Item label="Mã actor">{user?.maActor}</Descriptions.Item>
          <Descriptions.Item label="Mã nhân viên">{user?.maActorCode}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default AdminProfile;
