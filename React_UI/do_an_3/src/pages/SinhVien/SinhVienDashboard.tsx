import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Descriptions } from 'antd';
import { HomeOutlined, DollarOutlined, WarningOutlined, BellOutlined } from '@ant-design/icons';
import { mockHopDong, mockHoaDon, mockViPham, mockThongBao, mockGiuong } from '../../data/mockData';

const SinhVienDashboard: React.FC = () => {
  // Giả sử sinh viên hiện tại là "Hoàng Văn Học" với mã B20DCCN002
  const currentStudent = 'B20DCCN002';
  
  // Lấy thông tin hợp đồng hiện tại
  const currentContract = mockHopDong.find(h => h.maSV === currentStudent && h.status === 'Đang hiệu lực');
  
  // Lấy thông tin giường của sinh viên
  const currentBed = mockGiuong.find(g => g.maSV === currentStudent);
  
  // Đếm hóa đơn chưa thanh toán (giả sử theo mã hợp đồng)
  const unpaidInvoices = mockHoaDon.filter(h => h.code === currentContract?.code && h.status === 'Chưa thanh toán').length;
  
  // Đếm vi phạm (giả sử theo mã sinh viên)
  const violations = mockViPham.filter(v => v.maSV === currentStudent).length;
  
  // Đếm thông báo chưa đọc
  const unreadNotifications = mockThongBao.filter(t => !t.read).length;

  const stats = [
    { title: 'Phòng hiện tại', value: currentContract?.room || 'Chưa có', icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: unpaidInvoices, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Vi phạm', value: violations, icon: <WarningOutlined />, color: '#f5222d' },
    { title: 'Thông báo mới', value: unreadNotifications, icon: <BellOutlined />, color: '#52c41a' },
  ];

  const recentNotifications = mockThongBao.slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    time: n.date,
    type: n.type === 'important' ? 'warning' : 'info'
  }));

  return (
    <div>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Thông tin phòng">
            {currentContract && currentBed ? (
              <Descriptions column={1}>
                <Descriptions.Item label="Phòng">{currentContract.room}</Descriptions.Item>
                <Descriptions.Item label="Tòa nhà">{currentContract.building}</Descriptions.Item>
                <Descriptions.Item label="Giường">Giường số {currentBed.soGiuong}</Descriptions.Item>
                <Descriptions.Item label="Loại phòng">4 người</Descriptions.Item>
                <Descriptions.Item label="Giá thuê">500,000 VNĐ/tháng</Descriptions.Item>
                <Descriptions.Item label="Hợp đồng">
                  <Tag color="green">{currentContract.status}</Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p>Bạn chưa có phòng. Vui lòng đăng ký phòng.</p>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thông báo mới">
            <List
              dataSource={recentNotifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item.title} description={item.time} />
                  <Tag color={item.type === 'warning' ? 'orange' : 'blue'}>{item.type}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SinhVienDashboard;
