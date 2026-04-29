import api from './api';

export interface Phong {
  maPhong: number;
  maToaNha: number;
  tenToaNha?: string;
  soPhong: string;
  tang?: number;
  loaiPhong?: string;
  giaThue?: number;
  dienTich?: number;
  soGiuong?: number;
  soGiuongTrong?: number;
  trangThai?: string;
  moTa?: string;
}

export interface CreatePhongDTO {
  maToaNha: number;
  soPhong: string;
  tang?: number;
  loaiPhong?: string;
  giaThue?: number;
  dienTich?: number;
  soGiuong?: number;
  moTa?: string;
}

export interface UpdatePhongDTO {
  soPhong: string;
  tang?: number;
  loaiPhong?: string;
  giaThue?: number;
  dienTich?: number;
  soGiuong?: number;
  trangThai?: string;
  moTa?: string;
}

const phongService = {
  getAll: async (maToaNha?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maToaNha) params.append('maToaNha', maToaNha.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/phong?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/phong/${id}`);
    return response.data;
  },

  create: async (data: CreatePhongDTO) => {
    const response = await api.post('/phong', data);
    return response.data;
  },

  update: async (id: number, data: UpdatePhongDTO) => {
    const response = await api.put(`/phong/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/phong/${id}`);
    return response.data;
  },
};

export default phongService;
