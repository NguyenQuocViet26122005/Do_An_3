# Hệ thống quản lý ký túc xá sinh viên

Hệ thống quản lý ký túc xá sinh viên được xây dựng nhằm hỗ trợ quản lý thông tin phòng ở, sinh viên, hợp đồng và các khoản phí một cách hiệu quả. Thay vì quản lý thủ công, hệ thống giúp tự động hóa toàn bộ quy trình, giảm sai sót và tiết kiệm thời gian cho cả sinh viên và cán bộ quản lý.

## Giới thiệu

Dự án xây dựng website quản lý ký túc xá với đầy đủ các chức năng từ đăng ký phòng, quản lý hợp đồng, thanh toán hóa đơn đến quản lý vi phạm và bảo trì. Hệ thống hỗ trợ 3 vai trò chính: Admin, Cán bộ quản lý và Sinh viên, mỗi vai trò có quyền hạn và chức năng riêng phù hợp với công việc.

## Mục tiêu

Hệ thống được thiết kế để giải quyết các vấn đề trong quản lý ký túc xá truyền thống:

- Quản lý toàn bộ hoạt động ký túc xá trên nền tảng web
- Tự động hóa quy trình đăng ký phòng và duyệt đơn theo độ ưu tiên
- Hỗ trợ sinh viên đăng ký phòng online và theo dõi thông tin
- Giúp cán bộ quản lý kiểm soát phòng, giường và hợp đồng hiệu quả
- Tự động tạo hóa đơn và hỗ trợ thanh toán online
- Cung cấp công cụ thống kê và báo cáo chi tiết

## Đối tượng sử dụng  

Hệ thống phục vụ 3 nhóm đối tượng chính:

**Sinh viên**: Đăng ký phòng, xem hợp đồng, thanh toán hóa đơn, nhận thông báo, báo cáo sự cố

**Cán bộ quản lý**: Duyệt đăng ký, quản lý phòng/sinh viên, tạo hợp đồng, quản lý hóa đơn, ghi nhận vi phạm, xử lý bảo trì

**Quản trị viên**: Quản lý tài khoản, phân quyền, quản lý tòa nhà, cấu hình hệ thống, xem báo cáo tổng hợp

## Phân tích hệ thống

### Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình 3 lớp (3-tier architecture):

- **Presentation Layer**: Giao diện người dùng được xây dựng bằng ReactJS với Ant Design, hỗ trợ responsive trên mọi thiết bị
- **Business Logic Layer**: API Gateway và các service được phát triển bằng .NET 8, xử lý logic nghiệp vụ và phân quyền
- **Data Access Layer**: SQL Server lưu trữ dữ liệu với 20 bảng được thiết kế tối ưu

### Cơ sở dữ liệu

Database gồm 20 bảng được chia thành 10 nhóm chức năng chính:

**Quản lý tài khoản**: VaiTro, TaiKhoan - Xác thực và phân quyền người dùng

**Quản lý tòa nhà**: ToaNha, Tang, LoaiPhong, Phong, Giuong - Cấu trúc phân cấp 4 tầng quản lý cơ sở vật chất

**Quản lý sinh viên**: SinhVien - Lưu trữ thông tin cá nhân, học tập và điểm ưu tiên

**Quản lý đăng ký**: HocKy, DangKyPhong - Xử lý đăng ký phòng theo học kỳ với hỗ trợ tự động duyệt

**Quản lý hợp đồng**: HopDong - Quản lý hợp đồng thuê phòng từ tạo đến chấm dứt

**Quản lý hóa đơn**: HoaDon, ThanhToan, ChiSoDienNuoc - Tự động tạo hóa đơn và xử lý thanh toán

**Quản lý vi phạm**: LoaiViPham, ViPham - Ghi nhận và xử lý vi phạm nội quy

**Quản lý thông báo**: ThongBao, ThongBaoCaNhan - Hệ thống thông báo đa kênh

**Quản lý bảo trì**: YeuCauBaoTri - Tiếp nhận và xử lý yêu cầu sửa chữa

**Cấu hình**: CauHinh - Lưu trữ các tham số hệ thống

### Chức năng chính

Hệ thống cung cấp hơn 50 chức năng được phân chia theo module:

**Module đăng ký phòng**: Sinh viên xem phòng trống, đăng ký online, hệ thống tự động tính điểm ưu tiên dựa trên khoảng cách từ nhà, điểm trung bình, học bổng, hoàn cảnh khó khăn. Cán bộ có thể duyệt tự động theo tiêu chí hoặc duyệt thủ công, phân phòng theo độ ưu tiên.

**Module hợp đồng**: Tự động tạo hợp đồng sau khi duyệt đăng ký, hỗ trợ ký điện tử, in PDF, gia hạn và chấm dứt hợp đồng với đầy đủ lịch sử.

**Module hóa đơn**: Tự động tạo hóa đơn hàng tháng bao gồm tiền phòng, điện, nước, dịch vụ và phí phạt. Hỗ trợ thanh toán online qua VNPay, Momo hoặc thanh toán tại quầy. Tự động nhắc nhở và tính phí trễ hạn.

**Module vi phạm**: Cán bộ ghi nhận vi phạm với mức độ và mức phạt tương ứng. Hệ thống tự động cảnh báo khi vi phạm nhiều lần và đề xuất chấm dứt hợp đồng nếu vi phạm nặng.

**Module thông báo**: Gửi thông báo theo đối tượng (tất cả, tòa nhà, tầng, phòng, cá nhân) với độ ưu tiên khác nhau. Tự động gửi thông báo khi có sự kiện quan trọng.

**Module bảo trì**: Sinh viên báo cáo sự cố, cán bộ tiếp nhận, phân công xử lý và theo dõi tiến độ. Ghi nhận chi phí và lịch sử bảo trì.

**Module thống kê**: Dashboard tổng quan với biểu đồ trực quan. Báo cáo chi tiết về tòa nhà, sinh viên, doanh thu, vi phạm, điện nước. Xuất báo cáo Excel và PDF.

### Tính năng nổi bật

**Tự động hóa thông minh**: Hệ thống tự động duyệt đăng ký theo tiêu chí, tự động tạo hợp đồng, tự động tạo hóa đơn hàng tháng, tự động tính tiền điện nước, tự động nhắc thanh toán và gửi thông báo.

**Phân phòng theo độ ưu tiên**: Tính điểm ưu tiên dựa trên nhiều yếu tố (khoảng cách, học lực, hoàn cảnh) và tự động phân phòng công bằng cho sinh viên có độ ưu tiên cao.

**Thanh toán linh hoạt**: Hỗ trợ nhiều phương thức thanh toán online (VNPay, Momo, Banking) và thanh toán tại quầy với xác nhận từ cán bộ.

**Quản lý toàn diện**: Từ đăng ký, hợp đồng, hóa đơn, vi phạm đến bảo trì, tất cả được quản lý tập trung với lịch sử đầy đủ.

**Báo cáo chi tiết**: Dashboard trực quan với biểu đồ, báo cáo đa dạng theo nhiều tiêu chí, xuất dữ liệu dễ dàng.

### Quy trình nghiệp vụ chính

**Quy trình đăng ký phòng**:
1. Sinh viên đăng nhập và xem danh sách phòng trống
2. Chọn phòng và đăng ký online
3. Hệ thống tính điểm ưu tiên tự động
4. Kiểm tra điều kiện tự động duyệt (điểm TB >= 3.0, không vi phạm nặng)
5. Nếu đạt điều kiện thì tự động duyệt, nếu không thì chuyển cán bộ duyệt thủ công
6. Sau khi duyệt, tự động tạo hợp đồng và gán giường cho sinh viên
7. Gửi thông báo kết quả cho sinh viên

**Quy trình tạo hóa đơn**:
1. Đầu tháng, hệ thống lấy danh sách hợp đồng đang hiệu lực
2. Với mỗi hợp đồng, tính các khoản phí: tiền phòng từ hợp đồng, tiền điện nước từ chỉ số, phí dịch vụ từ cấu hình, phí phạt từ vi phạm
3. Tạo hóa đơn với tổng tiền và hạn thanh toán
4. Gửi thông báo hóa đơn mới cho sinh viên
5. Trước 3 ngày đến hạn, gửi nhắc nhở thanh toán
6. Sau khi quá hạn, tự động tính phí trễ hạn

**Quy trình thanh toán**:
1. Sinh viên xem hóa đơn cần thanh toán
2. Chọn phương thức thanh toán (online hoặc tại quầy)
3. Nếu thanh toán online, chuyển sang cổng thanh toán và nhận kết quả callback
4. Nếu thanh toán tại quầy, cán bộ xác nhận và tạo biên lai
5. Cập nhật trạng thái hóa đơn thành đã thanh toán
6. Gửi biên lai cho sinh viên

## Công nghệ sử dụng

**Frontend**: ReactJS 19, Vite, TypeScript, Ant Design, Axios, React Router

**Backend**: .NET 8, ASP.NET Core Web API, Entity Framework Core, JWT Authentication

**Database**: SQL Server với 20 bảng được thiết kế tối ưu, có indexes và foreign keys đầy đủ

**Thanh toán**: Tích hợp VNPay, Momo, Banking API

**Deployment**: Docker, Azure/AWS (planned)

## Yêu cầu hệ thống

**Development**:
- Node.js 18+
- .NET 8 SDK
- SQL Server 2019+
- Visual Studio 2022 hoặc VS Code

**Production**:
- Windows Server hoặc Linux
- SQL Server 2019+
- IIS hoặc Nginx
- 4GB RAM minimum

## Cài đặt và chạy

**Cài đặt Database**:
```bash
# Chạy script tạo database
sqlcmd -S localhost -i Database_Simple.sql
```

**Chạy Backend**:
```bash
cd Api_Gateway
dotnet restore
dotnet run
```

**Chạy Frontend**:
```bash
cd React_UI/do_an_3
npm install
npm run dev
```

## Cấu trúc thư mục

```
Do_An_3/
├── Api_Gateway/              # Backend .NET API
│   ├── Controllers/          # API Controllers
│   ├── Models/              # Data Models
│   ├── Services/            # Business Logic
│   └── Program.cs           # Entry point
├── React_UI/do_an_3/        # Frontend React
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── pages/          # Pages
│   │   ├── services/       # API Services
│   │   └── App.tsx         # Main App
│   └── package.json
├── Database_Simple.sql      # Database Schema
├── TaiLieu_CSDL.md         # Database Documentation
└── README.md
```

## Tác giả

Dự án được phát triển bởi nhóm sinh viên khoa Công nghệ Thông tin.

## Giấy phép

MIT License - Xem file LICENSE.txt để biết thêm chi tiết.

