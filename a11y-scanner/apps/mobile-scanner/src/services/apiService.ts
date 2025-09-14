import axios from 'axios';
import {
  ScanResult,
  ScanMetrics,
  GetScanResultsResponse,
  CreateScanResultRequest,
} from '@a11y-scanner/shared';

// In a real app, this would come from environment variables or config
const API_BASE_URL = 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
    );
  },
);

export const apiService = {
  // Scan Results
  async getScanResults(params?: {
    page?: number;
    limit?: number;
    appName?: string;
    platform?: string;
    scanType?: string;
  }): Promise<GetScanResultsResponse> {
    const response = await apiClient.get('/scan-results', {params});
    return response.data.data;
  },

  async getScanResult(id: string): Promise<ScanResult> {
    const response = await apiClient.get(`/scan-results/${id}`);
    return response.data.data;
  },

  async createScanResult(data: CreateScanResultRequest): Promise<ScanResult> {
    const response = await apiClient.post('/scan-results', data);
    return response.data.data;
  },

  async deleteScanResult(id: string): Promise<void> {
    await apiClient.delete(`/scan-results/${id}`);
  },

  // Metrics
  async getMetrics(params?: {
    days?: number;
    appName?: string;
    platform?: string;
  }): Promise<ScanMetrics> {
    const response = await apiClient.get('/metrics', {params});
    return response.data.data;
  },

  async getApps(): Promise<
    Array<{
      appName: string;
      platform: string;
      scansCount: number;
      averageScore: number;
    }>
  > {
    const response = await apiClient.get('/metrics/apps');
    return response.data.data;
  },
};