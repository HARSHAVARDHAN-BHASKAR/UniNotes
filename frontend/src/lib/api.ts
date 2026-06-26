export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("❌ Missing VITE_API_BASE_URL in environment variables");
}

export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const base = API_BASE_URL?.replace(/\/$/, '');
  let url = `${base}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
) => {
  const url = buildApiUrl(endpoint, params);

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
};