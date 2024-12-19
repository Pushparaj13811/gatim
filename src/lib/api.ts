import { ApiError } from "./errors";
import { LoginInput, TranslationInput } from "./validation";

const API_BASE_URL = '/api';

interface TranslationResponse {
  translated_text: string;
  source_language?: string;
  target_language?: string;
}

interface LoginResponse {
  user: {
    username: string;
  };
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Request failed',
      response.status,
      data.code
    );
  }

  return data;
}

export const api = {
  login: async (credentials: LoginInput): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth_api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await handleResponse<LoginResponse>(response);
      console.log("From api.ts :: login response :: ",data);
      return { data };
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        throw new ApiError('Invalid credentials');
      }
      throw error;
    }
  },

  translateContent: async (params: TranslationInput): Promise<ApiResponse<TranslationResponse>> => {
    const token = getCookie('sessionid');
    console.log(token)
    if (!token) { 
      throw new ApiError('Authentication required');
    }

    try {
      console.log('Translating content', params);
      console.log('Token', token);
      const response = await fetch(`${API_BASE_URL}/api/translate_content/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  translateDocument: async (params: TranslationInput): Promise<ApiResponse<TranslationResponse>> => {
    const token = getCookie('csrftoken');
    if (!token) {
      throw new ApiError('Authentication required');
    }

    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/translate_content_web/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
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

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}