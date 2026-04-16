import React, { useState } from 'react';
import { Table, Button, Modal, Descriptions, Tag, message } from 'antd';
import { EyeOutlined, DollarOutlined } from '@ant-design/icons';

const SinhVienHoaDon: React.FC = () => {
  const [invoices] = useState([
    {
      id: 1,
      code: 'HD001',
      month: '2024-03',
      room: 'A101',
      roomFee: 500000,
      electricFee: 150000,
      waterFee: 50000,
      total: 700000,
      status: 'Chưa thanh toán',
    },
    {
      id: 2,
      code: 'HD002',
      month: '2024-02',
      room: 'A101',
      roomFee: 500000,
      electricFee: 140000,
      waterFee: 45000,
      total: 685000,
      status: 'Đã thanh toán',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const columns = [
    { title: 'Mã hóa đơn', dataIndex: 'code', key: 'code' },
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Phòng', dataIndex: 'room', key: 'room' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: (val: number) => `${val.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val === 'Đã thanh toán' ? 'green' : 'orange'}>{val}</Tag>
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
          {record.status === 'Chưa thanh toán' && (
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
      content: `Bạn có chắc muốn thanh toán hóa đơn ${invoice.code} với số tiền ${invoice.total.toLocaleString()} VNĐ?`,
      onOk() {
        message.success('Chuyển đến trang thanh toán...');
      },
    });
  };

  return (
    <div>
      <Table columns={columns} dataSource={invoices} rowKey="id" />
      
      <Modal
        title="Chi tiết hóa đơn"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedInvoice && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã hóa đơn">{selectedInvoice.code}</Descriptions.Item>
            <Descriptions.Item label="Tháng">{selectedInvoice.month}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedInvoice.room}</Descriptions.Item>
            <Descriptions.Item label="Tiền phòng">{selectedInvoice.roomFee.toLocaleString()} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền điện">{selectedInvoice.electricFee.toLocaleString()} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền nước">{selectedInvoice.waterFee.toLocaleString()} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <strong style={{ color: '#f5222d' }}>{selectedInvoice.total.toLocaleString()} VNĐ</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedInvoice.status === 'Đã thanh toán' ? 'green' : 'orange'}>
                {selectedInvoice.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienHoaDon;
