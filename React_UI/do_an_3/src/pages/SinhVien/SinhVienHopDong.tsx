import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Descriptions, Tag, Spin, Select, Space, message } from 'antd';
import { EyeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import hopDongService from '../../services/hopDongService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienHopDong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [renewVisible, setRenewVisible] = useState(false);
  const [renewMonths, setRenewMonths] = useState<number>(6);

  const { user } = useAuth();
  const maSinhVien = user?.maActor || 0;

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await hopDongService.getAll(maSinhVien);
      if (response.success) {
        setContracts(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải hợp đồng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [maSinhVien]);

  const columns = [
    { title: 'Số hợp đồng', dataIndex: 'soHopDong', key: 'soHopDong' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { 
      title: 'Giường', 
      dataIndex: 'soGiuong', 
      key: 'soGiuong', 
      render: (val: number) => `Giường ${val}` 
    },
    { title: 'Học kỳ', dataIndex: 'hocKy', key: 'hocKy' },
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
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            Chi tiết
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => handleOpenRenew(record)}>
            Gia hạn
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (contract: any) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const handleOpenRenew = (contract: any) => {
    setSelectedContract(contract);
    setRenewMonths(6);
    setRenewVisible(true);
  };

  const handleRenew = async () => {
    if (!selectedContract) return;
    try {
      setLoading(true);
      const response = await hopDongService.giaHan(selectedContract.maHopDong, { soThangGiaHan: renewMonths });
      if (response.success) {
        message.success('Gia hạn hợp đồng thành công!');
        setRenewVisible(false);
        await fetchContracts();
      } else {
        message.error(response.message || 'Gia hạn thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gia hạn');
    } finally {
      setLoading(false);
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
      <Table columns={columns} dataSource={contracts} rowKey="maHopDong" />
      
      <Modal
        title="Chi tiết hợp đồng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="print" type="primary" icon={<FileTextOutlined />}>
            In hợp đồng
          </Button>,
        ]}
        width={700}
      >
        {selectedContract && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hợp đồng" span={2}>{selectedContract.soHopDong}</Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedContract.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedContract.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedContract.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Giường">Giường số {selectedContract.soGiuong}</Descriptions.Item>
            <Descriptions.Item label="Học kỳ" span={2}>{selectedContract.hocKy}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{selectedContract.ngayBatDau}</Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">{selectedContract.ngayKetThuc}</Descriptions.Item>
            <Descriptions.Item label="Giá thuê" span={2}>
              <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                {selectedContract.giaThue?.toLocaleString('vi-VN')} VNĐ/tháng
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedContract.ngayTao}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedContract.trangThai === 'HieuLuc' ? 'green' : 'red'}>
                {selectedContract.trangThai === 'HieuLuc' ? 'Hiệu lực' : 'Hết hạn'}
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

export default SinhVienHopDong;
