import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const CanBoViPham: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã vi phạm', dataIndex: 'maViPham', key: 'maViPham' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Loại vi phạm', dataIndex: 'loaiViPham', key: 'loaiViPham' },
    { title: 'Ngày vi phạm', dataIndex: 'ngayViPham', key: 'ngayViPham' },
    { title: 'Tiền phạt', dataIndex: 'tienPhat', key: 'tienPhat', render: (val: number) => `${val?.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Đã xử lý' ? 'green' : 'orange'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    message.success('Thêm vi phạm thành công!');
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm vi phạm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maViPham" />
      
      <Modal
        title="Thêm vi phạm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maSinhVien" label="Sinh viên" rules={[{ required: true }]}>
            <Select placeholder="Chọn sinh viên" />
          </Form.Item>
          <Form.Item name="loaiViPham" label="Loại vi phạm" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Gây ồn">Gây ồn</Select.Option>
              <Select.Option value="Hút thuốc">Hút thuốc</Select.Option>
              <Select.Option value="Về muộn">Về muộn</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ngayViPham" label="Ngày vi phạm" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="tienPhat" label="Tiền phạt (VNĐ)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoViPham;
