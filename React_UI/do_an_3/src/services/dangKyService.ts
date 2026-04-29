import api from './api';

export interface DangKyPhong {
  maDangKy: number;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  maPhong: number;
  tenPhong?: string;
  tenToaNha?: string;
  ngayDangKy: Date;
  trangThai: string;
  lyDo?: string;
  ngayDuyet?: Date;
  maNguoiDuyet?: number;
  tenNguoiDuyet?: string;
}

export interface CreateDangKyDTO {
  maPhong: number;
  lyDo?: string;
}

export interface DuyetDangKyDTO {
  trangThai: string;
  lyDoTuChoi?: string;
}

const dangKyService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/dangky?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/dangky/${id}`);
    return response.data;
  },

  create: async (data: CreateDangKyDTO) => {
    const response = await api.post('/dangky', data);
    return response.data;
  },

  duyet: async (id: number, data: DuyetDangKyDTO) => {
    const response = await api.put(`/dangky/${id}/duyet`, data);
    return response.data;
  },
};

export default dangKyService;
