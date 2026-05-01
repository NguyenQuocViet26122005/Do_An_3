import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions, Spin } from 'antd';
import { EyeOutlined, DollarOutlined } from '@ant-design/icons';
import hoaDonService from '../../services/hoaDonService';

const CanBoHoaDon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hoaDonService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải hóa đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Số hóa đơn', dataIndex: 'soHoaDon', key: 'soHoaDon' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { 
      title: 'Tháng/Năm', 
      key: 'thangNam',
      render: (_: any, record: any) => `${record.thang}/${record.nam}`
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'tongTien', 
      key: 'tongTien', 
      render: (val: number) => `${val?.toLocaleString('vi-VN')} VNĐ` 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'DaThanhToan' ? 'green' : 'orange'}>
          {val === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            Chi tiết
          </Button>
          {record.trangThai === 'ChuaThanhToan' && (
            <Button 
              type="primary" 
              icon={<DollarOutlined />} 
              size="small"
              onClick={() => handleConfirmPayment(record)}
            >
              Xác nhận thanh toán
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

  const handleConfirmPayment = async (record: any) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: `Xác nhận sinh viên đã thanh toán hóa đơn ${record.soHoaDon}?`,
      onOk: async () => {
        try {
          const response = await hoaDonService.thanhToan(record.maHoaDon, 'Tiền mặt');
          if (response.success) {
            message.success('Xác nhận thanh toán thành công!');
            fetchData();
          }
        } catch (error) {
          message.error('Có lỗi xảy ra');
        }
      }
    });
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
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maHoaDon" />
      
      <Modal
        title="Chi tiết hóa đơn"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hóa đơn" span={2}>{selectedRecord.soHoaDon}</Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Tháng/Năm">{selectedRecord.thang}/{selectedRecord.nam}</Descriptions.Item>
            <Descriptions.Item label="Tiền phòng">{selectedRecord.tienPhong?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền điện">{selectedRecord.tienDien?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền nước">{selectedRecord.tienNuoc?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Phí dịch vụ">{selectedRecord.phiDichVu?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <strong style={{ fontSize: '18px', color: '#f5222d' }}>
                {selectedRecord.tongTien?.toLocaleString('vi-VN')} VNĐ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedRecord.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>
                {selectedRecord.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Tag>
            </Descriptions.Item>
            {selectedRecord.trangThai === 'DaThanhToan' && (
              <>
                <Descriptions.Item label="Ngày thanh toán">{selectedRecord.ngayThanhToan}</Descriptions.Item>
                <Descriptions.Item label="Phương thức">{selectedRecord.phuongThucThanhToan}</Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CanBoHoaDon;
