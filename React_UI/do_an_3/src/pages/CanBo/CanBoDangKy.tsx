import React, { useState } from 'react';
import { Table, Button, Modal, Tag, Space, message, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const CanBoDangKy: React.FC = () => {
  const [data, setData] = useState([
    { maDangKy: 1, tenSinhVien: 'Phạm Thị Sinh Viên', maSV: 'B20DCCN001', tenPhong: 'A101', tenToaNha: 'Tòa A', ngayDangKy: '2024-03-15', trangThai: 'Chờ duyệt', ghiChu: 'Ưu tiên phòng tầng 1' },
    { maDangKy: 2, tenSinhVien: 'Hoàng Văn Học', maSV: 'B20DCCN002', tenPhong: 'A102', tenToaNha: 'Tòa A', ngayDangKy: '2024-03-14', trangThai: 'Đã duyệt', ghiChu: '' },
    { maDangKy: 3, tenSinhVien: 'Nguyễn Thị Mai', maSV: 'B20DCCN003', tenPhong: 'B201', tenToaNha: 'Tòa B', ngayDangKy: '2024-03-16', trangThai: 'Chờ duyệt', ghiChu: '' },
    { maDangKy: 4, tenSinhVien: 'Trần Văn Nam', maSV: 'B20DCCN004', tenPhong: 'C101', tenToaNha: 'Tòa C', ngayDangKy: '2024-03-13', trangThai: 'Từ chối', ghiChu: 'Không đủ điều kiện' },
  ]);
  const [loading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const columns = [
    { title: 'Mã đăng ký', dataIndex: 'maDangKy', key: 'maDangKy' },
    { title: 'Sinh viên', dataIndex: 'tenSinhVien', key: 'tenSinhVien' },
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Ngày đăng ký', dataIndex: 'ngayDangKy', key: 'ngayDangKy' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (val: string) => (
        <Tag color={val === 'Chờ duyệt' ? 'orange' : val === 'Đã duyệt' ? 'green' : 'red'}>{val}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          {record.trangThai === 'Chờ duyệt' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleApprove(record.maDangKy)}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleReject(record.maDangKy)}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleApprove = async (id: number) => {
    setData(data.map(item => 
      item.maDangKy === id ? { ...item, trangThai: 'Đã duyệt' } : item
    ));
    message.success('Đã duyệt đăng ký!');
  };

  const handleReject = async (id: number) => {
    setData(data.map(item => 
      item.maDangKy === id ? { ...item, trangThai: 'Từ chối' } : item
    ));
    message.success('Đã từ chối đăng ký!');
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="maDangKy" />
      
      <Modal
        title="Chi tiết đăng ký"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đăng ký">{selectedRecord.maDangKy}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedRecord.trangThai === 'Chờ duyệt' ? 'orange' : 'green'}>
                {selectedRecord.trangThai}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
            <Descriptions.Item label="Mã SV">{selectedRecord.maSV}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{selectedRecord.tenPhong}</Descriptions.Item>
            <Descriptions.Item label="Tòa nhà">{selectedRecord.tenToaNha}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">{selectedRecord.ngayDangKy}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>{selectedRecord.ghiChu || 'Không có'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CanBoDangKy;
