import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Font cho tiếng Việt (cần import font riêng nếu muốn hiển thị đầy đủ)
// Hiện tại sẽ dùng font mặc định, một số ký tự tiếng Việt có thể không hiển thị

/**
 * Xuất dữ liệu ra file Excel
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Xuất bảng dữ liệu ra PDF
 */
export const exportTableToPDF = (
  title: string,
  headers: string[],
  data: any[][],
  fileName: string
) => {
  const doc = new jsPDF();
  
  // Tiêu đề
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Ngày xuất
  doc.setFontSize(10);
  doc.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 14, 22);
  
  // Bảng dữ liệu
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 30,
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });
  
  doc.save(`${fileName}.pdf`);
};

/**
 * Xuất hợp đồng ra PDF
 */
export const exportContractToPDF = (contract: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('HOP DONG THUE PHONG KY TUC XA', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`So hop dong: ${contract.soHopDong}`, 14, 35);
  
  // Thông tin sinh viên
  doc.setFontSize(14);
  doc.text('I. THONG TIN SINH VIEN', 14, 50);
  doc.setFontSize(11);
  doc.text(`Ho ten: ${contract.tenSinhVien}`, 20, 60);
  doc.text(`Ma SV: ${contract.maSV}`, 20, 68);
  
  // Thông tin phòng
  doc.setFontSize(14);
  doc.text('II. THONG TIN PHONG', 14, 85);
  doc.setFontSize(11);
  doc.text(`Phong: ${contract.tenPhong}`, 20, 95);
  doc.text(`Giuong: ${contract.soGiuong}`, 20, 103);
  doc.text(`Hoc ky: ${contract.hocKy}`, 20, 111);
  
  // Thời hạn
  doc.setFontSize(14);
  doc.text('III. THOI HAN HOP DONG', 14, 128);
  doc.setFontSize(11);
  doc.text(`Ngay bat dau: ${contract.ngayBatDau}`, 20, 138);
  doc.text(`Ngay ket thuc: ${contract.ngayKetThuc}`, 20, 146);
  
  // Giá thuê
  doc.setFontSize(14);
  doc.text('IV. GIA THUE', 14, 163);
  doc.setFontSize(11);
  doc.text(`Gia thue: ${contract.giaThue?.toLocaleString('vi-VN')} VND/thang`, 20, 173);
  
  // Chữ ký
  doc.setFontSize(11);
  doc.text('Dai dien KTX', 40, 230);
  doc.text('Sinh vien', 140, 230);
  
  doc.text('(Ky va ghi ro ho ten)', 30, 240);
  doc.text('(Ky va ghi ro ho ten)', 130, 240);
  
  // Footer
  doc.setFontSize(9);
  doc.text(`Ngay in: ${new Date().toLocaleDateString('vi-VN')}`, 14, 280);
  
  doc.save(`HopDong_${contract.soHopDong}.pdf`);
};
