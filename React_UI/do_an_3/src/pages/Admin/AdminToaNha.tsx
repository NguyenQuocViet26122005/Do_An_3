import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/MainLayout';
import toaNhaService, { ToaNha } from '../../services/toaNhaService';

const AdminToaNha: React.FC = () => {
  const [data, setData] = useState<ToaNha[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ToaNha | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await toaNhaService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error: any) {
      message.error('Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Mã tòa nhà', dataIndex: 'maToaNha', key: 'maToaNha' },
    { title: 'Tên tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    { title: 'Số tầng', dataIndex: 'soTang', key: 'soTang' },
    { title: 'Số phòng', dataIndex: 'soPhong', key: 'soPhong' },
    { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ToaNha) => (
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

  const handleEdit = (record: ToaNha) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await toaNhaService.delete(id);
      if (response.success) {
        message.success('Xóa thành công!');
        fetchData();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa thất bại!');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        const response = await toaNhaService.update(editingRecord.maToaNha, values);
        if (response.success) {
          message.success('Cập nhật thành công!');
          fetchData();
          setModalVisible(false);
        }
      } else {
        const response = await toaNhaService.create(values);
        if (response.success) {
          message.success('Thêm mới thành công!');
          fetchData();
          setModalVisible(false);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Thao tác thất bại!');
    }
  };

  return (
    <MainLayout>
      <div>
        <h2 style={{ marginBottom: 16 }}>Quản lý tòa nhà</h2>
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
            <Form.Item name="tenToaNha" label="Tên tòa nhà" rules={[{ required: true, message: 'Vui lòng nhập tên tòa nhà!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="diaChi" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item name="soTang" label="Số tầng">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="moTa" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminToaNha;
