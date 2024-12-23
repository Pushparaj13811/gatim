import { ApiError } from "./errors";
import { LoginInput, TranslationInput } from "./validation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Constants for storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface TranslationResponse {
  translated_content: string;
  from_language?: string;
  to_language?: string;
}

interface LoginResponse {
  user: {
    username: string;
  };
  tokens: {
    access: string;
    refresh: string;
  }
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

// In-memory token storage
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Token management functions
export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  if (!refreshToken) {
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return refreshToken;
};

export const setRefreshToken = (token: string): void => {
  refreshToken = token;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
async function refreshAccessToken(): Promise<void> {
  const token = getRefreshToken();

  if (!token) {
    clearTokens();
    throw new ApiError('No refresh token available. Please login again.', 401);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/web_token_refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      clearTokens();
      throw new ApiError('Unable to refresh access token', response.status);
    }

    const data = await response.json();
    setAccessToken(data.access_token);
  } catch (error) {
    clearTokens();
    throw new ApiError(`Session expired. Please login again. ${error}`, 401);
  }
}

async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
  const token = getAccessToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await refreshAccessToken();
      
      const newToken = getAccessToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(url, { ...options, headers });
      }
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 500);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status, data.code);
  }

  return data;
}

export const api = {
  login: async (credentials: LoginInput): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/web_login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await handleResponse<LoginResponse>(response);

      // Store both tokens
      setAccessToken(data.tokens.access);
      setRefreshToken(data.tokens.refresh);

      return { data };
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        throw new ApiError('Invalid credentials');
      }
      throw error;
    }
  },

  translateDocument: async (params: TranslationInput): Promise<ApiResponse<TranslationResponse>> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/translate_content/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(params),
      });

      const data = await handleResponse<TranslationResponse>(response);
      return { data };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new ApiError('Session expired. Please login again.');
      }
      throw error;
    }
  },

  translateContent: async (params: TranslationInput): Promise<ApiResponse<TranslationResponse>> => {
    const formData = new FormData();
    
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/translate_content/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });

      const data = await handleResponse<TranslationResponse>(response);
      return { data };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new ApiError('Session expired. Please login again.');
      }
      throw error;
    }
  },
};