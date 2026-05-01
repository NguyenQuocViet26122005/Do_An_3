import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Descriptions, Spin } from 'antd';
import { HomeOutlined, DollarOutlined, WarningOutlined, BellOutlined } from '@ant-design/icons';
import hopDongService from '../../services/hopDongService';
import hoaDonService from '../../services/hoaDonService';
import viPhamService from '../../services/viPhamService';
import thongBaoService from '../../services/thongBaoService';
import { useAuth } from '../../contexts/AuthContext';

const SinhVienDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentContract, setCurrentContract] = useState<any>(null);
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);
  const [violations, setViolations] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [hopDongRes, hoaDonRes, viPhamRes, thongBaoRes] = await Promise.allSettled([
          hopDongService.getAll(undefined, 'HieuLuc'),
          hoaDonService.getAll(undefined, 'ChuaThanhToan'),
          viPhamService.getAll(),
          thongBaoService.getAll(),
        ]);

        if (hopDongRes.status === 'fulfilled' && hopDongRes.value.success && hopDongRes.value.data?.length > 0) {
          setCurrentContract(hopDongRes.value.data[0]);
        }
        if (hoaDonRes.status === 'fulfilled' && hoaDonRes.value.success) {
          setUnpaidInvoices(hoaDonRes.value.data?.length || 0);
        }
        if (viPhamRes.status === 'fulfilled' && viPhamRes.value.success) {
          setViolations(viPhamRes.value.data?.length || 0);
        }
        if (thongBaoRes.status === 'fulfilled' && thongBaoRes.value.success) {
          const data = thongBaoRes.value.data || [];
          const unread = data.filter((tb: any) => !tb.daDoc);
          setUnreadNotifications(unread.length);
          setRecentNotifications(data.slice(0, 3));
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
    { title: 'Phòng hiện tại', value: currentContract?.tenPhong || 'Chưa có', icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Hóa đơn chưa thanh toán', value: unpaidInvoices, icon: <DollarOutlined />, color: '#faad14' },
    { title: 'Vi phạm', value: violations, icon: <WarningOutlined />, color: '#f5222d' },
    { title: 'Thông báo mới', value: unreadNotifications, icon: <BellOutlined />, color: '#52c41a' },
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

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Thông tin phòng">
            {currentContract ? (
              <Descriptions column={1}>
                <Descriptions.Item label="Phòng">{currentContract.tenPhong}</Descriptions.Item>
                <Descriptions.Item label="Số hợp đồng">{currentContract.soHopDong}</Descriptions.Item>
                <Descriptions.Item label="Giường">Giường số {currentContract.soGiuong}</Descriptions.Item>
                <Descriptions.Item label="Giá thuê">
                  {currentContract.giaThue?.toLocaleString('vi-VN')} VNĐ/tháng
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">{currentContract.ngayBatDau}</Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">{currentContract.ngayKetThuc}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color="green">{currentContract.trangThai}</Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p>Bạn chưa có phòng. Vui lòng đăng ký phòng.</p>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thông báo mới">
            <List
              dataSource={recentNotifications}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta 
                    title={item.tieuDe} 
                    description={item.ngayGui} 
                  />
                  <Tag color={item.loaiThongBao === 'QuanTrong' ? 'orange' : 'blue'}>
                    {item.loaiThongBao || 'Thông báo'}
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

export default SinhVienDashboard;
