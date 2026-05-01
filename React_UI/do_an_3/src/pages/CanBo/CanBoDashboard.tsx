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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [phongRes, dangKyRes, hoaDonRes, baoTriRes] = await Promise.allSettled([
          phongService.getAll(undefined, 'ConTrong'),
          dangKyService.getAll(undefined, 'ChoDuyet'),
          hoaDonService.getAll(undefined, 'ChuaThanhToan'),
          baoTriService.getAll(undefined, 'ChoDuyet'),
        ]);

        if (phongRes.status === 'fulfilled' && phongRes.value.success) {
          setPhongTrong(phongRes.value.data?.length || 0);
        }
        if (dangKyRes.status === 'fulfilled' && dangKyRes.value.success) {
          setDangKyChoDuyet(dangKyRes.value.data?.length || 0);
        }
        if (hoaDonRes.status === 'fulfilled' && hoaDonRes.value.success) {
          setHoaDonChuaThanhToan(hoaDonRes.value.data?.length || 0);
        }
        if (baoTriRes.status === 'fulfilled' && baoTriRes.value.success) {
          setYeuCauBaoTri(baoTriRes.value.data?.length || 0);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Phòng trống', value: phongTrong, icon: <HomeOutlined />, color: '#52c41a' },
    { title: 'Đăng ký chờ duyệt', value: dangKyChoDuyet, icon: <FileTextOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: hoaDonChuaThanhToan, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Yêu cầu bảo trì', value: yeuCauBaoTri, icon: <WarningOutlined />, color: '#f5222d' },
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
    </div>
  );
};

export default CanBoDashboard;
