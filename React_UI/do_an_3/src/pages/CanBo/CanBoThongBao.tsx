import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const CanBoThongBao: React.FC = () => {
  const [data, setData] = useState([
    { maThongBao: 1, tieuDe: 'Thông báo đóng tiền phòng tháng 4', doiTuong: 'Tất cả', ngayGui: '2024-04-01' },
    { maThongBao: 2, tieuDe: 'Lịch kiểm tra phòng định kỳ', doiTuong: 'Tòa A', ngayGui: '2024-03-28' },
    { maThongBao: 3, tieuDe: 'Thông báo bảo trì hệ thống điện', doiTuong: 'Tất cả', ngayGui: '2024-04-05' },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã thông báo', dataIndex: 'maThongBao', key: 'maThongBao' },
    { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe' },
    { title: 'Đối tượng', dataIndex: 'doiTuong', key: 'doiTuong' },
    { title: 'Ngày gửi', dataIndex: 'ngayGui', key: 'ngayGui' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">Chi tiết</Button>
          <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
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
      maThongBao: data.length + 1, 
      ...values,
      ngayGui: new Date().toISOString().split('T')[0]
    };
    setData([...data, newItem]);
    message.success('Gửi thông báo thành công!');
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Gửi thông báo
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maThongBao" />
      
      <Modal
        title="Gửi thông báo mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="doiTuong" label="Đối tượng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Tất cả">Tất cả sinh viên</Select.Option>
              <Select.Option value="Tòa A">Sinh viên tòa A</Select.Option>
              <Select.Option value="Tòa B">Sinh viên tòa B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoThongBao;
