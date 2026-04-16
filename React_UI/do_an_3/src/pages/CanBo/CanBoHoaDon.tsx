import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';

const CanBoHoaDon: React.FC = () => {
  const [data, setData] = useState([
    { maHoaDon: 1, code: 'HD001', tenSinhVien: 'Hoàng Văn Học', tenPhong: 'A102', thang: '2024-04', tongTien: 700000, trangThai: 'Chưa thanh toán' },
    { maHoaDon: 2, code: 'HD002', tenSinhVien: 'Hoàng Văn Học', tenPhong: 'A102', thang: '2024-03', tongTien: 685000, trangThai: 'Đã thanh toán' },
    { maHoaDon: 3, code: 'HD003', tenSinhVien: 'Phạm Thị Sinh Viên', tenPhong: 'A101', thang: '2024-04', tongTien: 715000, trangThai: 'Chưa thanh toán' },
    { maHoaDon: 4, code: 'HD004', tenSinhVien: 'Phạm Thị Sinh Viên', tenPhong: 'A101', thang: '2024-03', tongTien: 693000, trangThai: 'Đã thanh toán' },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã hóa đơn', dataIndex: 'maHoaDon', key: 'maHoaDon' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Tháng', dataIndex: 'thang', key: 'thang' },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (val: number) => `${val?.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Đã thanh toán' ? 'green' : 'orange'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Chi tiết</Button>
          {record.trangThai === 'Chưa thanh toán' && (
            <Button type="primary" icon={<DollarOutlined />} size="small">
              Xác nhận thanh toán
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    const tongTien = (values.tienPhong || 0) + (values.tienDien || 0) + (values.tienNuoc || 0);
    const newItem = { 
      maHoaDon: data.length + 1, 
      code: `HD00${data.length + 1}`,
      tenSinhVien: 'Sinh viên',
      tenPhong: 'A101',
      thang: values.thang?.format('YYYY-MM'),
      tongTien,
      trangThai: 'Chưa thanh toán'
    };
    setData([...data, newItem]);
    message.success('Tạo hóa đơn thành công!');
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Tạo hóa đơn
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maHoaDon" />
      
      <Modal
        title="Tạo hóa đơn mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maPhong" label="Phòng" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng" />
          </Form.Item>
          <Form.Item name="thang" label="Tháng" rules={[{ required: true }]}>
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="tienPhong" label="Tiền phòng" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" />
          </Form.Item>
          <Form.Item name="tienDien" label="Tiền điện" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" />
          </Form.Item>
          <Form.Item name="tienNuoc" label="Tiền nước" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoHoaDon;
