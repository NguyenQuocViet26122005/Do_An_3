import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/MainLayout';
import phongService, { Phong } from '../../services/phongService';
import toaNhaService, { ToaNha } from '../../services/toaNhaService';

const AdminPhong: React.FC = () => {
  const [data, setData] = useState<Phong[]>([]);
  const [toaNhas, setToaNhas] = useState<ToaNha[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Phong | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchToaNhas();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await phongService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error: any) {
      message.error('Không thể tải dữ liệu phòng!');
    } finally {
      setLoading(false);
    }
  };

  const fetchToaNhas = async () => {
    try {
      const response = await toaNhaService.getAll();
      if (response.success) {
        setToaNhas(response.data);
      }
    } catch (error: any) {
      message.error('Không thể tải danh sách tòa nhà!');
    }
  };

  const columns = [
    { title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
    { title: 'Số phòng', dataIndex: 'soPhong', key: 'soPhong' },
    { title: 'Tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Tầng', dataIndex: 'tang', key: 'tang' },
    { title: 'Loại phòng', dataIndex: 'loaiPhong', key: 'loaiPhong' },
    { title: 'Số giường', dataIndex: 'soGiuong', key: 'soGiuong' },
    { title: 'Giường trống', dataIndex: 'soGiuongTrong', key: 'soGiuongTrong' },
    { title: 'Giá thuê', dataIndex: 'giaThue', key: 'giaThue', render: (val: number) => `${val?.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => {
        const color = val === 'Trống' ? 'green' : val === 'Đầy' ? 'red' : 'orange';
        return <Tag color={color}>{val}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Phong) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.maPhong)}>
            <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
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

  const handleEdit = (record: Phong) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await phongService.delete(id);
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
        const response = await phongService.update(editingRecord.maPhong, values);
        if (response.success) {
          message.success('Cập nhật thành công!');
          fetchData();
          setModalVisible(false);
        }
      } else {
        const response = await phongService.create(values);
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
        <h2 style={{ marginBottom: 16 }}>Quản lý phòng</h2>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm phòng
          </Button>
        </div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="maPhong" />
        
        <Modal
          title={editingRecord ? 'Sửa phòng' : 'Thêm phòng'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="maToaNha" label="Tòa nhà" rules={[{ required: true, message: 'Vui lòng chọn tòa nhà!' }]}>
              <Select placeholder="Chọn tòa nhà">
                {toaNhas.map(tn => (
                  <Select.Option key={tn.maToaNha} value={tn.maToaNha}>{tn.tenToaNha}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="soPhong" label="Số phòng" rules={[{ required: true, message: 'Vui lòng nhập số phòng!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tang" label="Tầng">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="loaiPhong" label="Loại phòng">
              <Select>
                <Select.Option value="4 người">4 người</Select.Option>
                <Select.Option value="6 người">6 người</Select.Option>
                <Select.Option value="8 người">8 người</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="soGiuong" label="Số giường">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="giaThue" label="Giá thuê (VNĐ)">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="dienTich" label="Diện tích (m²)">
              <InputNumber min={0} style={{ width: '100%' }} />
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

export default AdminPhong;
