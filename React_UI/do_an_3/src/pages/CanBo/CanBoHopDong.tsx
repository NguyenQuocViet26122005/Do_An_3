import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';

const CanBoHopDong: React.FC = () => {
  const [data, setData] = useState([
    { maHopDong: 1, code: 'HD001', tenSinhVien: 'Hoàng Văn Học', maSV: 'B20DCCN002', tenPhong: 'A102', tenToaNha: 'Tòa A', ngayBatDau: '2024-01-01', ngayKetThuc: '2024-06-30', trangThai: 'Đang hiệu lực' },
    { maHopDong: 2, code: 'HD002', tenSinhVien: 'Phạm Thị Sinh Viên', maSV: 'B20DCCN001', tenPhong: 'A101', tenToaNha: 'Tòa A', ngayBatDau: '2024-02-01', ngayKetThuc: '2024-07-31', trangThai: 'Đang hiệu lực' },
    { maHopDong: 3, code: 'HD003', tenSinhVien: 'Nguyễn Thị Mai', maSV: 'B20DCCN003', tenPhong: 'B201', tenToaNha: 'Tòa B', ngayBatDau: '2023-09-01', ngayKetThuc: '2024-01-31', trangThai: 'Hết hạn' },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã hợp đồng', dataIndex: 'maHopDong', key: 'maHopDong' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Ngày bắt đầu', dataIndex: 'ngayBatDau', key: 'ngayBatDau' },
    { title: 'Ngày kết thúc', dataIndex: 'ngayKetThuc', key: 'ngayKetThuc' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Đang hiệu lực' ? 'green' : val === 'Hết hạn' ? 'red' : 'orange'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Chi tiết</Button>
          <Button icon={<FileTextOutlined />} size="small">In hợp đồng</Button>
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
      maHopDong: data.length + 1, 
      code: `HD00${data.length + 1}`,
      tenSinhVien: 'Sinh viên mới',
      maSV: 'B20DCCN00X',
      tenPhong: 'A101',
      tenToaNha: 'Tòa A',
      ...values,
      ngayBatDau: values.ngayBatDau?.format('YYYY-MM-DD'),
      ngayKetThuc: values.ngayKetThuc?.format('YYYY-MM-DD'),
      trangThai: 'Đang hiệu lực'
    };
    setData([...data, newItem]);
    message.success('Tạo hợp đồng thành công!');
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Tạo hợp đồng
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maHopDong" />
      
      <Modal
        title="Tạo hợp đồng mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maSinhVien" label="Sinh viên" rules={[{ required: true }]}>
            <Select placeholder="Chọn sinh viên" />
          </Form.Item>
          <Form.Item name="maPhong" label="Phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng" />
          </Form.Item>
          <Form.Item name="ngayBatDau" label="Ngày bắt đầu" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ngayKetThuc" label="Ngày kết thúc" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoHopDong;
