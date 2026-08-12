# 📘 HƯỚNG DẪN CHIA ĐỀU TIỀN ĐIỆN NƯỚC

## 🎯 Tính năng mới

Hệ thống hỗ trợ **tự động chia đều tiền điện nước** theo số người đang ở trong phòng khi tạo hóa đơn.

---

## 🔧 Cách hoạt động

### **Trước đây (Cách cũ):**
```
Cán bộ tạo 4 hóa đơn riêng lẻ:
- Hóa đơn SV001: TienDien = 26,250 VNĐ (đã tính sẵn)
- Hóa đơn SV002: TienDien = 26,250 VNĐ (đã tính sẵn)
- Hóa đơn SV003: TienDien = 26,250 VNĐ (đã tính sẵn)
- Hóa đơn SV004: TienDien = 26,250 VNĐ (đã tính sẵn)
```

### **Bây giờ (Cách mới - Tự động):**
```
Cán bộ tạo 4 hóa đơn với CÙNG số tiền điện/nước TỔNG:
- Hóa đơn SV001: TienDien = 105,000 VNĐ, ChiaTheoPhong = true
- Hóa đơn SV002: TienDien = 105,000 VNĐ, ChiaTheoPhong = true
- Hóa đơn SV003: TienDien = 105,000 VNĐ, ChiaTheoPhong = true
- Hóa đơn SV004: TienDien = 105,000 VNĐ, ChiaTheoPhong = true

→ Backend tự động chia: 105,000 ÷ 4 = 26,250 VNĐ/người
```

---

## 📊 Ví dụ cụ thể

### **Tình huống: Phòng A101**

**Thông tin:**
- Số người ở: 4 người (từ `Phong.SoNguoiHienTai`)
- Chỉ số điện: 120 kWh → 150 kWh (dùng 30 kWh)
- Giá điện: 3,500 VNĐ/kWh
- **Tổng tiền điện phòng:** 30 × 3,500 = **105,000 VNĐ**

**Chỉ số nước:**
- Chỉ số nước: 30 m³ → 39 m³ (dùng 9 m³)
- Giá nước: 15,000 VNĐ/m³
- **Tổng tiền nước phòng:** 9 × 15,000 = **135,000 VNĐ**

---

### **Cách 1: KHÔNG chia tự động (ChiaTheoPhong = false)** ❌

```json
// Request tạo hóa đơn cho SV001
POST /api/HoaDon
{
  "soHoaDon": "HD202501001",
  "maHopDong": 1,
  "maSinhVien": 1,
  "thang": 1,
  "nam": 2025,
  "tienPhong": 500000,
  "tienDien": 26250,      // Đã tính sẵn = 105000 ÷ 4
  "tienNuoc": 33750,      // Đã tính sẵn = 135000 ÷ 4
  "phiDichVu": 30000,
  "chiaTheoPhong": false  // KHÔNG chia tự động
}
```

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "maHoaDon": 1,
    "maSinhVien": 1,
    "tienDien": 26250,    // Lưu y nguyên
    "tienNuoc": 33750,    // Lưu y nguyên
    "tongTien": 590000
  }
}
```

---

### **Cách 2: CHIA TỰ ĐỘNG (ChiaTheoPhong = true)** ✅ (KHUYẾN NGHỊ)

```json
// Request tạo hóa đơn cho SV001
POST /api/HoaDon
{
  "soHoaDon": "HD202501001",
  "maHopDong": 1,
  "maSinhVien": 1,
  "thang": 1,
  "nam": 2025,
  "tienPhong": 500000,
  "tienDien": 105000,     // TỔNG tiền điện phòng
  "tienNuoc": 135000,     // TỔNG tiền nước phòng
  "phiDichVu": 30000,
  "chiaTheoPhong": true   // ✅ Bật chia tự động
}
```

**Backend xử lý:**
```csharp
// 1. Lấy số người đang ở
var soNguoiO = phong.SoNguoiHienTai; // = 4

// 2. Chia đều
var tienDienMoiNguoi = 105000 / 4 = 26250;
var tienNuocMoiNguoi = 135000 / 4 = 33750;

// 3. Lưu vào database
hoaDon.TienDien = 26250;  // ĐÃ CHIA
hoaDon.TienNuoc = 33750;  // ĐÃ CHIA
```

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "maHoaDon": 1,
    "maSinhVien": 1,
    "tienDien": 26250,    // ✅ Đã tự động chia: 105000 ÷ 4
    "tienNuoc": 33750,    // ✅ Đã tự động chia: 135000 ÷ 4
    "tongTien": 590000
  }
}
```

---

## 💻 Code Frontend (React/TypeScript)

### **Cách gọi API (với chia tự động):**

```typescript
// File: services/hoaDonService.ts

interface CreateHoaDonRequest {
  soHoaDon: string;
  maHopDong: number;
  maSinhVien: number;
  thang: number;
  nam: number;
  tienPhong: number;
  tienDien: number;
  tienNuoc: number;
  phiDichVu: number;
  phiPhat?: number;
  chiaTheoPhong?: boolean;  // MỚI
}

export const taoHoaDonChoPhong = async (
  phong: Phong,
  thang: number,
  nam: number,
  chiSoDien: { cu: number; moi: number },
  chiSoNuoc: { cu: number; moi: number }
) => {
  // 1. Tính tổng tiền điện nước phòng
  const soDienTieuThu = chiSoDien.moi - chiSoDien.cu;
  const soNuocTieuThu = chiSoNuoc.moi - chiSoNuoc.cu;
  
  const tongTienDien = soDienTieuThu * 3500;  // VNĐ/kWh
  const tongTienNuoc = soNuocTieuThu * 15000; // VNĐ/m³

  // 2. Lấy danh sách sinh viên trong phòng
  const dsSinhVien = await getSinhVienTheoPhong(phong.maPhong);

  // 3. Tạo hóa đơn cho từng sinh viên
  const promises = dsSinhVien.map((sv, index) => {
    return createHoaDon({
      soHoaDon: `HD${thang}${nam}${phong.soPhong}${index + 1}`,
      maHopDong: sv.maHopDong,
      maSinhVien: sv.maSinhVien,
      thang,
      nam,
      tienPhong: phong.giaPhong,
      tienDien: tongTienDien,      // TỔNG (không chia)
      tienNuoc: tongTienNuoc,      // TỔNG (không chia)
      phiDichVu: 30000,
      chiaTheoPhong: true          // ✅ Backend sẽ tự động chia
    });
  });

  return await Promise.all(promises);
};
```

### **Component UI:**

```tsx
// File: pages/CanBo/TaoHoaDon.tsx

const TaoHoaDonTheoPhong: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      // Tính tổng tiền điện nước
      const tongTienDien = (values.chiSoDienMoi - values.chiSoDienCu) * 3500;
      const tongTienNuoc = (values.chiSoNuocMoi - values.chiSoNuocCu) * 15000;

      // Lấy danh sách sinh viên trong phòng
      const dsSinhVien = await getSinhVienTheoPhong(values.maPhong);

      // Tạo hóa đơn cho từng sinh viên
      for (let i = 0; i < dsSinhVien.length; i++) {
        const sv = dsSinhVien[i];
        await createHoaDon({
          soHoaDon: `HD${values.thang}${values.nam}${sv.id}`,
          maHopDong: sv.maHopDong,
          maSinhVien: sv.maSinhVien,
          thang: values.thang,
          nam: values.nam,
          tienPhong: sv.giaPhong,
          tienDien: tongTienDien,       // TỔNG
          tienNuoc: tongTienNuoc,       // TỔNG
          phiDichVu: 30000,
          chiaTheoPhong: true           // ✅ Chia tự động
        });
      }

      message.success(`Đã tạo ${dsSinhVien.length} hóa đơn thành công!`);
    } catch (error) {
      message.error('Tạo hóa đơn thất bại!');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item label="Phòng" name="maPhong">
        <Select>
          <Option value={1}>A101</Option>
          <Option value={2}>A102</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Chỉ số điện cũ" name="chiSoDienCu">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item label="Chỉ số điện mới" name="chiSoDienMoi">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item label="Chỉ số nước cũ" name="chiSoNuocCu">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item label="Chỉ số nước mới" name="chiSoNuocMoi">
        <InputNumber min={0} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Tạo hóa đơn cho phòng
      </Button>
    </Form>
  );
};
```

---

## 🔍 Xử lý Edge Cases

### **1. Phòng không có người ở (SoNguoiHienTai = 0)**

```json
// Response
{
  "success": false,
  "message": "Phòng không có người ở, không thể tạo hóa đơn"
}
```

### **2. Chia có số lẻ**

```
Ví dụ: 100,000 ÷ 3 = 33,333.33 VNĐ
→ Làm tròn: 33,333 VNĐ

Công thức: Math.Round(tienDien / soNguoi, 0)
```

### **3. Backward Compatibility**

```json
// Cách cũ vẫn hoạt động bình thường
{
  "tienDien": 26250,
  "tienNuoc": 33750,
  "chiaTheoPhong": false  // hoặc không truyền
}
// → Lưu nguyên 26250 và 33750
```

---

## ✅ Ưu điểm của cách này

1. ✅ **Không ảnh hưởng code cũ** - Backward compatible
2. ✅ **Linh hoạt** - Có thể chọn chia hoặc không
3. ✅ **Đơn giản** - Chỉ thêm 1 field boolean
4. ✅ **Logic đúng** - Chia ở backend (3-tier architecture)
5. ✅ **Dễ test** - Chỉ cần test 1 API

---

## 📝 Tóm tắt

| Trường hợp | ChiaTheoPhong | TienDien (Input) | TienDien (Lưu DB) |
|------------|---------------|------------------|-------------------|
| Cách cũ    | `false`       | 26,250 VNĐ       | 26,250 VNĐ        |
| Cách mới   | `true`        | 105,000 VNĐ      | 26,250 VNĐ        |

**Công thức:**
```
TienDienThucTe = ChiaTheoPhong 
                 ? TienDien / SoNguoiO 
                 : TienDien
```

---

**Ngày cập nhật:** 12/08/2026  
**Phiên bản:** 1.0
