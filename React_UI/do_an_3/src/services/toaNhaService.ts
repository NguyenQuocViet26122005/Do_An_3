import api from './api';

export interface ToaNha {
  maToaNha: number;
  tenToaNha: string;
  diaChi?: string;
  soTang?: number;
  soPhong?: number;
  moTa?: string;
  trangThai?: string;
}

export interface CreateToaNhaDTO {
  tenToaNha: string;
  diaChi?: string;
  soTang?: number;
  moTa?: string;
}

export interface UpdateToaNhaDTO {
  tenToaNha: string;
  diaChi?: string;
  soTang?: number;
  moTa?: string;
  trangThai?: string;
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
