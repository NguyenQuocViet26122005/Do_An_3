import api from './api';

export interface ThongBao {
  maThongBao: number;
  tieuDe: string;
  noiDung: string;
  loaiThongBao?: string;
  maCanBoGui?: number;
  tenCanBoGui?: string;
  ngayGui: Date;
  daDoc: boolean;
}

export interface CreateThongBaoDTO {
  tieuDe: string;
  noiDung: string;
  loaiThongBao?: string;
  maSinhVienNhan?: number;
  maCanBoNhan?: number;
}

const thongBaoService = {
  getAll: async (loaiNguoiNhan?: string) => {
    const params = new URLSearchParams();
    if (loaiNguoiNhan) params.append('loaiNguoiNhan', loaiNguoiNhan);
    const response = await api.get(`/thongbao?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/thongbao/${id}`);
    return response.data;
  },

  create: async (data: CreateThongBaoDTO) => {
    const response = await api.post('/thongbao', data);
    return response.data;
  },

  danhDauDaDoc: async (id: number) => {
    const response = await api.put(`/thongbao/${id}/dadoc`);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/thongbao/${id}`);
    return response.data;
  },
};

export default thongBaoService;
