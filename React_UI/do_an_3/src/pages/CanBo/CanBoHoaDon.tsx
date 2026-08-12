import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions, Spin, Form, Input, InputNumber, Select } from 'antd';
import { EyeOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import hoaDonService from '../../services/hoaDonService';
import hopDongService from '../../services/hopDongService';

const CanBoHoaDon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createTheoPhongVisible, setCreateTheoPhongVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [hoaDonCungPhong, setHoaDonCungPhong] = useState<any[]>([]);
  const [phongs, setPhongs] = useState<any[]>([]);
  const [formPhong] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hoaDonService.getAll();
      if (response.success) setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải hóa đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const hopDongResponse = await hopDongService.getAll();
      
      // Lấy danh sách phòng (từ hợp đồng)
      const phongUnique = new Map();
      hopDongResponse.data?.forEach((hd: any) => {
        if (hd.maPhong && !phongUnique.has(hd.maPhong)) {
          phongUnique.set(hd.maPhong, {
            maPhong: hd.maPhong,
            tenPhong: hd.tenPhong,
            tenToaNha: hd.tenToaNha
          });
        }
      });
      setPhongs(Array.from(phongUnique.values()));
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
    setCreateTheoPhongVisible(true);
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

  const handleView = (record: any) => {
    setSelectedRecord(record);
    
    // Lọc tất cả hóa đơn trong cùng phòng (theo MaPhong), cùng tháng/năm
    const hoaDonCungPhongVaThang = data.filter(hd => 
      hd.maPhong === record.maPhong && 
      hd.thang === record.thang && 
      hd.nam === record.nam
    );
    
    setHoaDonCungPhong(hoaDonCungPhongVaThang);
    setDetailVisible(true);
  };

  const handleConfirmPayment = async (record: any) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: `Xác nhận sinh viên đã thanh toán hóa đơn ${record.soHoaDon}?`,
      onOk: async () => {
        try {
          const response = await hoaDonService.thanhToan(record.maHoaDon, 'Tiền mặt');
          if (response.success) {
            message.success('Xác nhận thanh toán thành công!');
            fetchData();
          }
        } catch {
          message.error('Có lỗi xảy ra');
        }
      }
    });
  };

  const columns = [
    { title: 'Số hóa đơn', dataIndex: 'soHoaDon', key: 'soHoaDon' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Tháng/Năm', key: 'thangNam', render: (_: any, record: any) => `${record.thang}/${record.nam}` },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (val: number) => `${val?.toLocaleString('vi-VN')} VNĐ` },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'DaThanhToan' ? 'green' : 'orange'}>
          {val === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>Chi tiết</Button>
          {record.trangThai === 'ChuaThanhToan' && (
            <Button type="primary" icon={<DollarOutlined />} size="small" onClick={() => handleConfirmPayment(record)}>
              Xác nhận thanh toán
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTheoPhong}>Tạo hóa đơn theo phòng</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maHoaDon" />

      <Modal 
        title={`Chi tiết hóa đơn - ${selectedRecord?.tenToaNha || ''} ${selectedRecord?.tenPhong || ''} (Tháng ${selectedRecord?.thang}/${selectedRecord?.nam})`}
        open={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        footer={null} 
        width={900}
      >
        {selectedRecord && (
          <div>
            {/* Thông tin chung của phòng */}
            <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ marginTop: 0 }}>📍 Thông tin phòng</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div><strong>Tòa nhà - Phòng:</strong> {selectedRecord.tenToaNha} - {selectedRecord.tenPhong}</div>
                <div><strong>Tháng/Năm:</strong> {selectedRecord.thang}/{selectedRecord.nam}</div>
                <div><strong>Tổng sinh viên:</strong> {hoaDonCungPhong.length} người</div>
              </div>
            </div>

            {/* Danh sách hóa đơn từng sinh viên */}
            <h4>👥 Hóa đơn của từng sinh viên:</h4>
            {hoaDonCungPhong.map((hd, index) => (
              <div 
                key={hd.maHoaDon} 
                style={{ 
                  border: hd.maHoaDon === selectedRecord.maHoaDon ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: '12px',
                  background: hd.maHoaDon === selectedRecord.maHoaDon ? '#e6f7ff' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0 }}>
                    {index + 1}. {hd.tenSinhVien} ({hd.maSV})
                    {hd.maHoaDon === selectedRecord.maHoaDon && <span style={{ color: '#1890ff', marginLeft: '8px' }}>← Đang xem</span>}
                  </h4>
                  <Tag color={hd.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>
                    {hd.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </Tag>
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

                {hd.trangThai === 'DaThanhToan' && (
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
                <div><strong>Tổng tiền tất cả SV:</strong> {hoaDonCungPhong.reduce((sum, hd) => sum + hd.tongTien, 0).toLocaleString('vi-VN')} VNĐ</div>
                <div>
                  <strong>Đã thu:</strong> {hoaDonCungPhong.filter(hd => hd.trangThai === 'DaThanhToan').reduce((sum, hd) => sum + hd.tongTien, 0).toLocaleString('vi-VN')} VNĐ
                </div>
                <div><strong>Số SV đã thanh toán:</strong> {hoaDonCungPhong.filter(hd => hd.trangThai === 'DaThanhToan').length}/{hoaDonCungPhong.length}</div>
                <div>
                  <strong>Còn phải thu:</strong> {hoaDonCungPhong.filter(hd => hd.trangThai === 'ChuaThanhToan').reduce((sum, hd) => sum + hd.tongTien, 0).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal tạo hóa đơn theo phòng */}
      <Modal 
        title="🏠 Tạo hóa đơn theo phòng" 
        open={createTheoPhongVisible} 
        onCancel={() => setCreateTheoPhongVisible(false)} 
        onOk={() => formPhong.submit()} 
        width={800}
        okText="Tạo hóa đơn"
        cancelText="Hủy"
      >
        <Form form={formPhong} layout="vertical" onFinish={handleSubmitTheoPhong}>
          <Form.Item name="maPhong" label="Chọn phòng" rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}>
            <Select placeholder="Chọn phòng" showSearch optionFilterProp="children">
              {phongs.map(p => (
                <Select.Option key={p.maPhong} value={p.maPhong}>
                  {p.tenToaNha} - {p.tenPhong}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="thang" label="Tháng" rules={[{ required: true }]}>
              <Select>
                {months.map(m => <Select.Option key={m} value={m}>Tháng {m}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="nam" label="Năm" rules={[{ required: true }]}>
              <Select>
                {years.map(y => <Select.Option key={y} value={y}>Năm {y}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

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
            <strong>💡 Lưu ý:</strong> Hệ thống sẽ tự động tạo hóa đơn cho TẤT CẢ sinh viên trong phòng và chia đều tiền điện/nước theo số người.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CanBoHoaDon;
