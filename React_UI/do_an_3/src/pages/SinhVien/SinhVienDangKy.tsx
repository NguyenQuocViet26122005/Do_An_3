import React, { useState } from 'react';
import { Card, Form, Select, Button, message, Table, Tag, Input } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const SinhVienDangKy: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registrations] = useState([
    { id: 1, room: 'A101', building: 'Tòa A', date: '2024-01-15', status: 'Chờ duyệt' },
    { id: 2, room: 'B201', building: 'Tòa B', date: '2024-01-10', status: 'Đã duyệt' },
  ]);

  const columns = [
    { title: 'Phòng', dataIndex: 'room', key: 'room' },
    { title: 'Tòa nhà', dataIndex: 'building', key: 'building' },
    { title: 'Ngày đăng ký', dataIndex: 'date', key: 'date' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val === 'Chờ duyệt' ? 'orange' : val === 'Đã duyệt' ? 'green' : 'red'}>{val}</Tag>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    const newItem = {
      id: registrations.length + 1,
      room: 'A101',
      building: 'Tòa A',
      date: new Date().toISOString().split('T')[0],
      status: 'Chờ duyệt'
    };
    message.success('Đăng ký phòng thành công! Vui lòng chờ duyệt.');
    form.resetFields();
  };

  return (
    <div>
      <Card title="Đăng ký phòng mới" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maPhong" label="Chọn phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
            <Select placeholder="Chọn phòng">
              <Select.Option value={1}>A101 - Tòa A (Còn 2 chỗ)</Select.Option>
              <Select.Option value={2}>A102 - Tòa A (Còn 1 chỗ)</Select.Option>
              <Select.Option value={3}>B201 - Tòa B (Còn 3 chỗ)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú (nếu có)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<FileTextOutlined />}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lịch sử đăng ký">
        <Table columns={columns} dataSource={registrations} rowKey="id" />
      </Card>
    </div>
  );
};

export default SinhVienDangKy;
