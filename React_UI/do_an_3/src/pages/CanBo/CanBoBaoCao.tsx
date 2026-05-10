import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, message, Tabs, Select, DatePicker, Button } from 'antd';
import { 
  UserOutlined, HomeOutlined, DollarOutlined, WarningOutlined, 
  ToolOutlined, FileTextOutlined, CheckCircleOutlined, 
  TeamOutlined, BankOutlined, ThunderboltOutlined, DropboxOutlined
} from '@ant-design/icons';
import phongService from '../../services/phongService';
import toaNhaService from '../../services/toaNhaService';
import sinhVienService from '../../services/sinhVienService';
import hopDongService from '../../services/hopDongService';
import hoaDonService from '../../services/hoaDonService';
import viPhamService from '../../services/viPhamService';
import baoTriService from '../../services/baoTriService';
import dangKyService from '../../services/dangKyService';
import { ToaNha } from '../../services/toaNhaService';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const CanBoBaoCao: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Tòa nhà & Phòng
  const [toaNhas, setToaNhas] = useState<ToaNha[]>([]);
  const [tongPhong, setTongPhong] = useState(0);
  const [phongTrong, setPhongTrong] = useState(0);
  
  // Sinh viên
  const [tongSinhVien, setTongSinhVien] = useState(0);
  const [sinhVienDangO, setSinhVienDangO] = useState(0);
  const [sinhVienTheoToaNha, setSinhVienTheoToaNha] = useState<any[]>([]);
  
  // Hợp đồng
  const [tongHopDong, setTongHopDong] = useState(0);
  const [hopDongHieuLuc, setHopDongHieuLuc] = useState(0);
  
  // Hóa đơn & Doanh thu
  const [tongHoaDon, setTongHoaDon] = useState(0);
  const [hoaDonDaThanhToan, setHoaDonDaThanhToan] = useState(0);
  const [hoaDonChuaThanhToan, setHoaDonChuaThanhToan] = useState(0);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongCongNo, setTongCongNo] = useState(0);
  const [doanhThuTheoThang, setDoanhThuTheoThang] = useState<any[]>([]);
  
  // Vi phạm
  const [tongViPham, setTongViPham] = useState(0);
  const [viPhamChuaXuLy, setViPhamChuaXuLy] = useState(0);
  const [tongTienPhat, setTongTienPhat] = useState(0);
  const [viPhamTheoMucDo, setViPhamTheoMucDo] = useState<any[]>([]);
  
  // Điện nước
  const [tongTienDien, setTongTienDien] = useState(0);
  const [tongTienNuoc, setTongTienNuoc] = useState(0);
  const [dienNuocTheoThang, setDienNuocTheoThang] = useState<any[]>([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      
      const [
        toaNhaRes, phongRes, sinhVienRes, hopDongRes, hoaDonRes, viPhamRes
      ] = await Promise.all([
        toaNhaService.getAll(),
        phongService.getAll(),
        sinhVienService.getAll(),
        hopDongService.getAll(),
        hoaDonService.getAll(),
        viPhamService.getAll(),
      ]);

      // Tòa nhà & Phòng
      if (toaNhaRes.success) {
        setToaNhas(toaNhaRes.data || []);
      }
      if (phongRes.success) {
        const phongs = phongRes.data || [];
        setTongPhong(phongs.length);
        setPhongTrong(phongs.filter((p: any) => p.trangThai === 'ConTrong').length);
      }

      // Sinh viên
      if (sinhVienRes.success) {
        const sinhViens = sinhVienRes.data || [];
        setTongSinhVien(sinhViens.length);
      }

      // Hợp đồng & Sinh viên đang ở
      if (hopDongRes.success) {
        const hopDongs = hopDongRes.data || [];
        setTongHopDong(hopDongs.length);
        const hieuLuc = hopDongs.filter((h: any) => h.trangThai === 'DangHieuLuc');
        setHopDongHieuLuc(hieuLuc.length);
        setSinhVienDangO(hieuLuc.length);
        
        // Thống kê sinh viên theo tòa nhà
        const toaNhaMap: any = {};
        hieuLuc.forEach((hd: any) => {
          const toaNha = hd.tenToaNha || 'Chưa xác định';
          toaNhaMap[toaNha] = (toaNhaMap[toaNha] || 0) + 1;
        });
        const toaNhaStats = Object.keys(toaNhaMap).map(toa => ({
          toaNha: toa,
          soLuong: toaNhaMap[toa]
        }));
        setSinhVienTheoToaNha(toaNhaStats);
      }

      // Hóa đơn & Doanh thu
      if (hoaDonRes.success) {
        const hoaDons = hoaDonRes.data || [];
        setTongHoaDon(hoaDons.length);
        const daThanhToan = hoaDons.filter((h: any) => h.trangThai === 'DaThanhToan');
        const chuaThanhToan = hoaDons.filter((h: any) => h.trangThai === 'ChuaThanhToan');
        setHoaDonDaThanhToan(daThanhToan.length);
        setHoaDonChuaThanhToan(chuaThanhToan.length);
        
        const doanhThu = daThanhToan.reduce((sum: number, h: any) => sum + (h.tongTien || 0), 0);
        const congNo = chuaThanhToan.reduce((sum: number, h: any) => sum + (h.tongTien || 0), 0);
        setTongDoanhThu(doanhThu);
        setTongCongNo(congNo);
        
        // Doanh thu theo tháng
        const thangMap: any = {};
        daThanhToan.forEach((hd: any) => {
          const key = `${hd.thang}/${hd.nam}`;
          thangMap[key] = (thangMap[key] || 0) + (hd.tongTien || 0);
        });
        const thangStats = Object.keys(thangMap).map(thang => ({
          thang,
          doanhThu: thangMap[thang]
        }));
        setDoanhThuTheoThang(thangStats);
        
        // Tổng điện nước
        const tienDien = hoaDons.reduce((sum: number, h: any) => sum + (h.tienDien || 0), 0);
        const tienNuoc = hoaDons.reduce((sum: number, h: any) => sum + (h.tienNuoc || 0), 0);
        setTongTienDien(tienDien);
        setTongTienNuoc(tienNuoc);
        
        // Điện nước theo tháng
        const dienNuocMap: any = {};
        hoaDons.forEach((hd: any) => {
          const key = `${hd.thang}/${hd.nam}`;
          if (!dienNuocMap[key]) {
            dienNuocMap[key] = { thang: key, tienDien: 0, tienNuoc: 0 };
          }
          dienNuocMap[key].tienDien += (hd.tienDien || 0);
          dienNuocMap[key].tienNuoc += (hd.tienNuoc || 0);
        });
        setDienNuocTheoThang(Object.values(dienNuocMap));
      }

      // Vi phạm
      if (viPhamRes.success) {
        const viPhams = viPhamRes.data || [];
        setTongViPham(viPhams.length);
        setViPhamChuaXuLy(viPhams.filter((v: any) => v.trangThai === 'ChuaXuLy').length);
        const tienPhat = viPhams.reduce((sum: number, v: any) => sum + (v.mucPhat || 0), 0);
        setTongTienPhat(tienPhat);
        
        // Vi phạm theo mức độ
        const mucDoMap: any = {};
        viPhams.forEach((vp: any) => {
          const mucDo = vp.mucDo || 'Chưa xác định';
          if (!mucDoMap[mucDo]) {
            mucDoMap[mucDo] = { mucDo, soLuong: 0, tongPhat: 0 };
          }
          mucDoMap[mucDo].soLuong += 1;
          mucDoMap[mucDo].tongPhat += (vp.mucPhat || 0);
        });
        setViPhamTheoMucDo(Object.values(mucDoMap));
      }

    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
      message.error('Có lỗi khi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Column definitions for all tables
  
  // 1. Vi phạm columns
  const viPhamColumns = [
    { title: 'Mức độ', dataIndex: 'mucDo', key: 'mucDo' },
    { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
    { 
      title: 'Tổng tiền phạt', 
      dataIndex: 'tongPhat', 
      key: 'tongPhat',
      render: (value: number) => `${value.toLocaleString()} đ`
    },
  ];

  // 2. Doanh thu columns
  const doanhThuColumns = [
    { title: 'Tháng/Năm', dataIndex: 'thang', key: 'thang' },
    { 
      title: 'Doanh thu', 
      dataIndex: 'doanhThu', 
      key: 'doanhThu',
      render: (value: number) => `${value.toLocaleString()} đ`
    },
  ];

  // 3. Sinh viên theo tòa nhà columns
  const sinhVienToaNhaColumns = [
    { title: 'Tòa nhà', dataIndex: 'toaNha', key: 'toaNha' },
    { title: 'Số lượng sinh viên', dataIndex: 'soLuong', key: 'soLuong' },
  ];

  // 4. Tòa nhà columns (tỷ lệ lấp đầy)
  const toaNhaColumns = [
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

  // 5. Điện nước columns
  const dienNuocColumns = [
    { title: 'Tháng/Năm', dataIndex: 'thang', key: 'thang' },
    { 
      title: 'Tiền điện', 
      dataIndex: 'tienDien', 
      key: 'tienDien',
      render: (value: number) => `${value.toLocaleString()} đ`
    },
    { 
      title: 'Tiền nước', 
      dataIndex: 'tienNuoc', 
      key: 'tienNuoc',
      render: (value: number) => `${value.toLocaleString()} đ`
    },
    { 
      title: 'Tổng', 
      key: 'tong',
      render: (_: any, record: any) => {
        const tong = (record.tienDien || 0) + (record.tienNuoc || 0);
        return `${tong.toLocaleString()} đ`;
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
      <Tabs defaultActiveKey="1">
        {/* TAB 1: BÁO CÁO VI PHẠM */}
        <TabPane 
          tab={
            <span>
              <WarningOutlined />
              Báo cáo vi phạm
            </span>
          } 
          key="1"
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng vi phạm"
                  value={tongViPham}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Vi phạm chưa xử lý"
                  value={viPhamChuaXuLy}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng tiền phạt"
                  value={tongTienPhat}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Thống kê vi phạm theo mức độ">
            <Table 
              columns={viPhamColumns} 
              dataSource={viPhamTheoMucDo} 
              rowKey="mucDo" 
              pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />} style={{ marginRight: 8 }}>
                Xuất Excel
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xuất PDF
              </Button>
            </div>
          </Card>
        </TabPane>

        {/* TAB 2: DOANH THU KTX */}
        <TabPane 
          tab={
            <span>
              <DollarOutlined />
              Doanh thu KTX
            </span>
          } 
          key="2"
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={tongDoanhThu}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Hóa đơn đã thanh toán"
                  value={hoaDonDaThanhToan}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng công nợ"
                  value={tongCongNo}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Doanh thu theo tháng">
            <Table 
              columns={doanhThuColumns} 
              dataSource={doanhThuTheoThang} 
              rowKey="thang" 
              pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />} style={{ marginRight: 8 }}>
                Xuất Excel
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xuất PDF
              </Button>
            </div>
          </Card>
        </TabPane>

        {/* TAB 3: SINH VIÊN CƯ TRÚ */}
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              Sinh viên cư trú
            </span>
          } 
          key="3"
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng sinh viên"
                  value={tongSinhVien}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Sinh viên đang ở"
                  value={sinhVienDangO}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Hợp đồng hiệu lực"
                  value={hopDongHieuLuc}
                  valueStyle={{ color: '#13c2c2' }}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Sinh viên theo tòa nhà" style={{ marginBottom: 16 }}>
            <Table 
              columns={sinhVienToaNhaColumns} 
              dataSource={sinhVienTheoToaNha} 
              rowKey="toaNha" 
              pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />} style={{ marginRight: 8 }}>
                Xuất Excel
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xuất PDF
              </Button>
            </div>
          </Card>

          <Card title="Tỷ lệ lấp đầy theo tòa nhà">
            <Table 
              columns={toaNhaColumns} 
              dataSource={toaNhas} 
              rowKey="maToaNha" 
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* TAB 4: TỔNG ĐIỆN/NƯỚC */}
        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined />
              Tổng điện/nước
            </span>
          } 
          key="4"
        >
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng tiền điện"
                  value={tongTienDien}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ThunderboltOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng tiền nước"
                  value={tongTienNuoc}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<DropboxOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng cộng"
                  value={tongTienDien + tongTienNuoc}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Chi phí điện nước theo tháng">
            <Table 
              columns={dienNuocColumns} 
              dataSource={dienNuocTheoThang} 
              rowKey="thang" 
              pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />} style={{ marginRight: 8 }}>
                Xuất Excel
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xuất PDF
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CanBoBaoCao;
