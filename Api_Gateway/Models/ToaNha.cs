using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("ToaNha")]
    public class ToaNha
    {
        [Key]
        public int MaToaNha { get; set; }

        [Required]
        [StringLength(10)]
        public string MaToa { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string TenToaNha { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string LoaiToaNha { get; set; } = string.Empty; // Nam, Nu

        [Required]
        public int SoTang { get; set; }

        [StringLength(20)]
        public string TrangThai { get; set; } = "HoatDong";

        public int? MaCanBoQuanLy { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaCanBoQuanLy")]
        public virtual CanBoKTX? CanBoQuanLy { get; set; }

        public virtual ICollection<Phong> Phong { get; set; } = new List<Phong>();
    }
}
