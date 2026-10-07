import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data;
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      throw new ApiError(error.response.status, message || error.message);
    }
    if (error.request) {
      throw new ApiError(0, 'No se pudo conectar con el servidor');
    }
    throw new ApiError(0, error.message);
  },
);

export interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, string>;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...rest } = options;

  const config: AxiosRequestConfig = {
    ...rest,
    params,
  };

  const response: AxiosResponse<T> = await apiClient.request<T>({
    url: path,
    ...config,
  });

  return response.data;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`API Error ${status}: ${body}`);
    this.name = 'ApiError';
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isValidationError(): boolean {
    return this.status === 400;
  }
}
