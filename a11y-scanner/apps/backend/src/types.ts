import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}