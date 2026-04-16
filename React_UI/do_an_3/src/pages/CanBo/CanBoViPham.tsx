import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';

const CanBoViPham: React.FC = () => {
  const [data, setData] = useState([
    { maViPham: 1, code: 'VP001', tenSinhVien: 'Hoàng Văn Học', tenPhong: 'A102', loaiViPham: 'Gây ồn', ngayViPham: '2024-03-10', tienPhat: 100000, trangThai: 'Chưa xử lý' },
    { maViPham: 2, code: 'VP002', tenSinhVien: 'Phạm Thị Sinh Viên', tenPhong: 'A101', loaiViPham: 'Về muộn', ngayViPham: '2024-03-05', tienPhat: 50000, trangThai: 'Đã xử lý' },
    { maViPham: 3, code: 'VP003', tenSinhVien: 'Nguyễn Thị Mai', tenPhong: 'B201', loaiViPham: 'Hút thuốc', ngayViPham: '2024-03-12', tienPhat: 200000, trangThai: 'Chưa xử lý' },
  ]);
  const [loading] = useState(false);
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
    const newItem = { 
      maViPham: data.length + 1, 
      code: `VP00${data.length + 1}`,
      tenSinhVien: 'Sinh viên',
      tenPhong: 'A101',
      ...values,
      ngayViPham: values.ngayViPham?.format('YYYY-MM-DD'),
      trangThai: 'Chưa xử lý'
    };
    setData([...data, newItem]);
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
