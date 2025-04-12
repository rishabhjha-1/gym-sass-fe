import axiosInstance from './axios';

class BaseService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await axiosInstance.get<T>(`${this.baseUrl}${endpoint}`, { params });
    return response.data;
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await axiosInstance.post<T>(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await axiosInstance.put<T>(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await axiosInstance.delete<T>(`${this.baseUrl}${endpoint}`);
    return response.data;
  }
}

export default BaseService; 