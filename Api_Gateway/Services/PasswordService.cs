namespace Api_Gateway.Services
{
    public class PasswordService
    {
        public string HashPassword(string password)
        {
            // Lưu plain text, không mã hóa
            return password;
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            // So sánh trực tiếp
            return password == hashedPassword;
        }
    }
}
