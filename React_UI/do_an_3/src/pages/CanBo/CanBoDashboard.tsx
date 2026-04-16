import React from 'react';
import { Card, Row, Col, Statistic, List, Tag } from 'antd';
import { HomeOutlined, FileTextOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { mockPhong, mockDangKy, mockHoaDon, mockBaoTri } from '../../data/mockData';

const CanBoDashboard: React.FC = () => {
  // Tính toán số liệu từ mock data
  const phongTrong = mockPhong.filter(p => p.trangThai === 'Trống').length;
  const dangKyChoDuyet = mockDangKy.filter(d => d.trangThai === 'Chờ duyệt').length;
  const hoaDonChuaThanhToan = mockHoaDon.filter(h => h.status === 'Chưa thanh toán').length;
  const yeuCauBaoTri = mockBaoTri.filter(b => b.status !== 'Đã hoàn thành').length;

  const stats = [
    { title: 'Phòng trống', value: phongTrong, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Đăng ký chờ duyệt', value: dangKyChoDuyet, icon: <FileTextOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: hoaDonChuaThanhToan, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Yêu cầu bảo trì', value: yeuCauBaoTri, icon: <WarningOutlined />, color: '#f5222d' },
  ];

  const recentActivities = [
    { id: 1, content: 'Sinh viên Phạm Thị Sinh Viên đăng ký phòng A101', time: '10 phút trước', type: 'info' },
    { id: 2, content: 'Hóa đơn HD002 đã được thanh toán', time: '30 phút trước', type: 'success' },
    { id: 3, content: 'Yêu cầu bảo trì phòng A102 - Đèn hỏng', time: '1 giờ trước', type: 'warning' },
    { id: 4, content: 'Đã duyệt đăng ký phòng của Hoàng Văn Học', time: '2 giờ trước', type: 'success' },
    { id: 5, content: 'Tạo hóa đơn tháng 04/2024 cho phòng A101', time: '3 giờ trước', type: 'info' },
  ];

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

      <Card title="Hoạt động gần đây" style={{ marginTop: 16 }}>
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.content}
                description={item.time}
              />
              <Tag color={item.type === 'info' ? 'blue' : item.type === 'success' ? 'green' : 'orange'}>
                {item.type}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CanBoDashboard;
