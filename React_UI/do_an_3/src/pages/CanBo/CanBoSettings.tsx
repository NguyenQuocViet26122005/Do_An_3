import React from 'react';
import { Button, Card, Form, Input, message, Typography } from 'antd';

const { Title, Text } = Typography;

const CanBoSettings: React.FC = () => {
  const onFinish = () => {
    message.info('Chức năng đổi mật khẩu cần API backend để lưu thay đổi.');
  };

  return (
    <div>
      <Title level={2}>Cài đặt</Title>
      <Card title="Đổi mật khẩu">
        <Text type="secondary">Backend chưa có API đổi mật khẩu, form hiện chỉ kiểm tra dữ liệu nhập.</Text>
        <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 480, marginTop: 24 }}>
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CanBoSettings;
