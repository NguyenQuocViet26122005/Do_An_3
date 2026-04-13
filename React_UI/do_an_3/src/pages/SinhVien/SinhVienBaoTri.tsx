import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, Input, message, Tag } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const SinhVienBaoTri: React.FC = () => {
  const [requests] = useState([
    {
      id: 1,
      code: 'YC001',
      type: 'Điện',
      description: 'Đèn hỏng',
      date: '2024-03-01',
      status: 'Đang xử lý',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'code', key: 'code' },
    { title: 'Loại sự cố', dataIndex: 'type', key: 'type' },
    { title: 'Ngày yêu cầu', dataIndex: 'date', key: 'date' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val === 'Chờ xử lý' ? 'orange' : val === 'Đang xử lý' ? 'blue' : 'green'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button icon={<EyeOutlined />}>Chi tiết</Button>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    message.success('Gửi yêu cầu bảo trì thành công!');
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Gửi yêu cầu bảo trì
        </Button>
      </div>
      <Table columns={columns} dataSource={requests} rowKey="id" />
      
      <Modal
        title="Gửi yêu cầu bảo trì"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="loaiSuCo" label="Loại sự cố" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Điện">Điện</Select.Option>
              <Select.Option value="Nước">Nước</Select.Option>
              <Select.Option value="Đồ dùng">Đồ dùng</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả chi tiết" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết sự cố..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SinhVienBaoTri;
