import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { mockGiuong } from '../../data/mockData';

const CanBoPhong: React.FC = () => {
  const [data, setData] = useState([
    { maPhong: 1, tenPhong: 'A101', tenToaNha: 'Tòa A', tang: 1, loaiPhong: '4 người', sucChua: 4, giaThue: 500000, trangThai: 'Trống' },
    { maPhong: 2, tenPhong: 'A102', tenToaNha: 'Tòa A', tang: 1, loaiPhong: '4 người', sucChua: 4, giaThue: 500000, trangThai: 'Đầy' },
    { maPhong: 3, tenPhong: 'A201', tenToaNha: 'Tòa A', tang: 2, loaiPhong: '6 người', sucChua: 6, giaThue: 400000, trangThai: 'Còn chỗ' },
    { maPhong: 4, tenPhong: 'B101', tenToaNha: 'Tòa B', tang: 1, loaiPhong: '8 người', sucChua: 8, giaThue: 350000, trangThai: 'Trống' },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bedModalVisible, setBedModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const bedColumns = [
    { title: 'Số giường', dataIndex: 'soGiuong', key: 'soGiuong', width: 100 },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Trống' ? 'green' : 'red'}>{val}</Tag>
      )
    },
    { 
      title: 'Sinh viên', 
      dataIndex: 'tenSinhVien', 
      key: 'tenSinhVien',
      render: (val: string) => val || '-'
    },
    { 
      title: 'Mã SV', 
      dataIndex: 'maSV', 
      key: 'maSV',
      render: (val: string) => val || '-'
    },
  ];

  const handleViewBeds = (record: any) => {
    setSelectedRoom(record);
    setBedModalVisible(true);
  };

  const getBedsForRoom = (maPhong: number) => {
    return mockGiuong.filter(g => g.maPhong === maPhong);
  };

  const columns = [
    { title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
    { title: 'Tên phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Tầng', dataIndex: 'tang', key: 'tang' },
    { title: 'Loại phòng', dataIndex: 'loaiPhong', key: 'loaiPhong' },
    { title: 'Sức chứa', dataIndex: 'sucChua', key: 'sucChua' },
    { title: 'Giá thuê', dataIndex: 'giaThue', key: 'giaThue', render: (val: number) => `${val?.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Trống' ? 'green' : val === 'Đầy' ? 'red' : 'orange'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewBeds(record)}>Giường</Button>
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

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setData(data.filter(item => item.maPhong !== id));
    message.success('Xóa thành công!');
  };

  const handleSubmit = async (values: any) => {
    if (editingRecord) {
      setData(data.map(item => 
        item.maPhong === editingRecord.maPhong ? { ...item, ...values, tenToaNha: values.maToaNha === 1 ? 'Tòa A' : 'Tòa B' } : item
      ));
      message.success('Cập nhật thành công!');
    } else {
      const newItem = { 
        maPhong: data.length + 1, 
        ...values, 
        tenToaNha: values.maToaNha === 1 ? 'Tòa A' : 'Tòa B',
        trangThai: 'Trống'
      };
      setData([...data, newItem]);
      message.success('Thêm mới thành công!');
    }
    setModalVisible(false);
  };

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
              <Select.Option value={1}>Tòa A</Select.Option>
              <Select.Option value={2}>Tòa B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tang" label="Tầng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="loaiPhong" label="Loại phòng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="4 người">4 người</Select.Option>
              <Select.Option value="6 người">6 người</Select.Option>
              <Select.Option value="8 người">8 người</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sucChua" label="Sức chứa" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="giaThue" label="Giá thuê (VNĐ)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Danh sách giường - Phòng ${selectedRoom?.tenPhong}`}
        open={bedModalVisible}
        onCancel={() => setBedModalVisible(false)}
        footer={null}
        width={700}
      >
        <Table 
          columns={bedColumns} 
          dataSource={selectedRoom ? getBedsForRoom(selectedRoom.maPhong) : []} 
          rowKey="maGiuong"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default CanBoPhong;
