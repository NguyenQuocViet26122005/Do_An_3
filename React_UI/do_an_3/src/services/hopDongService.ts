import api from './api';

// Khớp với backend HopDongDTO
export interface HopDong {
  maHopDong: number;
  soHopDong: string;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  maPhong: number;
  tenPhong?: string;
  tenToaNha?: string;
  maGiuong: number;
  soGiuong?: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaThue: number;
  trangThai?: string;
  maCanBoTao: number;
  tenCanBoTao?: string;
  ngayTao?: string;
}

// Khớp với backend CreateHopDongDTO
export interface CreateHopDongDTO {
  soHopDong: string;
  maSinhVien: number;
  maPhong: number;
  maGiuong: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaThue: number;
}

const hopDongService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/hopdong?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/hopdong/${id}`);
    return response.data;
  },

  create: async (data: CreateHopDongDTO) => {
    const response = await api.post('/hopdong', data);
    return response.data;
  },
};

export default hopDongService;
