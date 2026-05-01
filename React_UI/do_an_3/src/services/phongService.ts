import api from './api';

// Khớp với backend PhongDTO
export interface Phong {
  maPhong: number;
  soPhong: string;
  tang?: number;
  loaiPhong?: string;
  sucChua?: number;
  giaPhong?: number;
  trangThai?: string;
  soNguoiHienTai?: number;
  maToaNha: number;
  tenToaNha?: string;
  soGiuongTrong?: number;
}

// Khớp với backend GiuongDTO
export interface Giuong {
  maGiuong: number;
  maPhong: number;
  soGiuong: number;
  trangThai?: string;
  maSinhVien?: number;
  tenSinhVien?: string;
  maSV?: string;
}

// Khớp với backend CreatePhongDTO
export interface CreatePhongDTO {
  soPhong: string;
  tang?: number;
  loaiPhong?: string;
  sucChua: number;
  giaPhong: number;
  maToaNha: number;
}

// Khớp với backend UpdatePhongDTO
export interface UpdatePhongDTO {
  soPhong?: string;
  tang?: number;
  loaiPhong?: string;
  sucChua?: number;
  giaPhong?: number;
  trangThai?: string;
  maToaNha?: number;
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

  getGiuong: async (maPhong: number) => {
    const response = await api.get(`/phong/${maPhong}/giuong`);
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
