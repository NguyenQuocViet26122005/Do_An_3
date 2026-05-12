import api from './api';

// Khớp với backend ViPhamDTO
export interface ViPham {
  maViPham: number;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  tenPhong?: string;
  tenViPham: string;
  mucDo?: string;
  moTa?: string;
  mucPhat: number;
  ngayViPham: string;
  trangThai?: string;
  maCanBoGhi: number;
  tenCanBoGhi?: string;
  ngayGhi: string;
}

// Khớp với backend CreateViPhamDTO / UpdateViPhamDTO
export interface CreateViPhamDTO {
  maSinhVien: number;
  tenViPham: string;
  mucDo?: string;
  moTa?: string;
  mucPhat: number;
  ngayViPham: string;
}

export interface UpdateViPhamDTO extends CreateViPhamDTO {}

const viPhamService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien !== undefined && maSinhVien !== null) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const query = params.toString();
    const response = await api.get(query ? `/vipham?${query}` : '/vipham');
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

  update: async (id: number, data: UpdateViPhamDTO) => {
    const response = await api.put(`/vipham/${id}`, data);
    return response.data;
  },

  xuLy: async (id: number, trangThai: string, ghiChu?: string) => {
    const response = await api.put(`/vipham/${id}/xuly`, { trangThai, ghiChu });
    return response.data;
  },
};

export default viPhamService;
