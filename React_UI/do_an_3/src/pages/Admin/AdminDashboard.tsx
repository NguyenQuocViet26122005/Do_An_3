import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, HomeOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>Dashboard - Quản trị viên</Title>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sinh viên"
              value={1234}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng phòng"
              value={150}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hợp đồng hiệu lực"
              value={980}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={1234567000}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê phòng">
            <p>Phòng trống: 45</p>
            <p>Phòng đã đầy: 85</p>
            <p>Phòng bảo trì: 20</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây">
            <p>• Sinh viên SV001 đăng ký phòng A101</p>
            <p>• Cán bộ CB001 duyệt đăng ký</p>
            <p>• Tạo hóa đơn tháng 4/2026</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
