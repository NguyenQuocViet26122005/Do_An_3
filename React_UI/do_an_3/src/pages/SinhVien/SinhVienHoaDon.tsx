import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Descriptions, Tag, message, Spin } from 'antd';
import { EyeOutlined, DollarOutlined } from '@ant-design/icons';
import hoaDonService from '../../services/hoaDonService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienHoaDon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { user } = useAuth();
  const maSinhVien = user?.maActor || 0;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await hoaDonService.getAll(maSinhVien);
        if (response.success) {
          setInvoices(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải hóa đơn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [maSinhVien]);

  const columns = [
    { title: 'Số hóa đơn', dataIndex: 'soHoaDon', key: 'soHoaDon' },
    { 
      title: 'Tháng/Năm', 
      key: 'thangNam',
      render: (_: any, record: any) => `${record.thang}/${record.nam}`
    },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
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
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} style={{ marginRight: 8 }}>
            Chi tiết
          </Button>
          {record.trangThai === 'ChuaThanhToan' && (
            <Button type="primary" icon={<DollarOutlined />} onClick={() => handlePay(record)}>
              Thanh toán
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  const handlePay = (invoice: any) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: `Bạn có chắc muốn thanh toán hóa đơn ${invoice.soHoaDon} với số tiền ${invoice.tongTien?.toLocaleString('vi-VN')} VNĐ?`,
      onOk: async () => {
        try {
          const response = await hoaDonService.thanhToan(invoice.maHoaDon, 'Chuyển khoản');
          if (response.success) {
            message.success('Thanh toán thành công!');
            // Reload data
            const reloadResponse = await hoaDonService.getAll(maSinhVien);
            if (reloadResponse.success) {
              setInvoices(reloadResponse.data);
            }
          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi thanh toán');
        }
      },
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
      <Table columns={columns} dataSource={invoices} rowKey="maHoaDon" />
      
      <Modal
        title="Chi tiết hóa đơn"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedInvoice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hóa đơn" span={2}>{selectedInvoice.soHoaDon}</Descriptions.Item>
            <Descriptions.Item label="Tháng/Năm">{selectedInvoice.thang}/{selectedInvoice.nam}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedInvoice.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Ngày phát hành">{selectedInvoice.ngayPhatHanh}</Descriptions.Item>
            <Descriptions.Item label="Hạn thanh toán">{selectedInvoice.hanThanhToan}</Descriptions.Item>
            <Descriptions.Item label="Tiền phòng">{selectedInvoice.tienPhong?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền điện">{selectedInvoice.tienDien?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Chỉ số điện">Cũ: {selectedInvoice.chiSoDienCu} - Mới: {selectedInvoice.chiSoDienMoi}</Descriptions.Item>
            <Descriptions.Item label="Tiền nước">{selectedInvoice.tienNuoc?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Chỉ số nước">Cũ: {selectedInvoice.chiSoNuocCu} - Mới: {selectedInvoice.chiSoNuocMoi}</Descriptions.Item>
            <Descriptions.Item label="Phí dịch vụ">{selectedInvoice.phiDichVu?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Phí phạt">{selectedInvoice.phiPhat?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <strong style={{ color: '#f5222d', fontSize: '18px' }}>
                {selectedInvoice.tongTien?.toLocaleString('vi-VN')} VNĐ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedInvoice.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>
                {selectedInvoice.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Tag>
            </Descriptions.Item>
            {selectedInvoice.trangThai === 'DaThanhToan' && (
              <>
                <Descriptions.Item label="Ngày thanh toán">{selectedInvoice.ngayThanhToan}</Descriptions.Item>
                <Descriptions.Item label="Phương thức">{selectedInvoice.phuongThucThanhToan}</Descriptions.Item>
                {selectedInvoice.maGiaoDich && (
                  <Descriptions.Item label="Mã giao dịch" span={2}>{selectedInvoice.maGiaoDich}</Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienHoaDon;
