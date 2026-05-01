import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, message, Space, Tag, Input, InputNumber, Spin, Descriptions } from 'antd';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import baoTriService from '../../services/baoTriService';

const CanBoBaoTri: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await baoTriService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải yêu cầu bảo trì:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
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
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            Chi tiết
          </Button>
          {record.trangThai !== 'DaHoanThanh' && (
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              size="small" 
              onClick={() => handleUpdateClick(record)}
            >
              Cập nhật
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleUpdateClick = (record: any) => {
    setSelectedRecord(record);
    form.resetFields();
    form.setFieldsValue({
      trangThai: record.trangThai === 'ChoDuyet' ? 'DangXuLy' : 'DaHoanThanh'
    });
    setUpdateModalVisible(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await baoTriService.xuLy(selectedRecord.maYeuCau, values);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công!');
        setUpdateModalVisible(false);
        fetchData();
      }
    } catch (error) {
      message.error('Có lỗi xảy ra');
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
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maYeuCau" />
      
      <Modal
        title="Chi tiết yêu cầu bảo trì"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Loại yêu cầu">
              {selectedRecord.loaiYeuCau === 'Dien' ? 'Điện' : selectedRecord.loaiYeuCau === 'Nuoc' ? 'Nước' : 'Khắc phục'}
            </Descriptions.Item>
            <Descriptions.Item label="Tiêu đề" span={2}>{selectedRecord.tieuDe}</Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selectedRecord.moTa}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedRecord.ngayTao}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedRecord.trangThai === 'ChoDuyet' ? 'orange' : selectedRecord.trangThai === 'DangXuLy' ? 'blue' : 'green'}>
                {selectedRecord.trangThai === 'ChoDuyet' ? 'Chờ duyệt' : selectedRecord.trangThai === 'DangXuLy' ? 'Đang xử lý' : 'Hoàn thành'}
              </Tag>
            </Descriptions.Item>
            {selectedRecord.ngayXuLy && (
              <Descriptions.Item label="Ngày xử lý">{selectedRecord.ngayXuLy}</Descriptions.Item>
            )}
            {selectedRecord.chiPhi && (
              <Descriptions.Item label="Chi phí">
                <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {selectedRecord.chiPhi?.toLocaleString('vi-VN')} VNĐ
                </strong>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Cập nhật yêu cầu bảo trì"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="DangXuLy">Đang xử lý</Select.Option>
              <Select.Option value="DaHoanThanh">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="chiPhi" label="Chi phí (VNĐ)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú về quá trình xử lý..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoBaoTri;
