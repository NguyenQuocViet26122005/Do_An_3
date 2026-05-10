import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import toaNhaService, { ToaNha, CreateToaNhaDTO, UpdateToaNhaDTO } from '../../services/toaNhaService';

const { Option } = Select;

const CanBoToaNha: React.FC = () => {
  const [data, setData] = useState<ToaNha[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ToaNha | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await toaNhaService.getAll();
      if (result.success) {
        setData(result.data || []);
      } else {
        message.error(result.message || 'Lỗi tải dữ liệu');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: 'Mã tòa', dataIndex: 'maToa', key: 'maToa' },
    { title: 'Tên tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Loại', dataIndex: 'loaiToaNha', key: 'loaiToaNha', render: (v: string) => v === 'Nam' ? <Tag color="blue">Nam</Tag> : <Tag color="pink">Nữ</Tag> },
    { title: 'Số tầng', dataIndex: 'soTang', key: 'soTang' },
    { title: 'Tổng phòng', dataIndex: 'tongSoPhong', key: 'tongSoPhong' },
    { title: 'Phòng trống', dataIndex: 'soPhongTrong', key: 'soPhongTrong' },
    { 
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai',
      render: (v: string) => v === 'HoatDong' ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Tạm dừng</Tag>
    },
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
      const result = await toaNhaService.delete(id);
      if (result.success) {
        message.success('Xóa thành công!');
        fetchData();
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi xóa tòa nhà');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        const updateData: UpdateToaNhaDTO = { ...values };
        const result = await toaNhaService.update(editingRecord.maToaNha, updateData);
        if (result.success) {
          message.success('Cập nhật thành công!');
        } else {
          message.error(result.message);
          return;
        }
      } else {
        const createData: CreateToaNhaDTO = { ...values };
        const result = await toaNhaService.create(createData);
        if (result.success) {
          message.success('Thêm mới thành công!');
        } else {
          message.error(result.message);
          return;
        }
      }
      setModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
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
          <Form.Item name="maToa" label="Mã tòa" rules={[{ required: true, message: 'Nhập mã tòa' }]}>
            <Input disabled={!!editingRecord} />
          </Form.Item>
          <Form.Item name="tenToaNha" label="Tên tòa nhà" rules={[{ required: true, message: 'Nhập tên tòa nhà' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="loaiToaNha" label="Loại tòa nhà">
            <Select placeholder="Chọn loại">
              <Option value="Nam">Nam</Option>
              <Option value="Nu">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item name="soTang" label="Số tầng">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          {editingRecord && (
            <Form.Item name="trangThai" label="Trạng thái">
              <Select>
                <Option value="HoatDong">Hoạt động</Option>
                <Option value="TamDung">Tạm dừng</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoToaNha;
