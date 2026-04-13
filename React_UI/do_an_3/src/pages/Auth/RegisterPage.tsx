import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Select, DatePicker, Steps, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './AuthPages.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [vaiTro, setVaiTro] = useState('SinhVien');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const steps = [
    { title: 'Tài khoản' },
    { title: 'Thông tin cá nhân' },
    { title: 'Thông tin bổ sung' },
  ];

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
        ngayVaoLam: values.ngayVaoLam?.format('YYYY-MM-DD'),
      };

      const response = await authService.register(data);
      
      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Form.Item
              name="vaiTro"
              label="Vai trò"
              rules={[{ required: true }]}
              initialValue="SinhVien"
            >
              <Select onChange={(value) => setVaiTro(value)}>
                <Option value="SinhVien">Sinh viên</Option>
                <Option value="CanBo">Cán bộ KTX</Option>
                <Option value="Admin">Quản trị viên</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="tenDangNhap"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="matKhau"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['matKhau']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('matKhau') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="hoTen"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gioiTinh"
                  label="Giới tính"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ngaySinh"
                  label="Ngày sinh"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>

            <Form.Item
              name="cccd"
              label="CCCD"
              rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
            >
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>

            <Form.Item name="diaChi" label="Địa chỉ">
              <Input.TextArea rows={2} />
            </Form.Item>
          </>
        );

      case 2:
        if (vaiTro === 'SinhVien') {
          return (
            <>
              <Form.Item
                name="maSV"
                label="Mã sinh viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="khoa" label="Khoa">
                <Input />
              </Form.Item>

              <Form.Item name="nganh" label="Ngành">
                <Input />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="lop" label="Lớp">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="namHoc" label="Năm học">
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="diemTB" label="Điểm TB">
                <Input type="number" step="0.01" />
              </Form.Item>
            </>
          );
        } else {
          return (
            <>
              <Form.Item
                name="maNV"
                label="Mã nhân viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="chucVu" label="Chức vụ">
                <Input />
              </Form.Item>

              <Form.Item name="phongBan" label="Phòng ban">
                <Input />
              </Form.Item>

              <Form.Item name="ngayVaoLam" label="Ngày vào làm">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" style={{ maxWidth: 600 }}>
        <div className="auth-header">
          <Title level={2}>Đăng ký tài khoản</Title>
          <Text type="secondary">Tạo tài khoản mới trong hệ thống</Text>
        </div>

        <Steps current={current} items={steps} className="register-steps" />

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className="register-form"
        >
          {renderStepContent()}

          <Form.Item>
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {current > 0 && (
                <Button onClick={prev}>
                  Quay lại
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button type="primary" onClick={next} style={{ flex: 1 }}>
                  Tiếp theo
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 1 }}>
                  Đăng ký
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Text type="secondary">
            Đã có tài khoản? <a onClick={() => navigate('/login')}>Đăng nhập ngay</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
