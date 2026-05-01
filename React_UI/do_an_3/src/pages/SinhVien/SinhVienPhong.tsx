import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Modal, Descriptions, Table, Spin } from 'antd';
import { HomeOutlined, EyeOutlined } from '@ant-design/icons';
import phongService from '../../services/phongService';

interface PhongWithBeds {
  maPhong: number;
  soPhong: string;
  tenToaNha: string;
  tang: number;
  loaiPhong: string;
  soGiuong?: number;
  soGiuongTrong?: number;
  giaThue?: number;
  moTa?: string;
  giuongs?: any[];
}

const SinhVienPhong: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState<PhongWithBeds[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PhongWithBeds | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Lấy các phòng còn chỗ trống
        const response = await phongService.getAll(undefined, 'ConTrong');
        if (response.success) {
          const roomsWithBeds = response.data.map((room: any) => ({
            ...room,
            soGiuong: room.sucChua,
            soGiuongTrong: room.sucChua - room.soNguoiHienTai,
            giaThue: room.giaPhong
          }));
          setAvailableRooms(roomsWithBeds);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewDetail = async (room: PhongWithBeds) => {
    try {
      // Lấy chi tiết phòng bao gồm danh sách giường
      const response = await phongService.getById(room.maPhong);
      if (response.success) {
        const roomData = {
          ...response.data,
          soGiuong: response.data.sucChua,
          soGiuongTrong: response.data.sucChua - response.data.soNguoiHienTai,
          giaThue: response.data.giaPhong
        };
        setSelectedRoom(roomData);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết phòng:', error);
    }
  };

  const bedColumns = [
    { title: 'Số giường', dataIndex: 'soGiuong', key: 'soGiuong', width: 100 },
    { 
      title: 'Trạng thái', 
      dataIndex: 'trangThai', 
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'ConTrong' ? 'green' : 'red'}>
          {val === 'ConTrong' ? 'Còn trống' : 'Đang sử dụng'}
        </Tag>
      )
    },
    { 
      title: 'Sinh viên', 
      dataIndex: 'maSinhVien', 
      key: 'maSinhVien',
      render: (val: number) => val ? `SV${val}` : '-'
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {availableRooms.map((room) => (
          <Col span={8} key={room.maPhong}>
            <Card
              title={
                <span>
                  <HomeOutlined /> {room.soPhong}
                </span>
              }
              extra={<Tag color="green">Còn {room.soGiuongTrong || 0} giường trống</Tag>}
            >
              <p><strong>Tòa nhà:</strong> {room.tenToaNha}</p>
              <p><strong>Tầng:</strong> {room.tang}</p>
              <p><strong>Loại:</strong> {room.loaiPhong}</p>
              <p><strong>Sức chứa:</strong> {room.soGiuong} người</p>
              <p><strong>Giá:</strong> {room.giaThue?.toLocaleString()} VNĐ/tháng</p>
              <Button type="primary" block onClick={() => handleViewDetail(room)}>
                <EyeOutlined /> Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Chi tiết phòng ${selectedRoom?.soPhong}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRoom && (
          <>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Số phòng">{selectedRoom.soPhong}</Descriptions.Item>
              <Descriptions.Item label="Tòa nhà">{selectedRoom.tenToaNha}</Descriptions.Item>
              <Descriptions.Item label="Tầng">{selectedRoom.tang}</Descriptions.Item>
              <Descriptions.Item label="Loại phòng">{selectedRoom.loaiPhong}</Descriptions.Item>
              <Descriptions.Item label="Sức chứa">{selectedRoom.soGiuong} người</Descriptions.Item>
              <Descriptions.Item label="Giường trống">{selectedRoom.soGiuongTrong} giường</Descriptions.Item>
              <Descriptions.Item label="Giá thuê" span={2}>
                {selectedRoom.giaThue?.toLocaleString()} VNĐ/tháng
              </Descriptions.Item>
              {selectedRoom.moTa && (
                <Descriptions.Item label="Mô tả" span={2}>{selectedRoom.moTa}</Descriptions.Item>
              )}
            </Descriptions>
            
            <h4>Danh sách giường:</h4>
            <Table 
              columns={bedColumns} 
              dataSource={selectedRoom.giuongs || []} 
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
