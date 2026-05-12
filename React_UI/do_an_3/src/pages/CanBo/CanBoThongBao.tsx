import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Spin, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import thongBaoService from '../../services/thongBaoService';

const CanBoThongBao: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await thongBaoService.getAll();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe' },
    { 
      title: 'Loại', 
      dataIndex: 'loaiThongBao', 
      key: 'loaiThongBao',
      render: (val: string) => (
        <Tag color={val === 'QuanTrong' ? 'orange' : 'blue'}>
          {val === 'QuanTrong' ? 'Quan trọng' : 'Thông báo'}
        </Tag>
      )
    },
    { 
      title: 'Đối tượng', 
      dataIndex: 'loaiNguoiNhan', 
      key: 'loaiNguoiNhan',
      render: (val: string) => {
        const text = val === 'TatCa' ? 'Tất cả' : val === 'SinhVien' ? 'Sinh viên' : 'Cán bộ';
        return text;
      }
    },
    { title: 'Người gửi', dataIndex: 'tenCanBoGui', key: 'tenCanBoGui' },
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung', ellipsis: true, render: (val: string) => <span title={val}>{val}</span> },
    { title: 'Ngày gửi', dataIndex: 'ngayGui', key: 'ngayGui' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          <Popconfirm
            title="Xóa thông báo này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.maThongBao)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await thongBaoService.delete(id);
      if (response.success) {
        message.success('Xóa thông báo thành công!');
        fetchData();
      } else {
        message.error(response.message || 'Xóa thông báo thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await thongBaoService.create(values);
      if (response.success) {
        message.success('Gửi thông báo thành công!');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(response.message || 'Gửi thông báo thất bại');
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
          Gửi thông báo
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maThongBao" />
      
      <Modal
        title="Gửi thông báo mới"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>
          <Form.Item name="loaiThongBao" label="Loại thông báo" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="ThongBao">Thông báo</Select.Option>
              <Select.Option value="QuanTrong">Quan trọng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="loaiNguoiNhan" label="Đối tượng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="TatCa">Tất cả</Select.Option>
              <Select.Option value="SinhVien">Sinh viên</Select.Option>
              <Select.Option value="CanBo">Cán bộ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <Input.TextArea rows={5} placeholder="Nhập nội dung thông báo" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết thông báo"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <div>
            <h3>{selectedRecord.tieuDe}</h3>
            <p>
              <Tag color={selectedRecord.loaiThongBao === 'QuanTrong' ? 'orange' : 'blue'}>
                {selectedRecord.loaiThongBao === 'QuanTrong' ? 'Quan trọng' : 'Thông báo'}
              </Tag>
            </p>
            <p><strong>Người gửi:</strong> {selectedRecord.tenCanBoGui || '—'}</p>
            <p><strong>Đối tượng:</strong> {selectedRecord.loaiNguoiNhan === 'TatCa' ? 'Tất cả' : selectedRecord.loaiNguoiNhan === 'SinhVien' ? 'Sinh viên' : 'Cán bộ'}</p>
            <p><strong>Ngày gửi:</strong> {selectedRecord.ngayGui}</p>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              marginTop: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedRecord.noiDung}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CanBoThongBao;
