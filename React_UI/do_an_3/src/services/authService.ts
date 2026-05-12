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
  CCCD: string;
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

export interface UserDTO {
  maTaiKhoan: number;
  tenDangNhap: string;
  vaiTro: string;
  trangThai: boolean;
  ngayTao?: string;
  maNguoiDung: number;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  cccd: string;
  diaChi?: string;
  maActor?: number;
  maActorCode?: string;
  chucVu?: string;
  phongBan?: string;
  ngayVaoLam?: string;
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

  getUsers: async (filters?: { vaiTro?: string; trangThai?: boolean }) => {
    const response = await api.get('/auth/users', { params: filters });
    return response.data;
  },

  setUserStatus: async (id: number, trangThai: boolean) => {
    const response = await api.put(`/auth/users/${id}/status`, { trangThai });
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
