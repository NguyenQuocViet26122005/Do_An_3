import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Descriptions, Tag, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import viPhamService from '../../services/viPhamService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienViPham: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);

  const { user } = useAuth();
  const maSinhVien = user?.maActor || 0;

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const response = await viPhamService.getAll(maSinhVien);
        if (response.success) {
          setViolations(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải vi phạm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [maSinhVien]);

  const columns = [
    { title: 'Tên vi phạm', dataIndex: 'tenViPham', key: 'tenViPham' },
    { 
      title: 'Mức độ', 
      dataIndex: 'mucDo', 
      key: 'mucDo',
      render: (val: string) => {
        const color = val === 'Nhe' ? 'green' : val === 'TrungBinh' ? 'orange' : 'red';
        const text = val === 'Nhe' ? 'Nhẹ' : val === 'TrungBinh' ? 'Trung bình' : 'Nặng';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: 'Ngày vi phạm', dataIndex: 'ngayViPham', key: 'ngayViPham' },
    { 
      title: 'Tiền phạt', 
      dataIndex: 'mucPhat', 
      key: 'mucPhat', 
      render: (val: number) => `${val?.toLocaleString('vi-VN')} VNĐ` 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'DaXuLy' ? 'green' : 'orange'}>
          {val === 'DaXuLy' ? 'Đã xử lý' : 'Chờ duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleView = (violation: any) => {
    setSelectedViolation(violation);
    setModalVisible(true);
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
      <Table columns={columns} dataSource={violations} rowKey="maViPham" />
      
      <Modal
        title="Chi tiết vi phạm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedViolation && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Sinh viên" span={2}>{selectedViolation.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedViolation.maSV}</Descriptions.Item>
            <Descriptions.Item label="Ngày vi phạm">{selectedViolation.ngayViPham}</Descriptions.Item>
            <Descriptions.Item label="Tên vi phạm" span={2}>{selectedViolation.tenViPham}</Descriptions.Item>
            <Descriptions.Item label="Mức độ">
              <Tag color={selectedViolation.mucDo === 'Nhe' ? 'green' : selectedViolation.mucDo === 'TrungBinh' ? 'orange' : 'red'}>
                {selectedViolation.mucDo === 'Nhe' ? 'Nhẹ' : selectedViolation.mucDo === 'TrungBinh' ? 'Trung bình' : 'Nặng'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tiền phạt">
              <strong style={{ color: '#f5222d', fontSize: '16px' }}>
                {selectedViolation.mucPhat?.toLocaleString('vi-VN')} VNĐ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selectedViolation.moTa}</Descriptions.Item>
            <Descriptions.Item label="Ngày ghi nhận">{selectedViolation.ngayGhi}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedViolation.trangThai === 'DaXuLy' ? 'green' : 'orange'}>
                {selectedViolation.trangThai === 'DaXuLy' ? 'Đã xử lý' : 'Chờ duyệt'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienViPham;
