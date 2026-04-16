import React, { useState } from 'react';
import { Table, Button, message, Space, Tag, Popconfirm } from 'antd';
import { DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const AdminUsers: React.FC = () => {
  const [data, setData] = useState([
    { maTaiKhoan: 1, tenDangNhap: 'admin', hoTen: 'Nguyễn Văn Admin', email: 'admin@ktx.edu.vn', soDienThoai: '0123456789', vaiTro: 'Admin', trangThai: true },
    { maTaiKhoan: 2, tenDangNhap: 'canbo01', hoTen: 'Trần Thị Cán Bộ', email: 'canbo01@ktx.edu.vn', soDienThoai: '0987654321', vaiTro: 'CanBo', trangThai: true },
    { maTaiKhoan: 3, tenDangNhap: 'canbo02', hoTen: 'Lê Văn Quản Lý', email: 'canbo02@ktx.edu.vn', soDienThoai: '0912345678', vaiTro: 'CanBo', trangThai: true },
    { maTaiKhoan: 4, tenDangNhap: 'sv001', hoTen: 'Phạm Thị Sinh Viên', email: 'sv001@student.edu.vn', soDienThoai: '0934567890', vaiTro: 'SinhVien', trangThai: true },
    { maTaiKhoan: 5, tenDangNhap: 'sv002', hoTen: 'Hoàng Văn Học', email: 'sv002@student.edu.vn', soDienThoai: '0945678901', vaiTro: 'SinhVien', trangThai: false },
  ]);
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
    setData(data.map(item => 
      item.maTaiKhoan === record.maTaiKhoan ? { ...item, trangThai: !item.trangThai } : item
    ));
    message.success(record.trangThai ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
  };

  const handleDelete = async (id: number) => {
    setData(data.filter(item => item.maTaiKhoan !== id));
    message.success('Xóa thành công!');
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maTaiKhoan" />
    </div>
  );
};

export default AdminUsers;
