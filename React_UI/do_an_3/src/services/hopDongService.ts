import api from './api';

export interface HopDong {
  maHopDong: number;
  soHopDong: string;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  maPhong: number;
  tenPhong?: string;
  soGiuong?: number;
  ngayBatDau: Date;
  ngayKetThuc: Date;
  giaThue: number;
  tienCoc: number;
  trangThai: string;
  ngayKy?: Date;
  maCanBoTao?: number;
  tenCanBoTao?: string;
}

export interface CreateHopDongDTO {
  maSinhVien: number;
  maPhong: number;
  soGiuong: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  giaThue: number;
  tienCoc: number;
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

  ketThuc: async (id: number, lyDo?: string) => {
    const response = await api.put(`/hopdong/${id}/ketthuc`, { lyDo });
    return response.data;
  },
};

export default hopDongService;
