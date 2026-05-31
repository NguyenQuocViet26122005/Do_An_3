import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, DatePicker, Select, message, Space, Tag, Spin, Descriptions, Input, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import hopDongService from '../../services/hopDongService';
import sinhVienService from '../../services/sinhVienService';
import phongService from '../../services/phongService';
import { exportContractToPDF } from '../../utils/exportUtils';

const CanBoHopDong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [renewVisible, setRenewVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [renewMonths, setRenewMonths] = useState<number>(6);
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
        setBeds((response.data || []).filter((bed: any) => bed.trangThai === 'ConTrong' && !bed.maSinhVien));
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
          <Button icon={<ReloadOutlined />} size="small" onClick={() => handleOpenRenew(record)}>
            Gia hạn
          </Button>
          <Button icon={<FileTextOutlined />} size="small" onClick={() => handlePrintContract(record)}>
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

  const handleOpenRenew = (record: any) => {
    setSelectedRecord(record);
    setRenewMonths(6);
    setRenewVisible(true);
  };

  const handleRenew = async () => {
    if (!selectedRecord) return;
    try {
      setLoading(true);
      const response = await hopDongService.giaHan(selectedRecord.maHopDong, { soThangGiaHan: renewMonths });
      if (response.success) {
        message.success('Gia hạn hợp đồng thành công!');
        setRenewVisible(false);
        await fetchData();
      } else {
        message.error(response.message || 'Gia hạn thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gia hạn');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintContract = (record: any) => {
    exportContractToPDF({
      soHopDong: record.soHopDong,
      tenSinhVien: record.tenSinhVien,
      maSV: record.maSV,
      tenPhong: record.tenPhong,
      soGiuong: record.soGiuong,
      hocKy: record.hocKy,
      ngayBatDau: record.ngayBatDau,
      ngayKetThuc: record.ngayKetThuc,
      giaThue: record.giaThue
    });
    message.success('Đã xuất hợp đồng ra PDF');
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        ngayBatDau: values.ngayBatDau?.format('YYYY-MM-DD'),
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
                  Giường {b.soGiuong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="hocKy" label="Học kỳ" rules={[{ required: true, message: 'Vui lòng nhập học kỳ' }]}>
            <Input placeholder="Ví dụ: HK1 2025-2026" />
          </Form.Item>
          <Form.Item name="ngayBatDau" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="soThang" label="Thời hạn hợp đồng" rules={[{ required: true, message: 'Vui lòng chọn thời hạn' }]}>
            <Select placeholder="Chọn thời hạn">
              <Select.Option value={6}>6 tháng</Select.Option>
              <Select.Option value={12}>1 năm</Select.Option>
              <Select.Option value={24}>2 năm</Select.Option>
              <Select.Option value={36}>3 năm</Select.Option>
            </Select>
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

      <Modal
        title="Gia hạn hợp đồng"
        open={renewVisible}
        onCancel={() => setRenewVisible(false)}
        onOk={handleRenew}
        okText="Gia hạn"
        cancelText="Hủy"
      >
        {selectedRecord && (
          <div style={{ marginBottom: 16 }}>
            <p><strong>Hợp đồng:</strong> {selectedRecord.soHopDong}</p>
            <p><strong>Sinh viên:</strong> {selectedRecord.tenSinhVien}</p>
            <p><strong>Phòng:</strong> {selectedRecord.tenPhong}</p>
            <p><strong>Ngày kết thúc hiện tại:</strong> {selectedRecord.ngayKetThuc}</p>
          </div>
        )}
        <div style={{ marginBottom: 8 }}>Chọn thời hạn gia hạn:</div>
        <Select value={renewMonths} onChange={setRenewMonths} style={{ width: '100%' }}>
          <Select.Option value={6}>6 tháng</Select.Option>
          <Select.Option value={12}>1 năm</Select.Option>
          <Select.Option value={24}>2 năm</Select.Option>
          <Select.Option value={36}>3 năm</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default CanBoHopDong;
