import React from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Button, Table } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, WarningOutlined, ToolOutlined, FileTextOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/MainLayout';

const CanBoBaoCao: React.FC = () => {
  const stats = [
    { title: 'Tổng sinh viên', value: 245, icon: <UserOutlined />, color: '#1890ff' },
    { title: 'Tổng phòng', value: 80, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Phòng đã thuê', value: 68, icon: <HomeOutlined />, color: '#13c2c2' },
    { title: 'Doanh thu tháng', value: 245000000, prefix: 'VNĐ', icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Vi phạm tháng', value: 12, icon: <WarningOutlined />, color: '#f5222d' },
    { title: 'Yêu cầu bảo trì', value: 8, icon: <ToolOutlined />, color: '#722ed1' },
  ];

  const revenueColumns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Tiền phòng', dataIndex: 'tienPhong', key: 'tienPhong', render: (val: number) => `${val.toLocaleString()} VNĐ` },
    { title: 'Tiền điện', dataIndex: 'tienDien', key: 'tienDien', render: (val: number) => `${val.toLocaleString()} VNĐ` },
    { title: 'Tiền nước', dataIndex: 'tienNuoc', key: 'tienNuoc', render: (val: number) => `${val.toLocaleString()} VNĐ` },
    { title: 'Tổng', dataIndex: 'total', key: 'total', render: (val: number) => `${val.toLocaleString()} VNĐ` },
  ];

  const revenueData = [
    { key: '1', month: '01/2024', tienPhong: 180000000, tienDien: 35000000, tienNuoc: 15000000, total: 230000000 },
    { key: '2', month: '02/2024', tienPhong: 180000000, tienDien: 38000000, tienNuoc: 16000000, total: 234000000 },
    { key: '3', month: '03/2024', tienPhong: 185000000, tienDien: 40000000, tienNuoc: 20000000, total: 245000000 },
  ];

  const occupancyColumns = [
    { title: 'Tòa nhà', dataIndex: 'toaNha', key: 'toaNha' },
    { title: 'Tổng phòng', dataIndex: 'tongPhong', key: 'tongPhong' },
    { title: 'Phòng đã thuê', dataIndex: 'phongDaThue', key: 'phongDaThue' },
    { title: 'Phòng trống', dataIndex: 'phongTrong', key: 'phongTrong' },
    { title: 'Tỷ lệ lấp đầy', dataIndex: 'tyLe', key: 'tyLe', render: (val: number) => `${val}%` },
  ];

  const occupancyData = [
    { key: '1', toaNha: 'Tòa A', tongPhong: 30, phongDaThue: 28, phongTrong: 2, tyLe: 93 },
    { key: '2', toaNha: 'Tòa B', tongPhong: 25, phongDaThue: 20, phongTrong: 5, tyLe: 80 },
    { key: '3', toaNha: 'Tòa C', tongPhong: 25, phongDaThue: 20, phongTrong: 5, tyLe: 80 },
  ];

  return (
    <MainLayout>
      <div>
        <h2 style={{ marginBottom: 24 }}>Báo cáo thống kê</h2>
        
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={8} lg={8} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  valueStyle={{ color: stat.color }}
                  suffix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Card title="Báo cáo doanh thu" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <DatePicker.RangePicker style={{ marginRight: 8 }} />
            <Button type="primary" icon={<FileTextOutlined />}>Xuất báo cáo</Button>
          </div>
          <Table columns={revenueColumns} dataSource={revenueData} pagination={false} />
        </Card>

        <Card title="Báo cáo tỷ lệ lấp đầy" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Select placeholder="Chọn tháng" style={{ width: 200, marginRight: 8 }} defaultValue="03/2024">
              <Select.Option value="01/2024">Tháng 01/2024</Select.Option>
              <Select.Option value="02/2024">Tháng 02/2024</Select.Option>
              <Select.Option value="03/2024">Tháng 03/2024</Select.Option>
            </Select>
            <Button type="primary" icon={<FileTextOutlined />}>Xuất báo cáo</Button>
          </div>
          <Table columns={occupancyColumns} dataSource={occupancyData} pagination={false} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default CanBoBaoCao;
