import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions, Spin, Form, Input, InputNumber, Select, Alert } from 'antd';
import { EyeOutlined, DollarOutlined, PlusOutlined, FilterOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import hoaDonService, { HoaDonTheoPhong } from '../../services/hoaDonService';
import phongService from '../../services/phongService';
import hopDongService from '../../services/hopDongService';
import viPhamService from '../../services/viPhamService';

const CanBoHoaDon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HoaDonTheoPhong[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createTheoPhongVisible, setCreateTheoPhongVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoaDonTheoPhong | null>(null);
  const [phongs, setPhongs] = useState<any[]>([]);
  const [formPhong] = Form.useForm();
  const [viPhamPreview, setViPhamPreview] = useState<any[]>([]);
  const [loadingViPham, setLoadingViPham] = useState(false);

  // Bộ lọc
  const [filterThang, setFilterThang] = useState<number | undefined>(undefined);
  const [filterNam, setFilterNam] = useState<number | undefined>(undefined);
  const [filterTrangThai, setFilterTrangThai] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, [filterThang, filterNam, filterTrangThai]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hoaDonService.getHoaDonTheoPhong(filterThang, filterNam, filterTrangThai);
      if (response.success) setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải hóa đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      // Lấy danh sách phòng trực tiếp từ API phòng
      const phongResponse = await phongService.getAll();
      
      if (phongResponse.success) {
        const phongList = phongResponse.data.map((p: any) => ({
          maPhong: p.maPhong,
          tenPhong: p.soPhong,
          tenToaNha: p.tenToaNha
        }));
        setPhongs(phongList);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu form:', error);
    }
  };

  const handleCreateTheoPhong = () => {
    formPhong.resetFields();
    const now = new Date();
    formPhong.setFieldsValue({
      thang: now.getMonth() + 1,
      nam: now.getFullYear(),
      giaDien: 3500,
      giaNuoc: 10000,
      phiDichVuMoiNguoi: 30000,
    });
    setViPhamPreview([]);
    setCreateTheoPhongVisible(true);
  };

  // Hàm tải preview vi phạm khi chọn phòng và tháng/năm
  const loadViPhamPreview = async () => {
    const maPhong = formPhong.getFieldValue('maPhong');
    const thang = formPhong.getFieldValue('thang');
    const nam = formPhong.getFieldValue('nam');

    if (!maPhong || !thang || !nam) {
      setViPhamPreview([]);
      return;
    }

    try {
      setLoadingViPham(true);
      
      // 1. Lấy danh sách hợp đồng hiệu lực trong phòng
      const hopDongResponse = await hopDongService.getAll();
      if (!hopDongResponse.success) {
        setViPhamPreview([]);
        return;
      }

      const hopDongsInRoom = hopDongResponse.data.filter(
        (hd: any) => hd.maPhong === maPhong && hd.trangThai === 'HieuLuc'
      );

      if (hopDongsInRoom.length === 0) {
        setViPhamPreview([]);
        return;
      }

      // 2. Lấy vi phạm chưa xử lý của từng sinh viên trong tháng
      const ngayDauThang = new Date(nam, thang - 1, 1);
      const ngayCuoiThang = new Date(nam, thang, 0);

      const viPhamData: any[] = [];

      for (const hopDong of hopDongsInRoom) {
        const viPhamResponse = await viPhamService.getAll(hopDong.maSinhVien, 'ChuaXuLy');
        
        if (viPhamResponse.success && viPhamResponse.data) {
          // Lọc vi phạm trong tháng
          const viPhamTrongThang = viPhamResponse.data.filter((vp: any) => {
            const ngayViPham = new Date(vp.ngayViPham);
            return ngayViPham >= ngayDauThang && ngayViPham <= ngayCuoiThang;
          });

          const tongPhat = viPhamTrongThang.reduce((sum: number, vp: any) => sum + (vp.mucPhat || 0), 0);

          if (viPhamTrongThang.length > 0) {
            viPhamData.push({
              maSinhVien: hopDong.maSinhVien,
              tenSinhVien: hopDong.tenSinhVien,
              maSV: hopDong.maSV,
              soViPham: viPhamTrongThang.length,
              tongPhat: tongPhat,
              chiTiet: viPhamTrongThang
            });
          }
        }
      }

      setViPhamPreview(viPhamData);
    } catch (error) {
      console.error('Lỗi khi tải vi phạm:', error);
      setViPhamPreview([]);
    } finally {
      setLoadingViPham(false);
    }
  };

  // Hàm tải chỉ số điện nước cũ từ hóa đơn tháng trước
  const loadChiSoCu = async () => {
    const maPhong = formPhong.getFieldValue('maPhong');
    const thang = formPhong.getFieldValue('thang');
    const nam = formPhong.getFieldValue('nam');

    if (!maPhong || !thang || !nam) {
      return;
    }

    try {
      // Tính tháng trước
      let thangTruoc = thang - 1;
      let namTruoc = nam;
      
      if (thangTruoc === 0) {
        thangTruoc = 12;
        namTruoc = nam - 1;
      }

      // Lấy hóa đơn theo phòng của tháng trước
      const response = await hoaDonService.getHoaDonTheoPhong(thangTruoc, namTruoc);
      
      if (response.success && response.data) {
        const hoaDonThangTruoc = response.data.find((hd: HoaDonTheoPhong) => hd.maPhong === maPhong);
        
        if (hoaDonThangTruoc && hoaDonThangTruoc.danhSachHoaDon && hoaDonThangTruoc.danhSachHoaDon.length > 0) {
          // Lấy chỉ số mới của hóa đơn đầu tiên (tất cả sinh viên trong phòng có cùng chỉ số)
          const hoaDonDauTien = hoaDonThangTruoc.danhSachHoaDon[0];
          
          if (hoaDonDauTien.chiSoDienMoi !== undefined && hoaDonDauTien.chiSoDienMoi !== null) {
            formPhong.setFieldsValue({
              chiSoDienCu: hoaDonDauTien.chiSoDienMoi
            });
          }
          
          if (hoaDonDauTien.chiSoNuocMoi !== undefined && hoaDonDauTien.chiSoNuocMoi !== null) {
            formPhong.setFieldsValue({
              chiSoNuocCu: hoaDonDauTien.chiSoNuocMoi
            });
          }

          message.success(`✓ Đã tải chỉ số từ tháng ${thangTruoc}/${namTruoc}`);
        } else {
          message.info('Không tìm thấy hóa đơn tháng trước. Vui lòng nhập chỉ số thủ công.');
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải chỉ số cũ:', error);
    }
  };

  // Hàm gộp: load cả vi phạm và chỉ số cũ
  const loadDataPreview = async () => {
    await loadChiSoCu();
    await loadViPhamPreview();
  };

  const handleSubmitTheoPhong = async (values: any) => {
    try {
      const response = await hoaDonService.createTheoPhong(values);
      if (response.success) {
        message.success(response.message || `Đã tạo ${response.data?.length || 0} hóa đơn thành công!`, 5);
        setCreateTheoPhongVisible(false);
        fetchData();
      } else {
        message.error(response.message || 'Tạo hóa đơn thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleView = (record: HoaDonTheoPhong) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleConfirmPaymentCaNhan = async (hoaDon: any) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán cá nhân',
      content: `Xác nhận sinh viên ${hoaDon.tenSinhVien} đã thanh toán hóa đơn ${hoaDon.soHoaDon}?`,
      onOk: async () => {
        try {
          const response = await hoaDonService.thanhToan(hoaDon.maHoaDon, 'Tiền mặt');
          if (response.success) {
            message.success('Xác nhận thanh toán thành công!');
            fetchData();
            // Cập nhật lại modal detail nếu đang mở
            if (selectedRecord) {
              const updatedResponse = await hoaDonService.getHoaDonTheoPhong(selectedRecord.thang, selectedRecord.nam);
              if (updatedResponse.success) {
                const updatedRecord = updatedResponse.data.find((r: HoaDonTheoPhong) => 
                  r.maPhong === selectedRecord.maPhong && 
                  r.thang === selectedRecord.thang && 
                  r.nam === selectedRecord.nam
                );
                if (updatedRecord) setSelectedRecord(updatedRecord);
              }
            }
          }
        } catch {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const handleConfirmPaymentToanBoPhong = async (record: HoaDonTheoPhong) => {
    const soNguoiChuaThanhToan = record.soLuongSinhVien - record.soLuongDaThanhToan;
    
    Modal.confirm({
      title: '💰 Xác nhận thanh toán toàn bộ phòng',
      content: (
        <div>
          <p><strong>Phòng:</strong> {record.tenToaNha} - {record.tenPhong}</p>
          <p><strong>Tháng:</strong> {record.thang}/{record.nam}</p>
          <p><strong>Số sinh viên chưa thanh toán:</strong> <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{soNguoiChuaThanhToan}</span></p>
          <p><strong>Tổng tiền còn lại:</strong> <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{record.tongTienConLai.toLocaleString('vi-VN')} VNĐ</span></p>
          <p style={{ marginTop: '16px', color: '#faad14' }}>⚠️ Tất cả hóa đơn chưa thanh toán trong phòng sẽ được đánh dấu là đã thanh toán.</p>
        </div>
      ),
      okText: 'Xác nhận thanh toán',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await hoaDonService.thanhToanToanBoPhong(record.maPhong, record.thang, record.nam, 'Tiền mặt');
          if (response.success) {
            message.success(response.message || 'Đã thanh toán toàn bộ phòng!');
            setDetailVisible(false);
            fetchData();
          } else {
            message.error(response.message || 'Có lỗi xảy ra');
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
      }
    });
  };

  const columns = [
    { 
      title: 'Tòa nhà - Phòng', 
      key: 'phong',
      render: (_: any, record: HoaDonTheoPhong) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.tenToaNha}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Phòng {record.tenPhong}</div>
        </div>
      ),
      width: 150
    },
    { 
      title: 'Tháng/Năm', 
      key: 'thangNam', 
      render: (_: any, record: HoaDonTheoPhong) => `${record.thang}/${record.nam}`,
      width: 100
    },
    { 
      title: 'Sinh viên', 
      key: 'soLuong',
      render: (_: any, record: HoaDonTheoPhong) => {
        const chuaThanhToan = record.soLuongSinhVien - record.soLuongDaThanhToan;
        const percent = (record.soLuongDaThanhToan / record.soLuongSinhVien) * 100;
        
        return (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              <span style={{ color: '#52c41a' }}>{record.soLuongDaThanhToan}</span>
              <span style={{ color: '#999' }}>/</span>
              <span>{record.soLuongSinhVien}</span>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: percent === 100 ? '#52c41a' : chuaThanhToan > 0 ? '#ff4d4f' : '#999'
            }}>
              {percent === 100 ? '✓ Hoàn thành' : `${chuaThanhToan} người chưa TT`}
            </div>
          </div>
        );
      },
      width: 120
    },
    { 
      title: 'Tổng tiền', 
      key: 'tongTien',
      render: (_: any, record: HoaDonTheoPhong) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{record.tongTienTatCa.toLocaleString('vi-VN')} VNĐ</div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>Đã thu: {record.tongTienDaThu.toLocaleString('vi-VN')}</div>
          {record.tongTienConLai > 0 && (
            <div style={{ fontSize: '12px', color: '#ff4d4f' }}>Còn lại: {record.tongTienConLai.toLocaleString('vi-VN')}</div>
          )}
        </div>
      ),
      width: 180
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'DaThanhToan' ? 'green' : 'orange'} style={{ fontSize: '13px', padding: '4px 12px' }}>
          {val === 'DaThanhToan' ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
        </Tag>
      ),
      width: 140
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: HoaDonTheoPhong) => (
        <Space direction="vertical" size="small">
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)} block>
            Chi tiết
          </Button>
          {record.trangThai === 'ChuaThanhToan' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="small" 
              onClick={() => handleConfirmPaymentToanBoPhong(record)}
              block
            >
              TT toàn phòng
            </Button>
          )}
        </Space>
      ),
      width: 140
    },
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      {/* Bộ lọc */}
      <div style={{ marginBottom: 16, display: 'flex', gap: '12px', alignItems: 'center', background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
        <FilterOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
        <Select
          placeholder="Chọn tháng"
          style={{ width: 150 }}
          allowClear
          value={filterThang}
          onChange={setFilterThang}
        >
          {months.map(m => <Select.Option key={m} value={m}>Tháng {m}</Select.Option>)}
        </Select>
        <Select
          placeholder="Chọn năm"
          style={{ width: 150 }}
          allowClear
          value={filterNam}
          onChange={setFilterNam}
        >
          {years.map(y => <Select.Option key={y} value={y}>{y}</Select.Option>)}
        </Select>
        <Select
          placeholder="Trạng thái"
          style={{ width: 180 }}
          allowClear
          value={filterTrangThai}
          onChange={setFilterTrangThai}
        >
          <Select.Option value="ChuaThanhToan">Chưa thanh toán</Select.Option>
          <Select.Option value="DaThanhToan">Đã thanh toán</Select.Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTheoPhong}>
          Tạo hóa đơn theo phòng
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        rowKey={(record) => `${record.maPhong}_${record.thang}_${record.nam}`}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} phòng` }}
      />

      {/* Modal chi tiết */}
      <Modal 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Chi tiết hóa đơn - {selectedRecord?.tenToaNha || ''} Phòng {selectedRecord?.tenPhong || ''} (Tháng {selectedRecord?.thang}/{selectedRecord?.nam})</span>
            <Tag color={selectedRecord?.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>
              {selectedRecord?.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Tag>
          </div>
        }
        open={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        footer={null} 
        width={1000}
      >
        {selectedRecord && (
          <div>
            {/* Thông tin chung của phòng */}
            <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ marginTop: 0 }}>📍 Thông tin chung</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div><strong>Tòa nhà - Phòng:</strong> {selectedRecord.tenToaNha} - {selectedRecord.tenPhong}</div>
                <div><strong>Tháng/Năm:</strong> {selectedRecord.thang}/{selectedRecord.nam}</div>
                <div><strong>Tổng sinh viên:</strong> {selectedRecord.soLuongSinhVien} người</div>
                <div><strong>Đã thanh toán:</strong> <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{selectedRecord.soLuongDaThanhToan}</span> / {selectedRecord.soLuongSinhVien}</div>
              </div>
            </div>

            {/* Danh sách hóa đơn từng sinh viên */}
            <h4>👥 Hóa đơn của từng sinh viên:</h4>
            {selectedRecord.danhSachHoaDon.map((hd, index) => (
              <div 
                key={hd.maHoaDon} 
                style={{ 
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: '12px',
                  background: hd.trangThai === 'DaThanhToan' ? '#f6ffed' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0 }}>
                    {index + 1}. {hd.tenSinhVien} ({hd.maSV})
                  </h4>
                  <Space>
                    <Tag color={hd.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>
                      {hd.trangThai === 'DaThanhToan' ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                    </Tag>
                    {hd.trangThai === 'ChuaThanhToan' && (
                      <Button 
                        type="primary" 
                        size="small" 
                        icon={<DollarOutlined />}
                        onClick={() => handleConfirmPaymentCaNhan(hd)}
                      >
                        Xác nhận TT
                      </Button>
                    )}
                  </Space>
                </div>
                
                <Descriptions size="small" column={3} bordered>
                  <Descriptions.Item label="Số HĐ" span={3}>{hd.soHoaDon}</Descriptions.Item>
                  <Descriptions.Item label="Tiền phòng">{hd.tienPhong?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Tiền điện">{hd.tienDien?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Tiền nước">{hd.tienNuoc?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Phí dịch vụ">{hd.phiDichVu?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Phí phạt">{hd.phiPhat?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Tổng cộng">
                    <strong style={{ fontSize: '16px', color: '#f5222d' }}>
                      {hd.tongTien?.toLocaleString('vi-VN')} VNĐ
                    </strong>
                  </Descriptions.Item>
                </Descriptions>

                {hd.trangThai === 'DaThanhToan' && hd.ngayThanhToan && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#52c41a' }}>
                    ✓ Đã thanh toán: {new Date(hd.ngayThanhToan).toLocaleDateString('vi-VN')} - {hd.phuongThucThanhToan}
                  </div>
                )}
              </div>
            ))}

            {/* Tổng kết */}
            <div style={{ background: '#fff7e6', padding: '12px', borderRadius: '8px', border: '1px solid #ffd666' }}>
              <h4 style={{ marginTop: 0 }}>💰 Tổng kết {selectedRecord.tenToaNha} - Phòng {selectedRecord.tenPhong}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><strong>Tổng tiền tất cả SV:</strong> {selectedRecord.tongTienTatCa.toLocaleString('vi-VN')} VNĐ</div>
                <div>
                  <strong>Đã thu:</strong> <span style={{ color: '#52c41a' }}>{selectedRecord.tongTienDaThu.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div><strong>Số SV đã thanh toán:</strong> {selectedRecord.soLuongDaThanhToan}/{selectedRecord.soLuongSinhVien}</div>
                <div>
                  <strong>Còn phải thu:</strong> <span style={{ color: '#ff4d4f' }}>{selectedRecord.tongTienConLai.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            </div>

            {/* Nút thanh toán toàn bộ phòng */}
            {selectedRecord.trangThai === 'ChuaThanhToan' && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  danger
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleConfirmPaymentToanBoPhong(selectedRecord)}
                >
                  Xác nhận thanh toán toàn bộ phòng ({selectedRecord.soLuongSinhVien - selectedRecord.soLuongDaThanhToan} người chưa TT)
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal tạo hóa đơn theo phòng */}
      <Modal 
        title="🏠 Tạo hóa đơn theo phòng" 
        open={createTheoPhongVisible} 
        onCancel={() => setCreateTheoPhongVisible(false)} 
        onOk={() => formPhong.submit()} 
        width={900}
        okText="Tạo hóa đơn"
        cancelText="Hủy"
      >
        <Form form={formPhong} layout="vertical" onFinish={handleSubmitTheoPhong}>
          <Form.Item name="maPhong" label="Chọn phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}>
            <Select 
              placeholder="Chọn phòng" 
              showSearch 
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              onChange={loadDataPreview}
            >
              {phongs.map(p => (
                <Select.Option key={p.maPhong} value={p.maPhong}>
                  {p.tenToaNha} - {p.tenPhong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="thang" label="Tháng" rules={[{ required: true }]}>
              <Select onChange={loadDataPreview}>
                {months.map(m => <Select.Option key={m} value={m}>Tháng {m}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="nam" label="Năm" rules={[{ required: true }]}>
              <Select onChange={loadDataPreview}>
                {years.map(y => <Select.Option key={y} value={y}>Năm {y}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          {/* HIỂN THỊ THÔNG BÁO VI PHẠM */}
          {loadingViPham && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin /> <span style={{ marginLeft: '10px' }}>Đang kiểm tra vi phạm...</span>
            </div>
          )}

          {!loadingViPham && viPhamPreview.length > 0 && (
            <Alert
              message="⚠️ Phát hiện vi phạm chưa xử lý"
              description={
                <div>
                  <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                    Tiền phạt vi phạm sẽ được TỰ ĐỘNG cộng vào hóa đơn RIÊNG của từng sinh viên bị phạt:
                  </p>
                  {viPhamPreview.map((vp, index) => (
                    <div 
                      key={vp.maSinhVien} 
                      style={{ 
                        background: '#fff', 
                        padding: '8px 12px', 
                        marginBottom: '8px', 
                        borderRadius: '6px',
                        border: '1px solid #ffa39e'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{index + 1}. {vp.tenSinhVien}</strong> ({vp.maSV})
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                            {vp.soViPham} vi phạm chưa xử lý
                          </div>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>
                          +{vp.tongPhat.toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>
                      
                      {/* Chi tiết vi phạm */}
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                        {vp.chiTiet.map((ct: any, idx: number) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                            • {ct.tenViPham} ({new Date(ct.ngayViPham).toLocaleDateString('vi-VN')}) - {ct.mucPhat.toLocaleString('vi-VN')} VNĐ
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px 12px', 
                    background: '#fff2e8', 
                    borderRadius: '6px',
                    border: '1px solid #ffbb96'
                  }}>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                      💡 <strong>Lưu ý:</strong> Tiền phạt chỉ cộng vào hóa đơn của sinh viên BỊ PHẠT, không chia đều cho cả phòng.
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      Sinh viên khác trong phòng không bị ảnh hưởng bởi vi phạm này.
                    </div>
                  </div>
                </div>
              }
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginBottom: '16px' }}
            />
          )}

          {!loadingViPham && viPhamPreview.length === 0 && formPhong.getFieldValue('maPhong') && formPhong.getFieldValue('thang') && formPhong.getFieldValue('nam') && (
            <Alert
              message="✓ Không có vi phạm chưa xử lý"
              description="Không có sinh viên nào có vi phạm chưa xử lý trong tháng này."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <h4 style={{ marginTop: 0 }}>⚡ Chỉ số điện</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Form.Item name="chiSoDienCu" label="Chỉ số cũ (kWh)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="120" />
              </Form.Item>
              <Form.Item name="chiSoDienMoi" label="Chỉ số mới (kWh)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="150" />
              </Form.Item>
              <Form.Item name="giaDien" label="Giá điện (VNĐ/kWh)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <Form.Item noStyle shouldUpdate>
              {() => {
                const cu = formPhong.getFieldValue('chiSoDienCu') || 0;
                const moi = formPhong.getFieldValue('chiSoDienMoi') || 0;
                const gia = formPhong.getFieldValue('giaDien') || 3500;
                const tieu = moi - cu;
                const tong = tieu * gia;
                return tieu >= 0 && (
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Tiêu thụ: <strong>{tieu} kWh</strong> × {gia.toLocaleString()} = <strong style={{ color: '#1890ff' }}>{tong.toLocaleString()} VNĐ</strong> (sẽ chia đều cho sinh viên)
                  </div>
                );
              }}
            </Form.Item>
          </div>

          <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <h4 style={{ marginTop: 0 }}>💧 Chỉ số nước</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Form.Item name="chiSoNuocCu" label="Chỉ số cũ (m³)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="30" />
              </Form.Item>
              <Form.Item name="chiSoNuocMoi" label="Chỉ số mới (m³)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="39" />
              </Form.Item>
              <Form.Item name="giaNuoc" label="Giá nước (VNĐ/m³)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <Form.Item noStyle shouldUpdate>
              {() => {
                const cu = formPhong.getFieldValue('chiSoNuocCu') || 0;
                const moi = formPhong.getFieldValue('chiSoNuocMoi') || 0;
                const gia = formPhong.getFieldValue('giaNuoc') || 10000;
                const tieu = moi - cu;
                const tong = tieu * gia;
                return tieu >= 0 && (
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Tiêu thụ: <strong>{tieu} m³</strong> × {gia.toLocaleString()} = <strong style={{ color: '#1890ff' }}>{tong.toLocaleString()} VNĐ</strong> (sẽ chia đều cho sinh viên)
                  </div>
                );
              }}
            </Form.Item>
          </div>

          <Form.Item name="phiDichVuMoiNguoi" label="Phí dịch vụ (mỗi người/tháng)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" />
          </Form.Item>

          <div style={{ background: '#e6f7ff', padding: '12px', borderRadius: '8px', border: '1px solid #91d5ff' }}>
            <strong>💡 Lưu ý:</strong>
            <ul style={{ marginBottom: 0, marginTop: '8px', paddingLeft: '20px' }}>
              <li>Hệ thống sẽ tự động tạo hóa đơn cho TẤT CẢ sinh viên trong phòng</li>
              <li>Tiền điện/nước sẽ được chia đều theo số người</li>
              <li><strong style={{ color: '#ff4d4f' }}>Tiền phạt vi phạm "Chưa xử lý" sẽ được TỰ ĐỘNG cộng vào hóa đơn</strong></li>
              <li>Khi cán bộ đánh dấu vi phạm là "Đã xử lý", tiền phạt sẽ không cộng vào hóa đơn tháng sau</li>
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoHoaDon;
