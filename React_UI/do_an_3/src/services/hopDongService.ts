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
  hocKy?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaThue: number;
  trangThai?: string;
  maCanBoTao: number;
  tenCanBoTao?: string;
  ngayTao?: string;
  soThang?: number;
}

// Khớp với backend CreateHopDongDTO
export interface CreateHopDongDTO {
  soHopDong: string;
  maSinhVien: number;
  maPhong: number;
  maGiuong: number;
  hocKy: string;
  ngayBatDau: string;
  soThang: number;
  giaThue: number;
}

export interface GiaHanHopDongDTO {
  soThangGiaHan: number;
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

  giaHan: async (id: number, data: GiaHanHopDongDTO) => {
    const response = await api.put(`/hopdong/${id}/gia-han`, data);
    return response.data;
  },

  chamDut: async (id: number) => {
    const response = await api.put(`/hopdong/${id}/cham-dut`);
    return response.data;
  },
};

export default hopDongService;
