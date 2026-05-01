using System;

namespace Api_Gateway.Tools
{
    /// <summary>
    /// Tool để generate BCrypt hash cho mật khẩu
    /// Chạy: dotnet run --project Api_Gateway hash-password 123456
    /// </summary>
    public class PasswordHasher
    {
        public static void Main(string[] args)
        {
            if (args.Length > 0 && args[0] == "hash-password")
            {
                string password = args.Length > 1 ? args[1] : "123456";
                string hashed = BCrypt.Net.BCrypt.HashPassword(password);
                
                Console.WriteLine("===========================================");
                Console.WriteLine("PASSWORD HASH GENERATOR");
                Console.WriteLine("===========================================");
                Console.WriteLine($"Password: {password}");
                Console.WriteLine($"Hashed:   {hashed}");
                Console.WriteLine("===========================================");
                Console.WriteLine("\nSQL Update Command:");
                Console.WriteLine($"UPDATE TaiKhoan SET MatKhau = '{hashed}' WHERE TenDangNhap = 'admin';");
                Console.WriteLine("===========================================");
            }
            else
            {
                Console.WriteLine("Usage: dotnet run hash-password <password>");
                Console.WriteLine("Example: dotnet run hash-password 123456");
            }
        }
    }
}
