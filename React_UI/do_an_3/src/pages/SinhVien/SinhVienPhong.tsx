import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Modal, Descriptions } from 'antd';
import { HomeOutlined, EyeOutlined } from '@ant-design/icons';

const SinhVienPhong: React.FC = () => {
  const [rooms] = useState([
    { id: 1, name: 'A101', building: 'Tòa A', floor: 1, type: '4 người', capacity: 4, available: 2, price: 500000 },
    { id: 2, name: 'A102', building: 'Tòa A', floor: 1, type: '4 người', capacity: 4, available: 1, price: 500000 },
    { id: 3, name: 'B201', building: 'Tòa B', floor: 2, type: '6 người', capacity: 6, available: 3, price: 400000 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const handleViewDetail = (room: any) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {rooms.map((room) => (
          <Col span={8} key={room.id}>
            <Card
              title={
                <span>
                  <HomeOutlined /> {room.name}
                </span>
              }
              extra={<Tag color="green">Còn {room.available} chỗ</Tag>}
            >
              <p><strong>Tòa nhà:</strong> {room.building}</p>
              <p><strong>Tầng:</strong> {room.floor}</p>
              <p><strong>Loại:</strong> {room.type}</p>
              <p><strong>Giá:</strong> {room.price.toLocaleString()} VNĐ/tháng</p>
              <Button type="primary" block onClick={() => handleViewDetail(room)}>
                <EyeOutlined /> Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Chi tiết phòng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedRoom && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên phòng">{selectedRoom.name}</Descriptions.Item>
            <Descriptions.Item label="Tòa nhà">{selectedRoom.building}</Descriptions.Item>
            <Descriptions.Item label="Tầng">{selectedRoom.floor}</Descriptions.Item>
            <Descriptions.Item label="Loại phòng">{selectedRoom.type}</Descriptions.Item>
            <Descriptions.Item label="Sức chứa">{selectedRoom.capacity} người</Descriptions.Item>
            <Descriptions.Item label="Còn trống">{selectedRoom.available} chỗ</Descriptions.Item>
            <Descriptions.Item label="Giá thuê">{selectedRoom.price.toLocaleString()} VNĐ/tháng</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienPhong;
