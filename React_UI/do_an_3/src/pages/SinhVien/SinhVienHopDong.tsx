import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Descriptions, Tag, Spin, message } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import hopDongService from '../../services/hopDongService';
import { useAuth } from '../../contexts/AuthContext';
import { exportContractToPDF } from '../../utils/exportUtils';

const SinhVienHopDong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

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
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleView = (contract: any) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const handlePrintContract = () => {
    if (!selectedContract) return;
    exportContractToPDF({
      soHopDong: selectedContract.soHopDong,
      tenSinhVien: selectedContract.tenSinhVien,
      maSV: selectedContract.maSV,
      tenPhong: selectedContract.tenPhong,
      soGiuong: selectedContract.soGiuong,
      hocKy: selectedContract.hocKy,
      ngayBatDau: selectedContract.ngayBatDau,
      ngayKetThuc: selectedContract.ngayKetThuc,
      giaThue: selectedContract.giaThue
    });
    message.success('Đã xuất hợp đồng ra PDF');
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
          <Button key="print" type="primary" icon={<FileTextOutlined />} onClick={handlePrintContract}>
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
    </div>
  );
};

export default SinhVienHopDong;
