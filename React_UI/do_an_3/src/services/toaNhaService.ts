import api from './api';

// Khớp với backend ToaNhaDTO
export interface ToaNha {
  maToaNha: number;
  maToa: string;
  tenToaNha: string;
  loaiToaNha?: string;
  soTang?: number;
  trangThai?: string;
  maCanBoQuanLy?: number;
  tenCanBoQuanLy?: string;
  tongSoPhong?: number;
  soPhongTrong?: number;
}

// Khớp với backend CreateToaNhaDTO
export interface CreateToaNhaDTO {
  maToa: string;
  tenToaNha: string;
  loaiToaNha?: string;
  soTang?: number;
  maCanBoQuanLy?: number;
}

// Khớp với backend UpdateToaNhaDTO
export interface UpdateToaNhaDTO {
  maToa?: string;
  tenToaNha?: string;
  loaiToaNha?: string;
  soTang?: number;
  trangThai?: string;
  maCanBoQuanLy?: number;
}

const toaNhaService = {
  getAll: async () => {
    const response = await api.get('/toanha');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/toanha/${id}`);
    return response.data;
  },

  create: async (data: CreateToaNhaDTO) => {
    const response = await api.post('/toanha', data);
    return response.data;
  },

  update: async (id: number, data: UpdateToaNhaDTO) => {
    const response = await api.put(`/toanha/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/toanha/${id}`);
    return response.data;
  },
};

export default toaNhaService;
