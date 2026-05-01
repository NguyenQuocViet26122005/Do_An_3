import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Tag, Spin, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import viPhamService from '../../services/viPhamService';
import sinhVienService from '../../services/sinhVienService';

const CanBoViPham: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [sinhViens, setSinhViens] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchSinhViens();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await viPhamService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải vi phạm:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinhViens = async () => {
    try {
      const response = await sinhVienService.getAll();
      if (response.success) {
        setSinhViens(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải sinh viên:', error);
    }
  };

  const columns = [
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Tên vi phạm', dataIndex: 'tenViPham', key: 'tenViPham' },
    { 
      title: 'Mức độ', 
      dataIndex: 'mucDo', 
      key: 'mucDo',
      render: (val: string) => {
        const color = val === 'Nhe' ? 'green' : val === 'TrungBinh' ? 'orange' : 'red';
        const text = val === 'Nhe' ? 'Nhẹ' : val === 'TrungBinh' ? 'Trung bình' : 'Nặng';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: 'Ngày vi phạm', dataIndex: 'ngayViPham', key: 'ngayViPham' },
    { 
      title: 'Tiền phạt', 
      dataIndex: 'mucPhat', 
      key: 'mucPhat', 
      render: (val: number) => `${val?.toLocaleString('vi-VN')} VNĐ` 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'DaXuLy' ? 'green' : 'orange'}>
          {val === 'DaXuLy' ? 'Đã xử lý' : 'Chờ duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await viPhamService.create(values);
      if (response.success) {
        message.success('Thêm vi phạm thành công!');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(response.message || 'Thêm vi phạm thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm vi phạm
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maViPham" />
      
      <Modal
        title="Thêm vi phạm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="maSinhVien" label="Sinh viên" rules={[{ required: true, message: 'Vui lòng chọn sinh viên!' }]}>
            <Select placeholder="Chọn sinh viên">
              {sinhViens.map(sv => (
                <Select.Option key={sv.maSinhVien} value={sv.maSinhVien}>
                  {sv.maSV} - {sv.hoTen}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tenViPham" label="Tên vi phạm" rules={[{ required: true, message: 'Vui lòng nhập tên vi phạm!' }]}>
            <Input placeholder="Ví dụ: Gây ồn, về muộn..." />
          </Form.Item>
          <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}>
            <Select>
              <Select.Option value="Nhe">Nhẹ</Select.Option>
              <Select.Option value="TrungBinh">Trung bình</Select.Option>
              <Select.Option value="Nang">Nặng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="mucPhat" label="Tiền phạt (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập tiền phạt!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết vi phạm..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết vi phạm"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Tên vi phạm" span={2}>{selectedRecord.tenViPham}</Descriptions.Item>
            <Descriptions.Item label="Mức độ">
              <Tag color={selectedRecord.mucDo === 'Nhe' ? 'green' : selectedRecord.mucDo === 'TrungBinh' ? 'orange' : 'red'}>
                {selectedRecord.mucDo === 'Nhe' ? 'Nhẹ' : selectedRecord.mucDo === 'TrungBinh' ? 'Trung bình' : 'Nặng'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tiền phạt">
              <strong style={{ color: '#f5222d', fontSize: '16px' }}>
                {selectedRecord.mucPhat?.toLocaleString('vi-VN')} VNĐ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày vi phạm">{selectedRecord.ngayViPham}</Descriptions.Item>
            <Descriptions.Item label="Ngày ghi nhận">{selectedRecord.ngayGhi}</Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>{selectedRecord.moTa}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedRecord.trangThai === 'DaXuLy' ? 'green' : 'orange'}>
                {selectedRecord.trangThai === 'DaXuLy' ? 'Đã xử lý' : 'Chờ duyệt'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CanBoViPham;
