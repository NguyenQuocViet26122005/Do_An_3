import React from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Button } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';

const AdminBaoCao: React.FC = () => {

  const stats = [
    { title: 'Tổng sinh viên', value: 0, icon: <UserOutlined />, color: '#1890ff' },
    { title: 'Tổng phòng', value: 0, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Doanh thu tháng', value: 0, prefix: 'VNĐ', icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Vi phạm tháng', value: 0, icon: <WarningOutlined />, color: '#f5222d' },
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
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Báo cáo chi tiết" style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <DatePicker.RangePicker style={{ marginRight: 8 }} />
          <Select placeholder="Loại báo cáo" style={{ width: 200, marginRight: 8 }}>
            <Select.Option value="revenue">Doanh thu</Select.Option>
            <Select.Option value="occupancy">Tỷ lệ lấp đầy</Select.Option>
            <Select.Option value="violations">Vi phạm</Select.Option>
          </Select>
          <Button type="primary">Xuất báo cáo</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminBaoCao;
