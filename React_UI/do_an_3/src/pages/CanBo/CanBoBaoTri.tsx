import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Space, Tag, Input } from 'antd';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';

const CanBoBaoTri: React.FC = () => {
  const [data, setData] = useState([
    { maYeuCau: 1, code: 'YC001', tenSinhVien: 'Hoàng Văn Học', tenPhong: 'A102', loaiSuCo: 'Điện', ngayYeuCau: '2024-03-15', trangThai: 'Đang xử lý' },
    { maYeuCau: 2, code: 'YC002', tenSinhVien: 'Phạm Thị Sinh Viên', tenPhong: 'A101', loaiSuCo: 'Nước', ngayYeuCau: '2024-03-14', trangThai: 'Đã hoàn thành' },
    { maYeuCau: 3, code: 'YC003', tenSinhVien: 'Nguyễn Thị Mai', tenPhong: 'B201', loaiSuCo: 'Đồ dùng', ngayYeuCau: '2024-03-16', trangThai: 'Chờ xử lý' },
  ]);
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã yêu cầu', dataIndex: 'maYeuCau', key: 'maYeuCau' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Loại sự cố', dataIndex: 'loaiSuCo', key: 'loaiSuCo' },
    { title: 'Ngày yêu cầu', dataIndex: 'ngayYeuCau', key: 'ngayYeuCau' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Chờ xử lý' ? 'orange' : val === 'Đang xử lý' ? 'blue' : 'green'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>Chi tiết</Button>
          {record.trangThai !== 'Đã hoàn thành' && (
            <Button type="primary" icon={<CheckOutlined />} size="small" onClick={() => handleUpdateStatus(record)}>
              Cập nhật
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (record: any) => {
    const newStatus = record.trangThai === 'Chờ xử lý' ? 'Đang xử lý' : 
                      record.trangThai === 'Đang xử lý' ? 'Đã hoàn thành' : record.trangThai;
    setData(data.map(item => 
      item.maYeuCau === record.maYeuCau ? { ...item, trangThai: newStatus } : item
    ));
    message.success('Cập nhật trạng thái thành công!');
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maYeuCau" />
      
      <Modal
        title="Chi tiết yêu cầu bảo trì"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>Mã yêu cầu:</strong> {selectedRecord.maYeuCau}</p>
            <p><strong>Sinh viên:</strong> {selectedRecord.tenSinhVien}</p>
            <p><strong>Phòng:</strong> {selectedRecord.tenPhong}</p>
            <p><strong>Loại sự cố:</strong> {selectedRecord.loaiSuCo}</p>
            <p><strong>Mô tả:</strong> {selectedRecord.moTa}</p>
            <p><strong>Trạng thái:</strong> <Tag>{selectedRecord.trangThai}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CanBoBaoTri;
