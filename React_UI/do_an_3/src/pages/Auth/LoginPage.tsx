import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import APP_CONFIG from '../../config/appConfig';
import './AuthPages.css';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await authService.login({
        tenDangNhap: values.tenDangNhap,
        matKhau: values.matKhau,
      });

      if (response.success) {
        message.success('Đăng nhập thành công!');
        login(response.data);

        // Navigate based on role
        switch (response.data.vaiTro) {
          case 'Admin':
            navigate('/admin/users');
            break;
          case 'CanBo':
            navigate('/canbo/dashboard');
            break;
          case 'SinhVien':
            navigate('/sinhvien/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        message.error(response.message || 'Đăng nhập thất bại!');
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại! Kiểm tra lại backend.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={2}>{APP_CONFIG.APP_NAME}</Title>
          <Text type="secondary">Đăng nhập vào hệ thống</Text>
        </div>


        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="tenDangNhap"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Text type="secondary">
              Chưa có tài khoản? <a onClick={() => navigate('/register')}>Đăng ký ngay</a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
