import React, { useState } from 'react';
import { Table, Button, message, Space, Tag, Popconfirm } from 'antd';
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const AdminUsers: React.FC = () => {
  const [data] = useState([]);
  const [loading] = useState(false);

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
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={record.trangThai ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.trangThai ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.maTaiKhoan)}>
            <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleToggleStatus = async (record: any) => {
    message.success(record.trangThai ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
  };

  const handleDelete = async (id: number) => {
    message.success('Xóa thành công!');
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maTaiKhoan" />
    </div>
  );
};

export default AdminUsers;
