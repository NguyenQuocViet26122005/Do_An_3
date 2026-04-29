import api from './api';

export interface ViPham {
  maViPham: number;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  tenViPham: string;
  mucDo?: string;
  moTa?: string;
  mucPhat: number;
  ngayViPham: Date;
  trangThai: string;
  maCanBoGhi?: number;
  tenCanBoGhi?: string;
  ngayGhi: Date;
}

export interface CreateViPhamDTO {
  maSinhVien: number;
  tenViPham: string;
  mucDo?: string;
  moTa?: string;
  mucPhat?: number;
  ngayViPham: Date;
}

const viPhamService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/vipham?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/vipham/${id}`);
    return response.data;
  },

  create: async (data: CreateViPhamDTO) => {
    const response = await api.post('/vipham', data);
    return response.data;
  },

  xuLy: async (id: number, trangThai: string, ghiChu?: string) => {
    const response = await api.put(`/vipham/${id}/xuly`, { trangThai, ghiChu });
    return response.data;
  },
};

export default viPhamService;
