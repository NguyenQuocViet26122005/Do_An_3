namespace Api_Gateway.DTO.HoaDon
{
    /// <summary>
    /// DTO hiển thị hóa đơn gộp theo phòng
    /// Trạng thái "DaThanhToan" chỉ khi TẤT CẢ sinh viên trong phòng đã thanh toán
    /// </summary>
    public class HoaDonTheoPhongDTO
    {
        public int MaPhong { get; set; }
        public string? TenPhong { get; set; }
        public string? TenToaNha { get; set; }
        public int Thang { get; set; }
        public int Nam { get; set; }
        
        /// <summary>
        /// Tổng số sinh viên trong phòng (có hóa đơn)
        /// </summary>
        public int SoLuongSinhVien { get; set; }
        
        /// <summary>
        /// Số sinh viên đã thanh toán
        /// </summary>
        public int SoLuongDaThanhToan { get; set; }
        
        /// <summary>
        /// Tổng tiền của TẤT CẢ hóa đơn trong phòng
        /// </summary>
        public decimal TongTienTatCa { get; set; }
        
        /// <summary>
        /// Số tiền đã thu
        /// </summary>
        public decimal TongTienDaThu { get; set; }
        
        /// <summary>
        /// Số tiền còn phải thu
        /// </summary>
        public decimal TongTienConLai { get; set; }
        
        /// <summary>
        /// Trạng thái: "DaThanhToan" (tất cả đã thanh toán) hoặc "ChuaThanhToan" (còn người chưa thanh toán)
        /// </summary>
        public string TrangThai { get; set; } = "ChuaThanhToan";
        
        /// <summary>
        /// Danh sách hóa đơn chi tiết của từng sinh viên
        /// </summary>
        public List<HoaDonDTO> DanhSachHoaDon { get; set; } = new List<HoaDonDTO>();
        
        /// <summary>
        /// Ngày phát hành (lấy từ hóa đơn đầu tiên)
        /// </summary>
        public DateTime? NgayPhatHanh { get; set; }
        
        /// <summary>
        /// Hạn thanh toán (lấy từ hóa đơn đầu tiên)
        /// </summary>
        public DateOnly? HanThanhToan { get; set; }
    }
}
