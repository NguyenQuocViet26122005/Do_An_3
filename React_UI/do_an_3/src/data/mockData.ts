// Mock data cho toàn bộ hệ thống

export const mockToaNha = [
  { maToaNha: 1, tenToaNha: 'Tòa nhà A', diaChi: 'Số 1 Đại Cồ Việt', soTang: 5, tongSoPhong: 50 },
  { maToaNha: 2, tenToaNha: 'Tòa nhà B', diaChi: 'Số 1 Đại Cồ Việt', soTang: 5, tongSoPhong: 50 },
  { maToaNha: 3, tenToaNha: 'Tòa nhà C', diaChi: 'Số 1 Đại Cồ Việt', soTang: 6, tongSoPhong: 60 },
  { maToaNha: 4, tenToaNha: 'Tòa nhà D', diaChi: 'Số 1 Đại Cồ Việt', soTang: 4, tongSoPhong: 40 },
];

export const mockPhong = [
  { maPhong: 1, tenPhong: 'A101', tenToaNha: 'Tòa A', tang: 1, loaiPhong: '4 người', sucChua: 4, giaThue: 500000, trangThai: 'Trống' },
  { maPhong: 2, tenPhong: 'A102', tenToaNha: 'Tòa A', tang: 1, loaiPhong: '4 người', sucChua: 4, giaThue: 500000, trangThai: 'Đầy' },
  { maPhong: 3, tenPhong: 'A201', tenToaNha: 'Tòa A', tang: 2, loaiPhong: '6 người', sucChua: 6, giaThue: 400000, trangThai: 'Còn chỗ' },
  { maPhong: 4, tenPhong: 'B101', tenToaNha: 'Tòa B', tang: 1, loaiPhong: '8 người', sucChua: 8, giaThue: 350000, trangThai: 'Trống' },
  { maPhong: 5, tenPhong: 'B102', tenToaNha: 'Tòa B', tang: 1, loaiPhong: '4 người', sucChua: 4, giaThue: 500000, trangThai: 'Đầy' },
  { maPhong: 6, tenPhong: 'C101', tenToaNha: 'Tòa C', tang: 1, loaiPhong: '6 người', sucChua: 6, giaThue: 400000, trangThai: 'Trống' },
];

export const mockUsers = [
  { maTaiKhoan: 1, tenDangNhap: 'admin', hoTen: 'Nguyễn Văn Admin', email: 'admin@ktx.edu.vn', soDienThoai: '0123456789', vaiTro: 'Admin', trangThai: true },
  { maTaiKhoan: 2, tenDangNhap: 'canbo01', hoTen: 'Trần Thị Cán Bộ', email: 'canbo01@ktx.edu.vn', soDienThoai: '0987654321', vaiTro: 'CanBo', trangThai: true },
  { maTaiKhoan: 3, tenDangNhap: 'canbo02', hoTen: 'Lê Văn Quản Lý', email: 'canbo02@ktx.edu.vn', soDienThoai: '0912345678', vaiTro: 'CanBo', trangThai: true },
  { maTaiKhoan: 4, tenDangNhap: 'sv001', hoTen: 'Phạm Thị Sinh Viên', email: 'sv001@student.edu.vn', soDienThoai: '0934567890', vaiTro: 'SinhVien', trangThai: true },
  { maTaiKhoan: 5, tenDangNhap: 'sv002', hoTen: 'Hoàng Văn Học', email: 'sv002@student.edu.vn', soDienThoai: '0945678901', vaiTro: 'SinhVien', trangThai: false },
];

export const mockDangKy = [
  { maDangKy: 1, tenSinhVien: 'Phạm Thị Sinh Viên', maSV: 'B20DCCN001', tenPhong: 'A101', tenToaNha: 'Tòa A', ngayDangKy: '2024-03-15', trangThai: 'Chờ duyệt', ghiChu: 'Ưu tiên phòng tầng 1' },
  { maDangKy: 2, tenSinhVien: 'Hoàng Văn Học', maSV: 'B20DCCN002', tenPhong: 'A102', tenToaNha: 'Tòa A', ngayDangKy: '2024-03-14', trangThai: 'Đã duyệt', ghiChu: '' },
  { maDangKy: 3, tenSinhVien: 'Nguyễn Thị Mai', maSV: 'B20DCCN003', tenPhong: 'B201', tenToaNha: 'Tòa B', ngayDangKy: '2024-03-16', trangThai: 'Chờ duyệt', ghiChu: '' },
  { maDangKy: 4, tenSinhVien: 'Trần Văn Nam', maSV: 'B20DCCN004', tenPhong: 'C101', tenToaNha: 'Tòa C', ngayDangKy: '2024-03-13', trangThai: 'Từ chối', ghiChu: 'Không đủ điều kiện' },
];

export const mockHopDong = [
  { maHopDong: 1, code: 'HD001', tenSinhVien: 'Hoàng Văn Học', maSV: 'B20DCCN002', room: 'A102', building: 'Tòa A', startDate: '2024-01-01', endDate: '2024-06-30', status: 'Đang hiệu lực' },
  { maHopDong: 2, code: 'HD002', tenSinhVien: 'Phạm Thị Sinh Viên', maSV: 'B20DCCN001', room: 'A101', building: 'Tòa A', startDate: '2024-02-01', endDate: '2024-07-31', status: 'Đang hiệu lực' },
  { maHopDong: 3, code: 'HD003', tenSinhVien: 'Nguyễn Thị Mai', maSV: 'B20DCCN003', room: 'B201', building: 'Tòa B', startDate: '2023-09-01', endDate: '2024-01-31', status: 'Hết hạn' },
];

export const mockHoaDon = [
  { maHoaDon: 1, code: 'HD001', month: '2024-04', room: 'A102', roomFee: 500000, electricFee: 150000, waterFee: 50000, total: 700000, status: 'Chưa thanh toán' },
  { maHoaDon: 2, code: 'HD002', month: '2024-03', room: 'A102', roomFee: 500000, electricFee: 140000, waterFee: 45000, total: 685000, status: 'Đã thanh toán' },
  { maHoaDon: 3, code: 'HD003', month: '2024-04', room: 'A101', roomFee: 500000, electricFee: 160000, waterFee: 55000, total: 715000, status: 'Chưa thanh toán' },
  { maHoaDon: 4, code: 'HD004', month: '2024-03', room: 'A101', roomFee: 500000, electricFee: 145000, waterFee: 48000, total: 693000, status: 'Đã thanh toán' },
];

export const mockViPham = [
  { maViPham: 1, code: 'VP001', tenSinhVien: 'Hoàng Văn Học', maSV: 'B20DCCN002', type: 'Gây ồn', date: '2024-03-10', description: 'Gây ồn sau 22h', fine: 100000, status: 'Chưa xử lý' },
  { maViPham: 2, code: 'VP002', tenSinhVien: 'Phạm Thị Sinh Viên', maSV: 'B20DCCN001', type: 'Về muộn', date: '2024-03-05', description: 'Về sau 23h không xin phép', fine: 50000, status: 'Đã xử lý' },
  { maViPham: 3, code: 'VP003', tenSinhVien: 'Nguyễn Thị Mai', maSV: 'B20DCCN003', type: 'Hút thuốc', date: '2024-03-12', description: 'Hút thuốc trong phòng', fine: 200000, status: 'Chưa xử lý' },
];

export const mockBaoTri = [
  { maYeuCau: 1, code: 'YC001', tenSinhVien: 'Hoàng Văn Học', room: 'A102', type: 'Điện', description: 'Đèn hỏng', date: '2024-03-15', status: 'Đang xử lý' },
  { maYeuCau: 2, code: 'YC002', tenSinhVien: 'Phạm Thị Sinh Viên', room: 'A101', type: 'Nước', description: 'Vòi nước bị rò', date: '2024-03-14', status: 'Đã hoàn thành' },
  { maYeuCau: 3, code: 'YC003', tenSinhVien: 'Nguyễn Thị Mai', room: 'B201', type: 'Đồ dùng', description: 'Quạt không hoạt động', date: '2024-03-16', status: 'Chờ xử lý' },
];

export const mockThongBao = [
  { id: 1, title: 'Thông báo đóng tiền phòng tháng 4', content: 'Sinh viên vui lòng đóng tiền phòng tháng 4 trước ngày 10/04/2024.', date: '2024-04-01', type: 'important', read: false },
  { id: 2, title: 'Lịch kiểm tra phòng định kỳ', content: 'Kiểm tra phòng định kỳ sẽ diễn ra vào ngày 15/04/2024.', date: '2024-03-28', type: 'info', read: true },
  { id: 3, title: 'Thông báo bảo trì hệ thống điện', content: 'Hệ thống điện sẽ được bảo trì vào ngày 20/04/2024 từ 8h-12h.', date: '2024-04-05', type: 'warning', read: false },
];
