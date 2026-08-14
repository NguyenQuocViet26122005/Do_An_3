import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Modal, Descriptions, Table, Spin, Select, InputNumber, Space } from 'antd';
import { HomeOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
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
  const [allRooms, setAllRooms] = useState<PhongWithBeds[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<PhongWithBeds[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PhongWithBeds | null>(null);

  // Bộ lọc
  const [filterToaNha, setFilterToaNha] = useState<string | undefined>(undefined);
  const [filterGiaMax, setFilterGiaMax] = useState<number | undefined>(undefined);

  // Danh sách unique values cho filter
  const [toaNhaList, setToaNhaList] = useState<string[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterToaNha, filterGiaMax, allRooms]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterToaNha, filterGiaMax, allRooms]);

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
        
        setAllRooms(roomsWithBeds);

        // Lấy danh sách unique tòa nhà
        const uniqueToaNha = Array.from(new Set(roomsWithBeds.map((r: PhongWithBeds) => r.tenToaNha)));
        setToaNhaList(uniqueToaNha);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allRooms];

    // Lọc theo tòa nhà (chỉ lọc khi có giá trị)
    if (filterToaNha && filterToaNha !== '') {
      filtered = filtered.filter(room => room.tenToaNha === filterToaNha);
    }

    // Lọc theo giá tối đa (chỉ lọc khi có giá trị và > 0)
    if (filterGiaMax && filterGiaMax > 0) {
      filtered = filtered.filter(room => (room.giaThue || 0) <= filterGiaMax);
    }

    setFilteredRooms(filtered);
  };

  const handleClearFilters = () => {
    setFilterToaNha(undefined);
    setFilterGiaMax(undefined);
  };

  const handleToaNhaChange = (value: string | null) => {
    setFilterToaNha(value || undefined);
  };

  const handleGiaMaxChange = (value: number | null) => {
    setFilterGiaMax(value || undefined);
  };

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
      {/* Bộ lọc */}
      <div style={{ 
        marginBottom: 24, 
        background: '#f5f5f5', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #d9d9d9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <FilterOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '8px' }} />
          <h3 style={{ margin: 0 }}>Bộ lọc</h3>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <div style={{ marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Tòa nhà</div>
            <Select
              placeholder="Chọn tòa nhà"
              style={{ width: '100%' }}
              allowClear
              value={filterToaNha}
              onChange={handleToaNhaChange}
            >
              {toaNhaList.map(toa => (
                <Select.Option key={toa} value={toa}>{toa}</Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <div style={{ marginBottom: '4px', fontWeight: 500, fontSize: '13px' }}>Giá tối đa (VNĐ)</div>
            <InputNumber
              placeholder="VD: 1000000"
              style={{ width: '100%' }}
              min={0}
              step={100000}
              value={filterGiaMax}
              onChange={handleGiaMaxChange}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
        </Row>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={handleClearFilters} size="small">
            Xóa bộ lọc
          </Button>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Tìm thấy <strong style={{ color: '#1890ff' }}>{filteredRooms.length}</strong> phòng
          </div>
        </div>
      </div>

      {/* Danh sách phòng */}
      {filteredRooms.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px', 
          background: '#fafafa', 
          borderRadius: '8px',
          border: '1px dashed #d9d9d9'
        }}>
          <HomeOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
          <h3 style={{ color: '#999' }}>Không tìm thấy phòng phù hợp</h3>
          <p style={{ color: '#999' }}>Thử thay đổi điều kiện lọc để xem thêm kết quả</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredRooms.map((room) => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.maPhong}>
              <Card
                title={
                  <span>
                    <HomeOutlined /> {room.soPhong}
                  </span>
                }
                extra={<Tag color="green">Còn {room.soGiuongTrong || 0} chỗ</Tag>}
                hoverable
              >
                <p><strong>Tòa nhà:</strong> {room.tenToaNha}</p>
                <p><strong>Tầng:</strong> {room.tang}</p>
                <p><strong>Loại:</strong> {room.loaiPhong}</p>
                <p><strong>Sức chứa:</strong> {room.soGiuong} người</p>
                <p><strong>Giá:</strong> <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{room.giaThue?.toLocaleString()}</span> VNĐ/tháng</p>
                <Button type="primary" block onClick={() => handleViewDetail(room)}>
                  <EyeOutlined /> Xem chi tiết
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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
                <span style={{ fontSize: '16px', color: '#f5222d', fontWeight: 'bold' }}>
                  {selectedRoom.giaThue?.toLocaleString()} VNĐ/tháng
                </span>
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
