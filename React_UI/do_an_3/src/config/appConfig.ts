// =============================================
// CẤU HÌNH ỨNG DỤNG
// =============================================

export const APP_CONFIG = {
  // Bật/tắt chế độ offline (sử dụng mock data)
  USE_MOCK_DATA: false, // false = kết nối backend API thực
  
  // API URL
  API_BASE_URL: 'https://localhost:44359/api',
  
  // Thông tin ứng dụng
  APP_NAME: 'Hệ thống quản lý KTX',
  APP_VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export default APP_CONFIG;
