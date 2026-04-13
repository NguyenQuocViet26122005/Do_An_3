import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminToaNha from './pages/Admin/AdminToaNha';
import AdminPhong from './pages/Admin/AdminPhong';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBaoCao from './pages/Admin/AdminBaoCao';
import CanBoDashboard from './pages/CanBo/CanBoDashboard';
import CanBoToaNha from './pages/CanBo/CanBoToaNha';
import CanBoPhong from './pages/CanBo/CanBoPhong';
import CanBoDangKy from './pages/CanBo/CanBoDangKy';
import CanBoHopDong from './pages/CanBo/CanBoHopDong';
import CanBoHoaDon from './pages/CanBo/CanBoHoaDon';
import CanBoViPham from './pages/CanBo/CanBoViPham';
import CanBoBaoTri from './pages/CanBo/CanBoBaoTri';
import CanBoThongBao from './pages/CanBo/CanBoThongBao';
import SinhVienDashboard from './pages/SinhVien/SinhVienDashboard';
import SinhVienPhong from './pages/SinhVien/SinhVienPhong';
import SinhVienDangKy from './pages/SinhVien/SinhVienDangKy';
import SinhVienHopDong from './pages/SinhVien/SinhVienHopDong';
import SinhVienHoaDon from './pages/SinhVien/SinhVienHoaDon';
import SinhVienViPham from './pages/SinhVien/SinhVienViPham';
import SinhVienBaoTri from './pages/SinhVien/SinhVienBaoTri';
import SinhVienThongBao from './pages/SinhVien/SinhVienThongBao';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/toanha" element={<ProtectedRoute allowedRoles={['Admin']}><AdminToaNha /></ProtectedRoute>} />
            <Route path="/admin/phong" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPhong /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/baocao" element={<ProtectedRoute allowedRoles={['Admin']}><AdminBaoCao /></ProtectedRoute>} />
            
            {/* CanBo Routes */}
            <Route path="/canbo/dashboard" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoDashboard /></ProtectedRoute>} />
            <Route path="/canbo/toanha" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoToaNha /></ProtectedRoute>} />
            <Route path="/canbo/phong" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoPhong /></ProtectedRoute>} />
            <Route path="/canbo/dangky" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoDangKy /></ProtectedRoute>} />
            <Route path="/canbo/hopdong" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoHopDong /></ProtectedRoute>} />
            <Route path="/canbo/hoadon" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoHoaDon /></ProtectedRoute>} />
            <Route path="/canbo/vipham" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoViPham /></ProtectedRoute>} />
            <Route path="/canbo/baotri" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoBaoTri /></ProtectedRoute>} />
            <Route path="/canbo/thongbao" element={<ProtectedRoute allowedRoles={['CanBo']}><CanBoThongBao /></ProtectedRoute>} />
            
            {/* SinhVien Routes */}
            <Route path="/sinhvien/dashboard" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienDashboard /></ProtectedRoute>} />
            <Route path="/sinhvien/phong" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienPhong /></ProtectedRoute>} />
            <Route path="/sinhvien/dangky" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienDangKy /></ProtectedRoute>} />
            <Route path="/sinhvien/hopdong" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienHopDong /></ProtectedRoute>} />
            <Route path="/sinhvien/hoadon" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienHoaDon /></ProtectedRoute>} />
            <Route path="/sinhvien/vipham" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienViPham /></ProtectedRoute>} />
            <Route path="/sinhvien/baotri" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienBaoTri /></ProtectedRoute>} />
            <Route path="/sinhvien/thongbao" element={<ProtectedRoute allowedRoles={['SinhVien']}><SinhVienThongBao /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
