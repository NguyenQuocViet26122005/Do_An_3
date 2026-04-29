import api from './api';

export interface SinhVien {
  maSinhVien: number;
  maNguoiDung: number;
  maSv: string;
  hoTen: string;
  gioiTinh?: string;
  ngaySinh?: Date;
  soDienThoai?: string;
  email?: string;
  cccd?: string;
  diaChi?: string;
  khoa?: string;
  nganh?: string;
  lop?: string;
  namHoc?: number;
  diemTb?: number;
}

const sinhVienService = {
  getAll: async (khoa?: string, lop?: string) => {
    const params = new URLSearchParams();
    if (khoa) params.append('khoa', khoa);
    if (lop) params.append('lop', lop);
    const response = await api.get(`/sinhvien?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/sinhvien/${id}`);
    return response.data;
  },

  getByMaSV: async (maSV: string) => {
    const response = await api.get(`/sinhvien/masv/${maSV}`);
    return response.data;
  },
};

export default sinhVienService;
