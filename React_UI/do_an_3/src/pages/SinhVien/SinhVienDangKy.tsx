import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Table, Tag, Input, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import dangKyService from '../../services/dangKyService';
import phongService from '../../services/phongService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienDangKy: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [regResponse, roomResponse] = await Promise.allSettled([
        dangKyService.getAll(),
        phongService.getAll(undefined, 'ConTrong'),
      ]);

      if (regResponse.status === 'fulfilled' && regResponse.value.success) {
        setRegistrations(regResponse.value.data || []);
      }
      if (roomResponse.status === 'fulfilled' && roomResponse.value.success) {
        setAvailableRooms(roomResponse.value.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Học kỳ', dataIndex: 'hocKy', key: 'hocKy' },
    { title: 'Ngày đăng ký', dataIndex: 'ngayDangKy', key: 'ngayDangKy' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => {
        const color = val === 'ChoDuyet' ? 'orange' : val === 'DaDuyet' ? 'green' : 'red';
        const text = val === 'ChoDuyet' ? 'Chờ duyệt' : val === 'DaDuyet' ? 'Đã duyệt' : 'Từ chối';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      key: 'note',
      render: (_: any, record: any) => {
        if (record.trangThai === 'TuChoi' && record.lyDoTuChoi) {
          return <span style={{ color: 'red' }}>{record.lyDoTuChoi}</span>;
        }
        if (record.trangThai === 'DaDuyet' && record.ngayDuyet) {
          return <span style={{ color: 'green' }}>Duyệt ngày {record.ngayDuyet}</span>;
        }
        return '-';
      }
    }
  ];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await dangKyService.create({
        maPhong: values.maPhong,
        hocKy: 'HK2-2024',
      });
      
      if (response.success) {
        message.success('Đăng ký phòng thành công! Vui lòng chờ duyệt.');
        form.resetFields();
        fetchData();
      } else {
        message.error(response.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  if (loading && registrations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card title="Đăng ký phòng mới" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maPhong" label="Chọn phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
            <Select placeholder="Chọn phòng" loading={loading}>
              {availableRooms.map(room => (
                <Select.Option key={room.maPhong} value={room.maPhong}>
                  {room.soPhong} - {room.tenToaNha} (Còn {(room.sucChua || 0) - (room.soNguoiHienTai || 0)} chỗ) - {room.giaPhong?.toLocaleString('vi-VN')} VNĐ/tháng
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<FileTextOutlined />}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lịch sử đăng ký">
        <Table columns={columns} dataSource={registrations} rowKey="maDangKy" loading={loading} />
      </Card>
    </div>
  );
};

export default SinhVienDangKy;
