import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Tag, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import toaNhaService from '../../services/toaNhaService';

const AdminToaNha: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await toaNhaService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải tòa nhà:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Mã tòa', dataIndex: 'maToa', key: 'maToa' },
    { title: 'Tên tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { 
      title: 'Loại', 
      dataIndex: 'loaiToaNha', 
      key: 'loaiToaNha',
      render: (val: string) => <Tag color={val === 'Nam' ? 'blue' : 'pink'}>{val}</Tag>
    },
    { title: 'Số tầng', dataIndex: 'soTang', key: 'soTang' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'HoatDong' ? 'green' : 'red'}>
          {val === 'HoatDong' ? 'Hoạt động' : 'Bảo trì'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.maToaNha)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
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
    try {
      const response = await toaNhaService.delete(id);
      if (response.success) {
        message.success('Xóa tòa nhà thành công!');
        fetchData();
      } else {
        message.error(response.message || 'Xóa thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        const response = await toaNhaService.update(editingRecord.maToaNha, values);
        if (response.success) {
          message.success('Cập nhật tòa nhà thành công!');
        } else {
          message.error(response.message || 'Cập nhật thất bại');
          return;
        }
      } else {
        const response = await toaNhaService.create(values);
        if (response.success) {
          message.success('Thêm tòa nhà thành công!');
        } else {
          message.error(response.message || 'Thêm thất bại');
          return;
        }
      }
      setModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

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
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maToa" label="Mã tòa" rules={[{ required: true, message: 'Vui lòng nhập mã tòa!' }]}>
            <Input placeholder="Ví dụ: A, B, C..." />
          </Form.Item>
          <Form.Item name="tenToaNha" label="Tên tòa nhà" rules={[{ required: true, message: 'Vui lòng nhập tên tòa nhà!' }]}>
            <Input placeholder="Ví dụ: Tòa nhà A" />
          </Form.Item>
          <Form.Item name="loaiToaNha" label="Loại tòa nhà" rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}>
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nu">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="soTang" label="Số tầng" rules={[{ required: true, message: 'Vui lòng nhập số tầng!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="HoatDong">Hoạt động</Select.Option>
              <Select.Option value="BaoTri">Bảo trì</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminToaNha;
