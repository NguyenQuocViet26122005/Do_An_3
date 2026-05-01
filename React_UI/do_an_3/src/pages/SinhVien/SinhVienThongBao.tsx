import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Modal, Typography, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import thongBaoService from '../../services/thongBaoService';

const { Paragraph } = Typography;

const SinhVienThongBao: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await thongBaoService.getAll('SinhVien');
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (notification: any) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    // Đánh dấu đã đọc
    if (!notification.daDoc) {
      await thongBaoService.danhDauDaDoc(notification.maThongBao);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.maThongBao === notification.maThongBao ? { ...n, daDoc: true } : n)
      );
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
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <Card
            style={{ 
              marginBottom: 16, 
              cursor: 'pointer', 
              backgroundColor: item.daDoc ? '#fff' : '#f0f5ff',
              borderLeft: item.loaiThongBao === 'QuanTrong' ? '4px solid #f5222d' : '4px solid #1890ff'
            }}
            onClick={() => handleView(item)}
          >
            <List.Item>
              <List.Item.Meta
                avatar={
                  <BellOutlined 
                    style={{ 
                      fontSize: 24, 
                      color: item.loaiThongBao === 'QuanTrong' ? '#f5222d' : '#1890ff' 
                    }} 
                  />
                }
                title={
                  <span>
                    {item.tieuDe}
                    {!item.daDoc && <Tag color="red" style={{ marginLeft: 8 }}>Mới</Tag>}
                    {item.loaiThongBao === 'QuanTrong' && (
                      <Tag color="orange" style={{ marginLeft: 8 }}>Quan trọng</Tag>
                    )}
                  </span>
                }
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                      {item.noiDung}
                    </Paragraph>
                    <span style={{ color: '#999' }}>Ngày gửi: {item.ngayGui}</span>
                  </>
                }
              />
            </List.Item>
          </Card>
        )}
      />

      <Modal
        title={
          <span>
            {selectedNotification?.tieuDe}
            {selectedNotification?.loaiThongBao === 'QuanTrong' && (
              <Tag color="orange" style={{ marginLeft: 8 }}>Quan trọng</Tag>
            )}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedNotification && (
          <div>
            <p><strong>Ngày gửi:</strong> {selectedNotification.ngayGui}</p>
            {selectedNotification.daDoc && selectedNotification.ngayDoc && (
              <p><strong>Ngày đọc:</strong> {selectedNotification.ngayDoc}</p>
            )}
            <p><strong>Nội dung:</strong></p>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedNotification.noiDung}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienThongBao;
