import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions, Spin, Form, Input, InputNumber, Select } from 'antd';
import { EyeOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import hoaDonService from '../../services/hoaDonService';
import hopDongService from '../../services/hopDongService';
import sinhVienService from '../../services/sinhVienService';

const CanBoHoaDon: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [hopDongs, setHopDongs] = useState<any[]>([]);
  const [sinhViens, setSinhViens] = useState<any[]>([]);
  const [form] = Form.useForm();

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
      const [hopDongResponse, sinhVienResponse] = await Promise.all([
        hopDongService.getAll(),
        sinhVienService.getAll(),
      ]);
      if (hopDongResponse.success) setHopDongs(hopDongResponse.data || []);
      if (sinhVienResponse.success) setSinhViens(sinhVienResponse.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu form:', error);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    // Đặt mặc định tháng và năm hiện tại
    const now = new Date();
    form.setFieldsValue({
      thang: now.getMonth() + 1,
      nam: now.getFullYear(),
    });
    setCreateVisible(true);
  };

  const generateSoHoaDon = (hopDong: any, thang?: number, nam?: number) => {
    const month = thang || new Date().getMonth() + 1;
    const year = nam || new Date().getFullYear();
    // Format: HD + Năm + Tháng + Số hợp đồng
    // Ví dụ: HD202608000006 (Năm 2026, Tháng 08, Hợp đồng 000006)
    const hopDongNumber = String(hopDong.maHopDong).padStart(6, '0');
    return `HD${year}${String(month).padStart(2, '0')}${hopDongNumber}`;
  };

  const handleHopDongChange = (maHopDong: number) => {
    // Tìm hợp đồng được chọn
    const selectedHopDong = hopDongs.find(hd => hd.maHopDong === maHopDong);
    
    console.log('🔍 DEBUG - Selected Hop Dong:', selectedHopDong);
    console.log('🔍 DEBUG - Gia Thue:', selectedHopDong?.giaThue);
    
    if (selectedHopDong) {
      const currentMonth = form.getFieldValue('thang') || new Date().getMonth() + 1;
      const currentYear = form.getFieldValue('nam') || new Date().getFullYear();
      
      // Tự động tạo số hóa đơn
      const soHoaDon = generateSoHoaDon(selectedHopDong, currentMonth, currentYear);
      
      // Tự động điền tất cả thông tin
      form.setFieldsValue({
        soHoaDon: soHoaDon,
        maSinhVien: selectedHopDong.maSinhVien,
        tienPhong: selectedHopDong.giaThue,
        tienDien: 0,
        tienNuoc: 0,
        phiDichVu: 0,
        phiPhat: 0,
      });
      
      console.log('✅ DEBUG - Form values after set:', form.getFieldsValue());
    }
  };

  const handleThangNamChange = () => {
    // Khi thay đổi tháng/năm, cập nhật lại số hóa đơn
    const maHopDong = form.getFieldValue('maHopDong');
    if (maHopDong) {
      const selectedHopDong = hopDongs.find(hd => hd.maHopDong === maHopDong);
      if (selectedHopDong) {
        const thang = form.getFieldValue('thang');
        const nam = form.getFieldValue('nam');
        const soHoaDon = generateSoHoaDon(selectedHopDong, thang, nam);
        form.setFieldsValue({ soHoaDon });
      }
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await hoaDonService.create({
        ...values,
        tienDien: values.tienDien ?? 0,
        tienNuoc: values.tienNuoc ?? 0,
        phiDichVu: values.phiDichVu ?? 0,
        phiPhat: values.phiPhat ?? 0,
      });
      if (response.success) {
        message.success('Tạo hóa đơn thành công!');
        setCreateVisible(false);
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>Tạo hóa đơn</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maHoaDon" />

      <Modal title="Tạo hóa đơn" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()} width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            name="soHoaDon" 
            label={
              <span>
                Số hóa đơn <span style={{ color: '#999', fontSize: '12px' }}>(Tự động tạo)</span>
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn hợp đồng trước' }]}
          >
            <Input disabled placeholder="Sẽ tự động tạo khi chọn hợp đồng" />
          </Form.Item>
          <Form.Item name="maHopDong" label="Hợp đồng" rules={[{ required: true, message: 'Vui lòng chọn hợp đồng' }]}>
            <Select 
              placeholder="Chọn hợp đồng" 
              showSearch 
              optionFilterProp="children"
              onChange={handleHopDongChange}
            >
              {hopDongs.filter(hd => hd.trangThai === 'HieuLuc').map(hd => (
                <Select.Option key={hd.maHopDong} value={hd.maHopDong}>
                  {hd.soHopDong} - {hd.tenSinhVien} - {hd.tenPhong} ({hd.giaThue?.toLocaleString('vi-VN')} VNĐ/tháng)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maSinhVien" label="Sinh viên" rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}>
            <Select placeholder="Tự động điền từ hợp đồng" disabled showSearch optionFilterProp="children">
              {sinhViens.map(sv => <Select.Option key={sv.maSinhVien} value={sv.maSinhVien}>{sv.maSV} - {sv.hoTen}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="thang" label="Tháng" rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}>
            <Select placeholder="Chọn tháng" onChange={handleThangNamChange}>
              {months.map(m => <Select.Option key={m} value={m}>Tháng {m}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="nam" label="Năm" rules={[{ required: true, message: 'Vui lòng chọn năm' }]}>
            <Select placeholder="Chọn năm" onChange={handleThangNamChange}>
              {years.map(y => <Select.Option key={y} value={y}>Năm {y}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item 
            name="tienPhong" 
            label={
              <span>
                Tiền phòng <span style={{ color: '#999', fontSize: '12px' }}>(Tự động từ hợp đồng)</span>
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn hợp đồng trước' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Tự động điền từ hợp đồng"
            />
          </Form.Item>
          <Form.Item name="tienDien" label="Tiền điện">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item name="tienNuoc" label="Tiền nước">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item name="phiDichVu" label="Phí dịch vụ">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item name="phiPhat" label="Phí phạt">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Chi tiết hóa đơn" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hóa đơn" span={2}>{selectedRecord.soHoaDon}</Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Tháng/Năm">{selectedRecord.thang}/{selectedRecord.nam}</Descriptions.Item>
            <Descriptions.Item label="Tiền phòng">{selectedRecord.tienPhong?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền điện">{selectedRecord.tienDien?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tiền nước">{selectedRecord.tienNuoc?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Phí dịch vụ">{selectedRecord.phiDichVu?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}><strong style={{ fontSize: '18px', color: '#f5222d' }}>{selectedRecord.tongTien?.toLocaleString('vi-VN')} VNĐ</strong></Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}><Tag color={selectedRecord.trangThai === 'DaThanhToan' ? 'green' : 'orange'}>{selectedRecord.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag></Descriptions.Item>
            {selectedRecord.trangThai === 'DaThanhToan' && <><Descriptions.Item label="Ngày thanh toán">{selectedRecord.ngayThanhToan}</Descriptions.Item><Descriptions.Item label="Phương thức">{selectedRecord.phuongThucThanhToan}</Descriptions.Item></>}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CanBoHoaDon;
