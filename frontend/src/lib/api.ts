export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${API_BASE_URL}${endpoint}`;

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

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  return response;
};