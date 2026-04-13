import api from './api';

export interface LoginRequest {
  tenDangNhap: string;
  matKhau: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    vaiTro: string;
    maTaiKhoan: number;
    maNguoiDung: number;
    hoTen: string;
    email: string;
    maActor: number;
    maActorCode: string;
  };
}

export interface RegisterRequest {
  tenDangNhap: string;
  matKhau: string;
  vaiTro: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  cccd: string;
  diaChi?: string;
  maNV?: string;
  chucVu?: string;
  phongBan?: string;
  ngayVaoLam?: string;
  maSV?: string;
  khoa?: string;
  nganh?: string;
  lop?: string;
  namHoc?: number;
  diemTB?: number;
}

const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
