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
  maPhong?: number;
  tenPhong?: string;
  tenToaNha?: string;
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
  hanThanhToan?: string;
  maCanBoTao: number;
  tenCanBoTao?: string;
  chiSoDienCu?: number;
  chiSoDienMoi?: number;
  chiSoNuocCu?: number;
  chiSoNuocMoi?: number;
  phuongThucThanhToan?: string;
  maGiaoDich?: string;
}

// Khớp với backend HoaDonTheoPhongDTO
export interface HoaDonTheoPhong {
  maPhong: number;
  tenPhong?: string;
  tenToaNha?: string;
  thang: number;
  nam: number;
  soLuongSinhVien: number;
  soLuongDaThanhToan: number;
  tongTienTatCa: number;
  tongTienDaThu: number;
  tongTienConLai: number;
  trangThai: string;
  danhSachHoaDon: HoaDon[];
  ngayPhatHanh?: string;
  hanThanhToan?: string;
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

  // API mới: Lấy hóa đơn đã group theo phòng
  getHoaDonTheoPhong: async (thang?: number, nam?: number, trangThai?: string) => {
    const params = new URLSearchParams();
    if (thang) params.append('thang', thang.toString());
    if (nam) params.append('nam', nam.toString());
    if (trangThai) params.append('trangThai', trangThai);
    const response = await api.get(`/hoadon/theo-phong?${params.toString()}`);
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

  // API mới: Thanh toán toàn bộ phòng
  thanhToanToanBoPhong: async (maPhong: number, thang: number, nam: number, phuongThucThanhToan: string = 'Tiền mặt') => {
    const response = await api.post('/hoadon/theo-phong/thanhtoan', {
      maPhong,
      thang,
      nam,
      phuongThucThanhToan,
    });
    return response.data;
  },

  createTheoPhong: async (data: {
    maPhong: number;
    thang: number;
    nam: number;
    chiSoDienCu: number;
    chiSoDienMoi: number;
    giaDien: number;
    chiSoNuocCu: number;
    chiSoNuocMoi: number;
    giaNuoc: number;
    phiDichVuMoiNguoi: number;
  }) => {
    const response = await api.post('/hoadon/theo-phong/create', data);
    return response.data;
  },
};

export default hoaDonService;
