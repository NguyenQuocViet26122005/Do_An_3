// =============================================
// SERVICE EXPORTS - Kết nối trực tiếp API backend
// =============================================

import phongService from './phongService';
import toaNhaService from './toaNhaService';
import dangKyService from './dangKyService';
import hopDongService from './hopDongService';
import hoaDonService from './hoaDonService';
import viPhamService from './viPhamService';
import thongBaoService from './thongBaoService';
import baoTriService from './baoTriService';
import sinhVienService from './sinhVienService';

export {
  phongService,
  toaNhaService,
  dangKyService,
  hopDongService,
  hoaDonService,
  viPhamService,
  thongBaoService,
  baoTriService,
  sinhVienService,
};

export default {
  phong: phongService,
  toaNha: toaNhaService,
  dangKy: dangKyService,
  hopDong: hopDongService,
  hoaDon: hoaDonService,
  viPham: viPhamService,
  thongBao: thongBaoService,
  baoTri: baoTriService,
  sinhVien: sinhVienService,
};
