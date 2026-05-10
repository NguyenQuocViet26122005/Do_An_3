import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions, Form, Input, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import dangKyService, { DangKyPhong } from '../../services/dangKyService';

const CanBoDangKy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DangKyPhong[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DangKyPhong | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dangKyService.getAll();
      if (response.success) {
        setData(response.data || []);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
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
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DangKyPhong) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          {record.trangThai === 'ChoDuyet' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} size="small" onClick={() => handleApprove(record)}>
                Duyệt
              </Button>
              <Button danger icon={<CloseOutlined />} size="small" onClick={() => handleRejectClick(record)}>
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetail = (record: DangKyPhong) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleApprove = async (record: DangKyPhong) => {
    try {
      const response = await dangKyService.duyet(record.maDangKy, {
        trangThai: 'DaDuyet',
      });
      if (response.success) {
        message.success('Đã duyệt đăng ký!');
        fetchData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi duyệt');
    }
  };

  const handleRejectClick = (record: DangKyPhong) => {
    setSelectedRecord(record);
    form.resetFields();
    setRejectModalVisible(true);
  };

  const handleReject = async (values: any) => {
    if (!selectedRecord) return;
    try {
      const response = await dangKyService.duyet(selectedRecord.maDangKy, {
        trangThai: 'TuChoi',
        lyDoTuChoi: values.lyDoTuChoi,
      });
      if (response.success) {
        message.success('Đã từ chối đăng ký!');
        setRejectModalVisible(false);
        fetchData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối');
    }
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maDangKy" />
      
      <Modal title="Chi tiết đăng ký" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Tòa nhà">{selectedRecord.tenToaNha}</Descriptions.Item>
            <Descriptions.Item label="Học kỳ">{selectedRecord.hocKy}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">{selectedRecord.ngayDangKy}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedRecord.trangThai === 'ChoDuyet' ? 'orange' : selectedRecord.trangThai === 'DaDuyet' ? 'green' : 'red'}>
                {selectedRecord.trangThai === 'ChoDuyet' ? 'Chờ duyệt' : selectedRecord.trangThai === 'DaDuyet' ? 'Đã duyệt' : 'Từ chối'}
              </Tag>
            </Descriptions.Item>
            {selectedRecord.ngayDuyet && (
              <Descriptions.Item label="Ngày duyệt" span={2}>{selectedRecord.ngayDuyet}</Descriptions.Item>
            )}
            {selectedRecord.lyDoTuChoi && (
              <Descriptions.Item label="Lý do từ chối" span={2}>
                <span style={{ color: 'red' }}>{selectedRecord.lyDoTuChoi}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal title="Từ chối đăng ký" open={rejectModalVisible} onCancel={() => setRejectModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleReject}>
          <Form.Item name="lyDoTuChoi" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoDangKy;
