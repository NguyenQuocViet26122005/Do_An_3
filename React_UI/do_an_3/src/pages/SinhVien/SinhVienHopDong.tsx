import React, { useState } from 'react';
import { Table, Button, Modal, Descriptions, Tag } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';

const SinhVienHopDong: React.FC = () => {
  const [contracts] = useState([
    {
      id: 1,
      code: 'HD001',
      room: 'A101',
      building: 'Tòa A',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'Đang hiệu lực',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const columns = [
    { title: 'Mã hợp đồng', dataIndex: 'code', key: 'code' },
    { title: 'Phòng', dataIndex: 'room', key: 'room' },
    { title: 'Tòa nhà', dataIndex: 'building', key: 'building' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val === 'Đang hiệu lực' ? 'green' : 'red'}>{val}</Tag>
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

  return (
    <div>
      <Table columns={columns} dataSource={contracts} rowKey="id" />
      
      <Modal
        title="Chi tiết hợp đồng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="print" type="primary" icon={<FileTextOutlined />}>
            In hợp đồng
          </Button>,
        ]}
      >
        {selectedContract && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã hợp đồng">{selectedContract.code}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedContract.room}</Descriptions.Item>
            <Descriptions.Item label="Tòa nhà">{selectedContract.building}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{selectedContract.startDate}</Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">{selectedContract.endDate}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color="green">{selectedContract.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienHopDong;
