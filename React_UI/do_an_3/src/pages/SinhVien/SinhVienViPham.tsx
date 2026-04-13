import React, { useState } from 'react';
import { Table, Button, Modal, Descriptions, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const SinhVienViPham: React.FC = () => {
  const [violations] = useState([
    {
      id: 1,
      code: 'VP001',
      type: 'Gây ồn',
      date: '2024-02-15',
      description: 'Gây ồn sau 22h',
      fine: 100000,
      status: 'Chưa xử lý',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);

  const columns = [
    { title: 'Mã vi phạm', dataIndex: 'code', key: 'code' },
    { title: 'Loại vi phạm', dataIndex: 'type', key: 'type' },
    { title: 'Ngày vi phạm', dataIndex: 'date', key: 'date' },
    { title: 'Tiền phạt', dataIndex: 'fine', key: 'fine', render: (val: number) => `${val.toLocaleString()} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val === 'Đã xử lý' ? 'green' : 'orange'}>{val}</Tag>
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

  return (
    <div>
      <Table columns={columns} dataSource={violations} rowKey="id" />
      
      <Modal
        title="Chi tiết vi phạm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedViolation && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã vi phạm">{selectedViolation.code}</Descriptions.Item>
            <Descriptions.Item label="Loại vi phạm">{selectedViolation.type}</Descriptions.Item>
            <Descriptions.Item label="Ngày vi phạm">{selectedViolation.date}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selectedViolation.description}</Descriptions.Item>
            <Descriptions.Item label="Tiền phạt">
              <strong style={{ color: '#f5222d' }}>{selectedViolation.fine.toLocaleString()} VNĐ</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedViolation.status === 'Đã xử lý' ? 'green' : 'orange'}>
                {selectedViolation.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienViPham;
