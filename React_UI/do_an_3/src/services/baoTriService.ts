import api from './api';

export interface YeuCauBaoTri {
  maYeuCau: number;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  maPhong: number;
  tenPhong?: string;
  tieuDe: string;
  moTa?: string;
  loaiYeuCau?: string;
  trangThai: string;
  maCanBoXuLy?: number;
  tenCanBoXuLy?: string;
  ngayXuLy?: Date;
  chiPhi?: number;
  ngayTao: Date;
}

export interface CreateYeuCauBaoTriDTO {
  maPhong: number;
  tieuDe: string;
  moTa?: string;
  loaiYeuCau?: string;
}

export interface XuLyBaoTriDTO {
  trangThai: string;
  chiPhi?: number;
}

const baoTriService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/baotri?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/baotri/${id}`);
    return response.data;
  },

  create: async (data: CreateYeuCauBaoTriDTO) => {
    const response = await api.post('/baotri', data);
    return response.data;
  },

  xuLy: async (id: number, data: XuLyBaoTriDTO) => {
    const response = await api.put(`/baotri/${id}/xuly`, data);
    return response.data;
  },
};

export default baoTriService;
