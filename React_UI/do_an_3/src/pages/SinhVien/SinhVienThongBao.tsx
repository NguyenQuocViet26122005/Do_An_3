import React, { useState } from 'react';
import { List, Card, Tag, Modal, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

const SinhVienThongBao: React.FC = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Thông báo đóng tiền phòng tháng 3',
      content: 'Sinh viên vui lòng đóng tiền phòng tháng 3 trước ngày 10/03/2024.',
      date: '2024-03-01',
      type: 'important',
      read: false,
    },
    {
      id: 2,
      title: 'Lịch kiểm tra phòng định kỳ',
      content: 'Kiểm tra phòng định kỳ sẽ diễn ra vào ngày 15/03/2024.',
      date: '2024-02-28',
      type: 'info',
      read: true,
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const handleView = (notification: any) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  return (
    <div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <Card
            style={{ marginBottom: 16, cursor: 'pointer', backgroundColor: item.read ? '#fff' : '#f0f5ff' }}
            onClick={() => handleView(item)}
          >
            <List.Item>
              <List.Item.Meta
                avatar={<BellOutlined style={{ fontSize: 24, color: item.type === 'important' ? '#f5222d' : '#1890ff' }} />}
                title={
                  <span>
                    {item.title}
                    {!item.read && <Tag color="red" style={{ marginLeft: 8 }}>Mới</Tag>}
                  </span>
                }
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                    <span style={{ color: '#999' }}>{item.date}</span>
                  </>
                }
              />
            </List.Item>
          </Card>
        )}
      />

      <Modal
        title={selectedNotification?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedNotification && (
          <div>
            <p><strong>Ngày gửi:</strong> {selectedNotification.date}</p>
            <p><strong>Nội dung:</strong></p>
            <p>{selectedNotification.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SinhVienThongBao;
