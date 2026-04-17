import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Modal, Descriptions, Table } from 'antd';
import { HomeOutlined, EyeOutlined } from '@ant-design/icons';
import { mockPhong, mockGiuong } from '../../data/mockData';

const SinhVienPhong: React.FC = () => {
  // Lọc các phòng có chỗ trống
  const availableRooms = mockPhong.filter(p => p.trangThai !== 'Đầy').map(phong => {
    const giuongTrong = mockGiuong.filter(g => g.maPhong === phong.maPhong && g.trangThai === 'Trống').length;
    return { ...phong, giuongTrong };
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const handleViewDetail = (room: any) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  // Lấy danh sách giường của phòng được chọn
  const getBedsForRoom = (maPhong: number) => {
    return mockGiuong.filter(g => g.maPhong === maPhong);
  };

  const bedColumns = [
    { title: 'Số giường', dataIndex: 'soGiuong', key: 'soGiuong', width: 100 },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Trống' ? 'green' : 'red'}>{val}</Tag>
      )
    },
    { 
      title: 'Sinh viên', 
      dataIndex: 'tenSinhVien', 
      key: 'tenSinhVien',
      render: (val: string) => val || '-'
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {availableRooms.map((room) => (
          <Col span={8} key={room.maPhong}>
            <Card
              title={
                <span>
                  <HomeOutlined /> {room.tenPhong}
                </span>
              }
              extra={<Tag color="green">Còn {room.giuongTrong} giường trống</Tag>}
            >
              <p><strong>Tòa nhà:</strong> {room.tenToaNha}</p>
              <p><strong>Tầng:</strong> {room.tang}</p>
              <p><strong>Loại:</strong> {room.loaiPhong}</p>
              <p><strong>Sức chứa:</strong> {room.sucChua} người</p>
              <p><strong>Giá:</strong> {room.giaThue.toLocaleString()} VNĐ/tháng</p>
              <Button type="primary" block onClick={() => handleViewDetail(room)}>
                <EyeOutlined /> Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Chi tiết phòng ${selectedRoom?.tenPhong}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRoom && (
          <>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Tên phòng">{selectedRoom.tenPhong}</Descriptions.Item>
              <Descriptions.Item label="Tòa nhà">{selectedRoom.tenToaNha}</Descriptions.Item>
              <Descriptions.Item label="Tầng">{selectedRoom.tang}</Descriptions.Item>
              <Descriptions.Item label="Loại phòng">{selectedRoom.loaiPhong}</Descriptions.Item>
              <Descriptions.Item label="Sức chứa">{selectedRoom.sucChua} người</Descriptions.Item>
              <Descriptions.Item label="Giường trống">{selectedRoom.giuongTrong} giường</Descriptions.Item>
              <Descriptions.Item label="Giá thuê" span={2}>
                {selectedRoom.giaThue.toLocaleString()} VNĐ/tháng
              </Descriptions.Item>
            </Descriptions>
            
            <h4>Danh sách giường:</h4>
            <Table 
              columns={bedColumns} 
              dataSource={getBedsForRoom(selectedRoom.maPhong)} 
              rowKey="maGiuong"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienPhong;
