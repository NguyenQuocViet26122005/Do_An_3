# Hướng dẫn kết nối API cho tất cả pages

## ✅ Đã hoàn thành

### Backend API
- ✅ 10 modules API hoàn chỉnh
- ✅ Authentication với JWT
- ✅ Authorization theo vai trò

### Frontend Services
- ✅ `authService.ts` - Đăng nhập/Đăng ký
- ✅ `toaNhaService.ts` - Quản lý tòa nhà
- ✅ `phongService.ts` - Quản lý phòng
- ✅ `dangKyService.ts` - Đăng ký phòng
- ✅ `hopDongService.ts` - Quản lý hợp đồng
- ✅ `hoaDonService.ts` - Quản lý hóa đơn
- ✅ `viPhamService.ts` - Quản lý vi phạm
- ✅ `baoTriService.ts` - Quản lý bảo trì
- ✅ `thongBaoService.ts` - Quản lý thông báo
- ✅ `sinhVienService.ts` - Quản lý sinh viên

### Pages đã kết nối API
- ✅ `LoginPage.tsx` - Đăng nhập với API thật
- ✅ `RegisterPage.tsx` - Đăng ký với API thật
- ✅ `AdminToaNha.tsx` - Quản lý tòa nhà với API thật

### Đã xóa
- ✅ `mockData.ts` - Đã xóa hoàn toàn

---

## 📋 Cần làm tiếp

### Admin Pages (3 pages còn lại)
1. ❌ `AdminDashboard.tsx` - Cần kết nối API thống kê
2. ❌ `AdminPhong.tsx` - Cần kết nối `phongService`
3. ❌ `AdminUsers.tsx` - Cần kết nối `sinhVienService`

### CanBo Pages (9 pages)
1. ❌ `CanBoDashboard.tsx` - Cần kết nối API thống kê
2. ❌ `CanBoToaNha.tsx` - Cần kết nối `toaNhaService`
3. ❌ `CanBoPhong.tsx` - Cần kết nối `phongService`
4. ❌ `CanBoDangKy.tsx` - Cần kết nối `dangKyService`
5. ❌ `CanBoHopDong.tsx` - Cần kết nối `hopDongService`
6. ❌ `CanBoHoaDon.tsx` - Cần kết nối `hoaDonService`
7. ❌ `CanBoViPham.tsx` - Cần kết nối `viPhamService`
8. ❌ `CanBoBaoTri.tsx` - Cần kết nối `baoTriService`
9. ❌ `CanBoThongBao.tsx` - Cần kết nối `thongBaoService`
10. ❌ `CanBoBaoCao.tsx` - Cần kết nối API báo cáo

### SinhVien Pages (8 pages)
1. ❌ `SinhVienDashboard.tsx` - Cần kết nối API thống kê cá nhân
2. ❌ `SinhVienPhong.tsx` - Cần kết nối `phongService`
3. ❌ `SinhVienDangKy.tsx` - Cần kết nối `dangKyService`
4. ❌ `SinhVienHopDong.tsx` - Cần kết nối `hopDongService`
5. ❌ `SinhVienHoaDon.tsx` - Cần kết nối `hoaDonService`
6. ❌ `SinhVienViPham.tsx` - Cần kết nối `viPhamService`
7. ❌ `SinhVienBaoTri.tsx` - Cần kết nối `baoTriService`
8. ❌ `SinhVienThongBao.tsx` - Cần kết nối `thongBaoService`

---

## 🔧 Mẫu code chuẩn để kết nối API

### 1. Import services và types
```typescript
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import MainLayout from '../../components/Layout/MainLayout';
import serviceModule, { TypeName } from '../../services/serviceModule';
```

### 2. State management
```typescript
const [data, setData] = useState<TypeName[]>([]);
const [loading, setLoading] = useState(false);
const [modalVisible, setModalVisible] = useState(false);
const [editingRecord, setEditingRecord] = useState<TypeName | null>(null);
const [form] = Form.useForm();
```

### 3. Fetch data khi component mount
```typescript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await serviceModule.getAll();
    if (response.success) {
      setData(response.data);
    }
  } catch (error: any) {
    message.error('Không thể tải dữ liệu!');
  } finally {
    setLoading(false);
  }
};
```

### 4. CRUD operations
```typescript
// CREATE
const handleSubmit = async (values: any) => {
  try {
    if (editingRecord) {
      const response = await serviceModule.update(editingRecord.id, values);
      if (response.success) {
        message.success('Cập nhật thành công!');
        fetchData();
        setModalVisible(false);
      }
    } else {
      const response = await serviceModule.create(values);
      if (response.success) {
        message.success('Thêm mới thành công!');
        fetchData();
        setModalVisible(false);
      }
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Thao tác thất bại!');
  }
};

// DELETE
const handleDelete = async (id: number) => {
  try {
    const response = await serviceModule.delete(id);
    if (response.success) {
      message.success('Xóa thành công!');
      fetchData();
    }
  } catch (error: any) {
    message.error(error.response?.data?.message || 'Xóa thất bại!');
  }
};
```

### 5. Lọc dữ liệu theo vai trò (cho Sinh viên)
```typescript
// Trong SinhVien pages, cần lọc theo maSinhVien từ user context
import { useAuth } from '../../contexts/AuthContext';

const { user } = useAuth();

const fetchData = async () => {
  setLoading(true);
  try {
    // Lọc theo maSinhVien của user đang đăng nhập
    const response = await serviceModule.getAll(user?.maActor);
    if (response.success) {
      setData(response.data);
    }
  } catch (error: any) {
    message.error('Không thể tải dữ liệu!');
  } finally {
    setLoading(false);
  }
};
```

---

## 📝 Checklist cho mỗi page

Khi cập nhật mỗi page, cần làm các bước sau:

1. ✅ Import service tương ứng
2. ✅ Import types từ service
3. ✅ Thay đổi state từ mock data sang empty array
4. ✅ Thêm useEffect để fetch data khi mount
5. ✅ Cập nhật handleSubmit để gọi API create/update
6. ✅ Cập nhật handleDelete để gọi API delete
7. ✅ Thêm error handling với try-catch
8. ✅ Thêm loading state
9. ✅ Wrap component trong MainLayout (nếu chưa có)
10. ✅ Test tất cả chức năng CRUD

---

## 🎯 Ưu tiên thực hiện

### Giai đoạn 1: Các chức năng cơ bản (Ưu tiên cao)
1. AdminPhong, CanBoPhong, SinhVienPhong
2. CanBoDangKy, SinhVienDangKy
3. CanBoHopDong, SinhVienHopDong

### Giai đoạn 2: Quản lý tài chính
4. CanBoHoaDon, SinhVienHoaDon
5. CanBoViPham, SinhVienViPham

### Giai đoạn 3: Hỗ trợ và thông báo
6. CanBoBaoTri, SinhVienBaoTri
7. CanBoThongBao, SinhVienThongBao

### Giai đoạn 4: Dashboard và báo cáo
8. AdminDashboard, CanBoDashboard, SinhVienDashboard
9. CanBoBaoCao
10. AdminUsers

---

## 🚀 Lưu ý quan trọng

### API Response Format
Tất cả API đều trả về format:
```typescript
{
  success: boolean;
  message: string;
  data: T | T[];
}
```

### Error Handling
```typescript
try {
  const response = await service.method();
  if (response.success) {
    // Xử lý thành công
  }
} catch (error: any) {
  message.error(error.response?.data?.message || 'Lỗi mặc định');
}
```

### Authorization
- API tự động lấy token từ localStorage
- API tự động redirect về /login nếu 401
- Không cần xử lý auth trong component

### Date Format
- Backend trả về: ISO string
- Frontend hiển thị: Format với dayjs
```typescript
import dayjs from 'dayjs';
dayjs(date).format('DD/MM/YYYY')
```

---

## 📊 Tiến độ

- **Hoàn thành**: 3/22 pages (14%)
- **Còn lại**: 19/22 pages (86%)
- **Services**: 10/10 (100%)
- **Backend API**: 10/10 (100%)

---

**Cập nhật lần cuối**: 29/04/2026
