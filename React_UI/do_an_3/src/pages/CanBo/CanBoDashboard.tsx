import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Spin, message } from 'antd';
import { HomeOutlined, FileTextOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import phongService from '../../services/phongService';
import dangKyService from '../../services/dangKyService';
import hoaDonService from '../../services/hoaDonService';
import baoTriService from '../../services/baoTriService';

const CanBoDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [phongTrong, setPhongTrong] = useState(0);
  const [dangKyChoDuyet, setDangKyChoDuyet] = useState(0);
  const [hoaDonChuaThanhToan, setHoaDonChuaThanhToan] = useState(0);
  const [yeuCauBaoTri, setYeuCauBaoTri] = useState(0);
  const [tongPhong, setTongPhong] = useState(0);
  const [tongSinhVien, setTongSinhVien] = useState(0);
  const [recentDangKy, setRecentDangKy] = useState<any[]>([]);
  const [recentBaoTri, setRecentBaoTri] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [phongRes, dangKyRes, hoaDonRes, baoTriRes, allPhongRes, allDangKyRes, allBaoTriRes] = await Promise.all([
          phongService.getAll(undefined, 'ConTrong'),
          dangKyService.getAll(undefined, 'ChoDuyet'),
          hoaDonService.getAll(undefined, 'ChuaThanhToan'),
          baoTriService.getAll(undefined, 'ChoDuyet'),
          phongService.getAll(),
          dangKyService.getAll(),
          baoTriService.getAll(),
        ]);

        if (phongRes.success) {
          setPhongTrong(phongRes.data?.length || 0);
        }
        
        if (dangKyRes.success) {
          setDangKyChoDuyet(dangKyRes.data?.length || 0);
        }
        
        if (hoaDonRes.success) {
          setHoaDonChuaThanhToan(hoaDonRes.data?.length || 0);
        }
        
        if (baoTriRes.success) {
          setYeuCauBaoTri(baoTriRes.data?.length || 0);
        }

        if (allPhongRes.success) {
          setTongPhong(allPhongRes.data?.length || 0);
        }

        if (allDangKyRes.success) {
          const recent = (allDangKyRes.data || []).slice(0, 5);
          setRecentDangKy(recent);
        }

        if (allBaoTriRes.success) {
          const recent = (allBaoTriRes.data || []).slice(0, 5);
          setRecentBaoTri(recent);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Có lỗi khi tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Tổng phòng', value: tongPhong, icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Phòng trống', value: phongTrong, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Đăng ký chờ duyệt', value: dangKyChoDuyet, icon: <FileTextOutlined />, color: '#faad14' },
    { title: 'Hóa đơn chưa thanh toán', value: hoaDonChuaThanhToan, icon: <DollarOutlined />, color: '#f5222d' },
    { title: 'Yêu cầu bảo trì', value: yeuCauBaoTri, icon: <WarningOutlined />, color: '#722ed1' },
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
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={8} lg={4} key={index}>
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

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Đăng ký gần đây" extra={<a href="#/canbo/dangky">Xem tất cả</a>}>
            <List
              dataSource={recentDangKy}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.tenSinhVien} - ${item.maSV}`}
                    description={`Phòng ${item.tenPhong} - ${item.tenToaNha}`}
                  />
                  <Tag color={item.trangThai === 'ChoDuyet' ? 'orange' : item.trangThai === 'DaDuyet' ? 'green' : 'red'}>
                    {item.trangThai === 'ChoDuyet' ? 'Chờ duyệt' : item.trangThai === 'DaDuyet' ? 'Đã duyệt' : 'Từ chối'}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Yêu cầu bảo trì gần đây" extra={<a href="#/canbo/baotri">Xem tất cả</a>}>
            <List
              dataSource={recentBaoTri}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.tieuDe}
                    description={`${item.tenSinhVien} - Phòng ${item.tenPhong}`}
                  />
                  <Tag color={item.trangThai === 'ChoDuyet' ? 'orange' : item.trangThai === 'DangXuLy' ? 'blue' : 'green'}>
                    {item.trangThai === 'ChoDuyet' ? 'Chờ duyệt' : item.trangThai === 'DangXuLy' ? 'Đang xử lý' : 'Hoàn thành'}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CanBoDashboard;
