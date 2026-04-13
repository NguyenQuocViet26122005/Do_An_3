import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Descriptions } from 'antd';
import { HomeOutlined, DollarOutlined, WarningOutlined, BellOutlined } from '@ant-design/icons';

const SinhVienDashboard: React.FC = () => {
  const stats = [
    { title: 'Phòng hiện tại', value: 'A101', icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: 0, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Vi phạm', value: 0, icon: <WarningOutlined />, color: '#f5222d' },
    { title: 'Thông báo mới', value: 0, icon: <BellOutlined />, color: '#52c41a' },
  ];

  const recentNotifications = [
    { id: 1, title: 'Thông báo đóng tiền phòng tháng 3', time: '1 ngày trước', type: 'warning' },
    { id: 2, title: 'Lịch kiểm tra phòng định kỳ', time: '2 ngày trước', type: 'info' },
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

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Thông tin phòng">
            <Descriptions column={1}>
              <Descriptions.Item label="Phòng">A101</Descriptions.Item>
              <Descriptions.Item label="Tòa nhà">Tòa A</Descriptions.Item>
              <Descriptions.Item label="Loại phòng">4 người</Descriptions.Item>
              <Descriptions.Item label="Giá thuê">500,000 VNĐ/tháng</Descriptions.Item>
            </Descriptions>
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
