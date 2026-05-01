import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, Input, message, Tag, Spin, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import baoTriService from '../../services/baoTriService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienBaoTri: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [form] = Form.useForm();

  const { user } = useAuth();
  const maSinhVien = user?.maActor || 0;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await baoTriService.getAll(maSinhVien);
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải yêu cầu bảo trì:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe' },
    { 
      title: 'Loại yêu cầu', 
      dataIndex: 'loaiYeuCau', 
      key: 'loaiYeuCau',
      render: (val: string) => {
        const text = val === 'Dien' ? 'Điện' : val === 'Nuoc' ? 'Nước' : 'Khắc phục';
        return text;
      }
    },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => {
        const color = val === 'ChoDuyet' ? 'orange' : val === 'DangXuLy' ? 'blue' : 'green';
        const text = val === 'ChoDuyet' ? 'Chờ duyệt' : val === 'DangXuLy' ? 'Đang xử lý' : 'Hoàn thành';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleViewDetail = (request: any) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await baoTriService.create({
        maPhong: 1, // TODO: Lấy từ hợp đồng hiện tại
        tieuDe: values.tieuDe,
        moTa: values.moTa,
        loaiYeuCau: values.loaiYeuCau
      });
      
      if (response.success) {
        message.success('Gửi yêu cầu bảo trì thành công!');
        setModalVisible(false);
        fetchRequests(); // Reload data
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi yêu cầu');
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
          Gửi yêu cầu bảo trì
        </Button>
      </div>
      <Table columns={columns} dataSource={requests} rowKey="maYeuCau" />
      
      <Modal
        title="Gửi yêu cầu bảo trì"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="Ví dụ: Đèn hỏng, vòi nước rò..." />
          </Form.Item>
          <Form.Item name="loaiYeuCau" label="Loại sự cố" rules={[{ required: true, message: 'Vui lòng chọn loại sự cố!' }]}>
            <Select placeholder="Chọn loại sự cố">
              <Select.Option value="Dien">Điện</Select.Option>
              <Select.Option value="Nuoc">Nước</Select.Option>
              <Select.Option value="KhacPhuc">Khắc phục</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng mô tả chi tiết!' }]}>
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết sự cố..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết yêu cầu bảo trì"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRequest && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tiêu đề" span={2}>{selectedRequest.tieuDe}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRequest.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Loại yêu cầu">
              {selectedRequest.loaiYeuCau === 'Dien' ? 'Điện' : selectedRequest.loaiYeuCau === 'Nuoc' ? 'Nước' : 'Khắc phục'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedRequest.ngayTao}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedRequest.trangThai === 'ChoDuyet' ? 'orange' : selectedRequest.trangThai === 'DangXuLy' ? 'blue' : 'green'}>
                {selectedRequest.trangThai === 'ChoDuyet' ? 'Chờ duyệt' : selectedRequest.trangThai === 'DangXuLy' ? 'Đang xử lý' : 'Hoàn thành'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selectedRequest.moTa}</Descriptions.Item>
            {selectedRequest.ngayXuLy && (
              <Descriptions.Item label="Ngày xử lý">{selectedRequest.ngayXuLy}</Descriptions.Item>
            )}
            {selectedRequest.chiPhi && (
              <Descriptions.Item label="Chi phí">{selectedRequest.chiPhi?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienBaoTri;
