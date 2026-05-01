import api from './api';

// Khớp với backend HoaDonDTO
export interface HoaDon {
  maHoaDon: number;
  soHoaDon: string;
  maHopDong: number;
  soHopDong?: string;
  maSinhVien: number;
  tenSinhVien?: string;
  maSV?: string;
  tenPhong?: string;
  thang: number;
  nam: number;
  tienPhong: number;
  tienDien: number;
  tienNuoc: number;
  phiDichVu: number;
  phiPhat: number;
  tongTien: number;
  trangThai?: string;
  ngayPhatHanh: string;
  ngayThanhToan?: string;
  maCanBoTao: number;
  tenCanBoTao?: string;
}

// Khớp với backend CreateHoaDonDTO
export interface CreateHoaDonDTO {
  soHoaDon: string;
  maHopDong: number;
  maSinhVien: number;
  thang: number;
  nam: number;
  tienPhong: number;
  tienDien?: number;
  tienNuoc?: number;
  phiDichVu?: number;
  phiPhat?: number;
}

const hoaDonService = {
  getAll: async (maSinhVien?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (maSinhVien) params.append('maSinhVien', maSinhVien.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/hoadon?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/hoadon/${id}`);
    return response.data;
  },

  create: async (data: CreateHoaDonDTO) => {
    const response = await api.post('/hoadon', data);
    return response.data;
  },

  thanhToan: async (id: number, phuongThucThanhToan: string, maGiaoDich?: string) => {
    const response = await api.put(`/hoadon/${id}/thanhtoan`, {
      phuongThucThanhToan,
      maGiaoDich,
    });
    return response.data;
  },
};

export default hoaDonService;
