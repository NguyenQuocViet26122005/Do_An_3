import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const AdminToaNha: React.FC = () => {
  const [data, setData] = useState([
    { maToaNha: 1, tenToaNha: 'Tòa nhà A', diaChi: 'Số 1 Đại Cồ Việt', soTang: 5, tongSoPhong: 50 },
    { maToaNha: 2, tenToaNha: 'Tòa nhà B', diaChi: 'Số 1 Đại Cồ Việt', soTang: 5, tongSoPhong: 50 },
    { maToaNha: 3, tenToaNha: 'Tòa nhà C', diaChi: 'Số 1 Đại Cồ Việt', soTang: 6, tongSoPhong: 60 },
    { maToaNha: 4, tenToaNha: 'Tòa nhà D', diaChi: 'Số 1 Đại Cồ Việt', soTang: 4, tongSoPhong: 40 },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã tòa nhà', dataIndex: 'maToaNha', key: 'maToaNha' },
    { title: 'Tên tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    { title: 'Số tầng', dataIndex: 'soTang', key: 'soTang' },
    { title: 'Tổng số phòng', dataIndex: 'tongSoPhong', key: 'tongSoPhong' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.maToaNha)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setData(data.filter(item => item.maToaNha !== id));
    message.success('Xóa thành công!');
  };

  const handleSubmit = async (values: any) => {
    if (editingRecord) {
      setData(data.map(item => 
        item.maToaNha === editingRecord.maToaNha ? { ...item, ...values } : item
      ));
      message.success('Cập nhật thành công!');
    } else {
      const newItem = { maToaNha: data.length + 1, ...values };
      setData([...data, newItem]);
      message.success('Thêm mới thành công!');
    }
    setModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm tòa nhà
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maToaNha" />
      
      <Modal
        title={editingRecord ? 'Sửa tòa nhà' : 'Thêm tòa nhà'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="tenToaNha" label="Tên tòa nhà" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="soTang" label="Số tầng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="tongSoPhong" label="Tổng số phòng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminToaNha;
