// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.63.165.198:5001';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGNUP: '/signup',
  LOGIN: '/login',
  
  // OTP
  SEND_OTP: '/otp/send-otp',
  VERIFY_OTP: '/otp/verify-otp',
  SEND_RESET_OTP: '/otp/send-resetpassword-otp',
  VERIFY_RESET_OTP: '/otp/verify-resetpassword-otp',
  UPDATE_PASSWORD: '/otp/update-password',
  
  // Profile
  UPDATE_PROFILE: '/profile/update-profile',
  GET_PROFILE: '/profile/profile/:userId',
  
  // Notes
  UPLOAD_NOTE: '/notes/upload',
  GET_NOTES: '/notes',
  DOWNLOAD_NOTE: '/notes/download/:fileName',
  LIKE_NOTE: '/notes/like',
  GET_LIKE_STATUS: '/notes/like-status/:noteId/:userId',
  DELETE_NOTE: '/notes/delete/:noteId',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}, params?: Record<string, string>) => {
  const url = buildApiUrl(endpoint, params);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  return response;
};