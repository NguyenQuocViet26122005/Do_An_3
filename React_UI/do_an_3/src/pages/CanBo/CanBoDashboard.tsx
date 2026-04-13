import React from 'react';
import { Card, Row, Col, Statistic, List, Tag } from 'antd';
import { HomeOutlined, FileTextOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';

const CanBoDashboard: React.FC = () => {
  const stats = [
    { title: 'Phòng trống', value: 0, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Đăng ký chờ duyệt', value: 0, icon: <FileTextOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: 0, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Yêu cầu bảo trì', value: 0, icon: <WarningOutlined />, color: '#f5222d' },
  ];

  const recentActivities = [
    { id: 1, content: 'Sinh viên SV001 đăng ký phòng A101', time: '10 phút trước', type: 'info' },
    { id: 2, content: 'Hóa đơn HD001 đã được thanh toán', time: '30 phút trước', type: 'success' },
    { id: 3, content: 'Yêu cầu bảo trì phòng B202', time: '1 giờ trước', type: 'warning' },
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
