import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, DatePicker, Select, message, Space, Tag, Spin, Descriptions, Input, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import hopDongService from '../../services/hopDongService';
import sinhVienService from '../../services/sinhVienService';
import phongService from '../../services/phongService';

const CanBoHopDong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hopDongService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải hợp đồng:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [studentResponse, roomResponse] = await Promise.all([
        sinhVienService.getAll(),
        phongService.getAll(),
      ]);
      if (studentResponse.success) setStudents(studentResponse.data || []);
      if (roomResponse.success) setRooms(roomResponse.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu form:', error);
    }
  };

  const handleRoomChange = async (maPhong: number) => {
    const room = rooms.find(r => r.maPhong === maPhong);
    form.setFieldsValue({ maGiuong: undefined, giaThue: room?.giaPhong });
    try {
      const response = await phongService.getGiuong(maPhong);
      if (response.success) {
        setBeds((response.data || []).filter((bed: any) => bed.trangThai === 'ConTrong' || bed.trangThai === 'DangSuDung'));
      }
    } catch (error) {
      message.error('Không thể tải danh sách giường');
      setBeds([]);
    }
  };

  const columns = [
    { title: 'Số hợp đồng', dataIndex: 'soHopDong', key: 'soHopDong' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Ngày bắt đầu', dataIndex: 'ngayBatDau', key: 'ngayBatDau' },
    { title: 'Ngày kết thúc', dataIndex: 'ngayKetThuc', key: 'ngayKetThuc' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'HieuLuc' ? 'green' : 'red'}>
          {val === 'HieuLuc' ? 'Hiệu lực' : 'Hết hạn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          <Button icon={<FileTextOutlined />} size="small">
            In hợp đồng
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        ngayBatDau: values.ngayBatDau?.format('YYYY-MM-DD'),
        ngayKetThuc: values.ngayKetThuc?.format('YYYY-MM-DD'),
      };
      const response = await hopDongService.create(submitData);
      if (response.success) {
        message.success('Tạo hợp đồng thành công!');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(response.message || 'Tạo hợp đồng thất bại');
      }
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
          <Form.Item name="soHopDong" label="Số hợp đồng" rules={[{ required: true, message: 'Số hợp đồng bắt buộc' }]}>
            <Input placeholder="Ví dụ: HD20251001" />
          </Form.Item>
          <Form.Item name="maSinhVien" label="Sinh viên" rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}>
            <Select placeholder="Chọn sinh viên" optionFilterProp="children" showSearch>
              {students.map(sv => (
                <Select.Option key={sv.maSinhVien} value={sv.maSinhVien}>
                  {sv.maSv} - {sv.hoTen} ({sv.khoa})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maPhong" label="Phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}>
            <Select placeholder="Chọn phòng" onChange={handleRoomChange} optionFilterProp="children" showSearch>
              {rooms.map(r => (
                <Select.Option key={r.maPhong} value={r.maPhong}>
                  {r.soPhong} - {r.tenToaNha} (Giá: {r.giaPhong?.toLocaleString('vi-VN')} VNĐ)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maGiuong" label="Giường" rules={[{ required: true, message: 'Vui lòng chọn giường' }]}>
            <Select placeholder="Chọn giường" allowClear>
              {beds.map(b => (
                <Select.Option key={b.maGiuong} value={b.maGiuong}>
                  Giường {b.soGiuong} {b.maSinhVien ? `(Đã thuê)` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="ngayBatDau" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ngayKetThuc" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="giaThue" label="Giá thuê" rules={[{ required: true, message: 'Vui lòng nhập giá thuê' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết hợp đồng"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hợp đồng" span={2}>{selectedRecord.soHopDong}</Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Giường">Giường số {selectedRecord.soGiuong}</Descriptions.Item>
            <Descriptions.Item label="Học kỳ" span={2}>{selectedRecord.hocKy}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{selectedRecord.ngayBatDau}</Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">{selectedRecord.ngayKetThuc}</Descriptions.Item>
            <Descriptions.Item label="Giá thuê" span={2}>
              <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                {selectedRecord.giaThue?.toLocaleString('vi-VN')} VNĐ/tháng
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedRecord.trangThai === 'HieuLuc' ? 'green' : 'red'}>
                {selectedRecord.trangThai === 'HieuLuc' ? 'Hiệu lực' : 'Hết hạn'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CanBoHopDong;
