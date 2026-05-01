import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Tag, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import phongService from '../../services/phongService';
import toaNhaService from '../../services/toaNhaService';

const AdminPhong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [toaNhas, setToaNhas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bedModalVisible, setBedModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchToaNhas();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await phongService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải phòng:', error);
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
    } catch (error) {
      console.error('Lỗi khi tải tòa nhà:', error);
    }
  };

  const handleViewBeds = async (record: any) => {
    try {
      const response = await phongService.getById(record.maPhong);
      if (response.success) {
        setSelectedRoom(response.data);
        setBedModalVisible(true);
      }
    } catch (error) {
      console.error('Lỗi khi tải giường:', error);
    }
  };

  const columns = [
    { title: 'Số phòng', dataIndex: 'soPhong', key: 'soPhong' },
    { title: 'Tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Tầng', dataIndex: 'tang', key: 'tang' },
    { title: 'Loại phòng', dataIndex: 'loaiPhong', key: 'loaiPhong' },
    { title: 'Sức chứa', dataIndex: 'sucChua', key: 'sucChua' },
    { 
      title: 'Đang ở', 
      dataIndex: 'soNguoiHienTai', 
      key: 'soNguoiHienTai',
      render: (val: number, record: any) => `${val}/${record.sucChua}`
    },
    { 
      title: 'Giá thuê', 
      dataIndex: 'giaPhong', 
      key: 'giaPhong', 
      render: (val: number) => `${val?.toLocaleString('vi-VN')} VNĐ` 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => {
        const color = val === 'ConTrong' ? 'green' : val === 'Day' ? 'red' : 'orange';
        const text = val === 'ConTrong' ? 'Còn trống' : val === 'Day' ? 'Đầy' : 'Bảo trì';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewBeds(record)}>
            Giường
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.maPhong)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bedColumns = [
    { title: 'Số giường', dataIndex: 'soGiuong', key: 'soGiuong' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'ConTrong' ? 'green' : 'red'}>
          {val === 'ConTrong' ? 'Còn trống' : 'Đang sử dụng'}
        </Tag>
      )
    },
    { 
      title: 'Sinh viên', 
      dataIndex: 'maSinhVien', 
      key: 'maSinhVien',
      render: (val: number) => val ? `SV${val}` : '-'
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
      const response = await phongService.delete(id);
      if (response.success) {
        message.success('Xóa phòng thành công!');
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
        const response = await phongService.update(editingRecord.maPhong, values);
        if (response.success) {
          message.success('Cập nhật phòng thành công!');
        } else {
          message.error(response.message || 'Cập nhật thất bại');
          return;
        }
      } else {
        const response = await phongService.create(values);
        if (response.success) {
          message.success('Thêm phòng thành công!');
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
          <Form.Item name="maToaNha" label="Tòa nhà" rules={[{ required: true }]}>
            <Select placeholder="Chọn tòa nhà">
              {toaNhas.map(tn => (
                <Select.Option key={tn.maToaNha} value={tn.maToaNha}>
                  {tn.tenToaNha}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="soPhong" label="Số phòng" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: A101" />
          </Form.Item>
          <Form.Item name="tang" label="Tầng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="loaiPhong" label="Loại phòng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Phong4Nguoi">Phòng 4 người</Select.Option>
              <Select.Option value="Phong6Nguoi">Phòng 6 người</Select.Option>
              <Select.Option value="Phong8Nguoi">Phòng 8 người</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sucChua" label="Sức chứa" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="giaPhong" label="Giá thuê (VNĐ)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Danh sách giường - Phòng ${selectedRoom?.soPhong}`}
        open={bedModalVisible}
        onCancel={() => setBedModalVisible(false)}
        footer={null}
        width={700}
      >
        <Table 
          columns={bedColumns} 
          dataSource={selectedRoom?.giuongs || []} 
          rowKey="maGiuong"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default AdminPhong;
