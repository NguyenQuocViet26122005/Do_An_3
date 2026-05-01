import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, DatePicker, Form, Select, Spin, message } from 'antd';
import { FileTextOutlined, DollarOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import toaNhaService from '../../services/toaNhaService';
import phongService from '../../services/phongService';
import { ToaNha } from '../../services/toaNhaService';

const { RangePicker } = DatePicker;

const AdminBaoCao: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [toaNhas, setToaNhas] = useState<ToaNha[]>([]);
  const [tongPhong, setTongPhong] = useState(0);
  const [phongTrong, setPhongTrong] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      console.error('Lỗi khi tải báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toaNhaColumns = [
    { title: 'Mã tòa', dataIndex: 'maToa', key: 'maToa' },
    { title: 'Tên tòa nhà', dataIndex: 'tenToaNha', key: 'tenToaNha' },
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

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng tòa nhà"
              value={toaNhas.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng phòng"
              value={tongPhong}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Phòng đã thuê"
              value={tongPhong - phongTrong}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Phòng trống"
              value={phongTrong}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Thống kê theo tòa nhà">
        <Table columns={toaNhaColumns} dataSource={toaNhas} rowKey="maToaNha" pagination={false} />
      </Card>
    </div>
  );
};

export default AdminBaoCao;
