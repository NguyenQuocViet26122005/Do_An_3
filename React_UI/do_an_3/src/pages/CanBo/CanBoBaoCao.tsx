import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Button, Table, Spin, message } from 'antd';
import { UserOutlined, HomeOutlined, DollarOutlined, WarningOutlined, ToolOutlined, FileTextOutlined } from '@ant-design/icons';
import phongService from '../../services/phongService';
import toaNhaService from '../../services/toaNhaService';
import { ToaNha } from '../../services/toaNhaService';

const CanBoBaoCao: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [toaNhas, setToaNhas] = useState<ToaNha[]>([]);
  const [tongPhong, setTongPhong] = useState(0);
  const [phongTrong, setPhongTrong] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [toaNhaRes, phongRes] = await Promise.allSettled([
          toaNhaService.getAll(),
          phongService.getAll(),
        ]);

        if (toaNhaRes.status === 'fulfilled' && toaNhaRes.value.success) {
          setToaNhas(toaNhaRes.value.data || []);
        }
        if (phongRes.status === 'fulfilled' && phongRes.value.success) {
          const phongs = phongRes.value.data || [];
          setTongPhong(phongs.length);
          setPhongTrong(phongs.filter((p: any) => p.trangThai === 'ConTrong').length);
        }
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const occupancyColumns = [
    { title: 'Tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
    { title: 'Tổng phòng', dataIndex: 'tongSoPhong', key: 'tongSoPhong' },
    { title: 'Phòng trống', dataIndex: 'soPhongTrong', key: 'soPhongTrong' },
    { 
      title: 'Tỷ lệ lấp đầy', 
      key: 'tyLe', 
      render: (_: any, record: ToaNha) => {
        const total = record.tongSoPhong || 0;
        const empty = record.soPhongTrong || 0;
        const rate = total > 0 ? Math.round(((total - empty) / total) * 100) : 0;
        return `${rate}%`;
      }
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statsDisplay = [
    { title: 'Tổng tòa nhà', value: toaNhas.length, icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Tổng phòng', value: tongPhong, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Phòng đã thuê', value: tongPhong - phongTrong, icon: <HomeOutlined />, color: '#13c2c2' },
    { title: 'Phòng trống', value: phongTrong, icon: <HomeOutlined />, color: '#faad14' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Báo cáo thống kê</h2>
      
      <Row gutter={[16, 16]}>
        {statsDisplay.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
                suffix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Báo cáo tỷ lệ lấp đầy theo tòa nhà" style={{ marginTop: 24 }}>
        <Table columns={occupancyColumns} dataSource={toaNhas} rowKey="maToaNha" pagination={false} />
      </Card>
    </div>
  );
};

export default CanBoBaoCao;
