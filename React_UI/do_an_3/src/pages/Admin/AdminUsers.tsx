import React, { useEffect, useState } from 'react';
import { Table, Button, message, Space, Tag } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { UserDTO } from '../../services/authService';
import authService from '../../services/authService';

const AdminUsers: React.FC = () => {
  const [data, setData] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await authService.getUsers();
      if (res.success) {
        setData(res.data || []);
      } else {
        message.error(res.message || 'Không thể tải danh sách tài khoản');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'tenDangNhap', key: 'tenDangNhap' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: (val: string) => (
        <Tag color={val === 'Admin' ? 'red' : val === 'CanBo' ? 'blue' : 'green'}>{val}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: boolean) => (
        <Tag color={val ? 'green' : 'red'}>{val ? 'Hoạt động' : 'Khóa'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: UserDTO) => (
        <Space>
          <Button
            icon={record.trangThai ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.trangThai ? 'Khóa' : 'Mở khóa'}
          </Button>
        </Space>
      ),
    },
  ];

  const handleToggleStatus = async (record: UserDTO) => {
    try {
      const newStatus = !record.trangThai;
      await authService.setUserStatus(record.maTaiKhoan, newStatus);
      setData(data.map(item =>
        item.maTaiKhoan === record.maTaiKhoan ? { ...item, trangThai: newStatus } : item
      ));
      message.success(newStatus ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể thay đổi trạng thái');
    }
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maTaiKhoan" />
    </div>
  );
};

export default AdminUsers;
