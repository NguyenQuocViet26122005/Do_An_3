import api from './api';

// Khớp với backend DangKyPhongDTO
export interface DangKyPhong {
  maDangKy: number;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  maPhong: number;
  tenPhong?: string;
  tenToaNha?: string;
  maGiuong?: number;
  soGiuong?: number;
  hocKy?: string;
  ngayDangKy?: string;
  trangThai?: string;
  maCanBoDuyet?: number;
  tenCanBoDuyet?: string;
  ngayDuyet?: string;
  lyDoTuChoi?: string;
}

// Khớp với backend CreateDangKyDTO
export interface CreateDangKyDTO {
  maPhong: number;
  maGiuong?: number;
  hocKy?: string;
}

// Khớp với backend DuyetDangKyDTO
export interface DuyetDangKyDTO {
  trangThai: string; // DaDuyet hoặc TuChoi
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

  create: async (data: CreateDangKyDTO) => {
    const response = await api.post('/dangky', data);
    return response.data;
  },

  duyet: async (id: number, data: DuyetDangKyDTO) => {
    const response = await api.put(`/dangky/${id}/duyet`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/dangky/${id}`);
    return response.data;
  },
};

export default dangKyService;
