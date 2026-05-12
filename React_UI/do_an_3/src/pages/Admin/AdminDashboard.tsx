import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { UserOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import toaNhaService from '../../services/toaNhaService';
import phongService from '../../services/phongService';
import hoaDonService from '../../services/hoaDonService';
import baoTriService from '../../services/baoTriService';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [toaNhaRes, phongRes, hoaDonRes, baoTriRes] = await Promise.allSettled([
          toaNhaService.getAll(),
          phongService.getAll(),
          hoaDonService.getAll(undefined, 'ChuaThanhToan'),
          baoTriService.getAll(undefined, 'ChoXuLy'),
        ]);
        
        const s: any = {};
        
        if (toaNhaRes.status === 'fulfilled' && toaNhaRes.value.success) {
          s.tongToaNha = toaNhaRes.value.data?.length || 0;
        }
        
        if (phongRes.status === 'fulfilled' && phongRes.value.success) {
          const phongs = phongRes.value.data || [];
          s.tongPhong = phongs.length;
          s.phongTrong = phongs.filter((p: any) => p.trangThai === 'ConTrong').length;
          s.phongDaDung = s.tongPhong - s.phongTrong;
          s.tyLeLapDay = s.tongPhong > 0 ? Math.round((s.phongDaDung / s.tongPhong) * 100) : 0;
        }
        
        if (hoaDonRes.status === 'fulfilled' && hoaDonRes.value.success) {
          s.hoaDonChuaThanhToan = hoaDonRes.value.data?.length || 0;
        }
        
        if (baoTriRes.status === 'fulfilled' && baoTriRes.value.success) {
          s.yeuCauBaoTriChuaXuLy = baoTriRes.value.data?.length || 0;
        }
        
        setStats(s);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (<div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>);
  }

  return (
    <div>
      <Title level={2}>Dashboard - Quản trị viên</Title>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Tổng tòa nhà" value={stats.tongToaNha || 0} prefix={<HomeOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Tổng phòng" value={stats.tongPhong || 0} prefix={<HomeOutlined />} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Phòng đã dùng" value={stats.phongDaDung || 0} prefix={<FileTextOutlined />} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Phòng trống" value={stats.phongTrong || 0} prefix={<UserOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê phòng">
            <p><strong>Phòng trống:</strong> {stats.phongTrong || 0}</p>
            <p><strong>Phòng đã đầy:</strong> {stats.phongDaDung || 0}</p>
            <p><strong>Tỷ lệ lấp đầy:</strong> {stats.tyLeLapDay || 0}%</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động cần xử lý">
            <p>• Hóa đơn chưa thanh toán: {stats.hoaDonChuaThanhToan || 0}</p>
            <p>• Yêu cầu bảo trì chưa xử lý: {stats.yeuCauBaoTriChuaXuLy || 0}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
