// -----------------------------
// API BASE URL (SAFE)
// -----------------------------
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://13.63.165.198:5001';

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("⚠️ Using fallback API_BASE_URL. Set VITE_API_BASE_URL in Vercel!");
}


// -----------------------------
// API ENDPOINTS
// -----------------------------
export const API_ENDPOINTS = {
  // Auth
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


// -----------------------------
// BUILD FULL URL (FIXED)
// -----------------------------
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  let url = `${base}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
};


// -----------------------------
// API CALL WRAPPER (FIXED)
// -----------------------------
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
) => {
  const url = buildApiUrl(endpoint, params);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    // IMPORTANT: handle backend errors properly
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("❌ API Error:", data || response.statusText);
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };

  } catch (error) {
    console.error("❌ Network Error:", error);
    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
};