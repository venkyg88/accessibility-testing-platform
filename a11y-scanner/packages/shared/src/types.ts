import { z } from 'zod';

// Severity levels for accessibility issues
export enum IssueSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

// WCAG guidelines
export enum WCAGLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA',
}

// Issue categories
export enum IssueCategory {
  PERCEIVABLE = 'perceivable',
  OPERABLE = 'operable',
  UNDERSTANDABLE = 'understandable',
  ROBUST = 'robust',
}

// Platform types
export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

// Scan types
export enum ScanType {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
}

// Zod schemas for validation
export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.nativeEnum(IssueSeverity),
  category: z.nativeEnum(IssueCategory),
  wcagLevel: z.nativeEnum(WCAGLevel),
  wcagCriteria: z.string(),
  element: z.object({
    id: z.string().optional(),
    className: z.string().optional(),
    tagName: z.string().optional(),
    text: z.string().optional(),
    bounds: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    }),
  }),
  screenshot: z.string().optional(), // Base64 encoded image
  createdAt: z.date(),
});

export const RemediationStepSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  step: z.number(),
  title: z.string(),
  description: z.string(),
  codeExample: z.string().optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
});

export const A11yScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  perceivable: z.number().min(0).max(100),
  operable: z.number().min(0).max(100),
  understandable: z.number().min(0).max(100),
  robust: z.number().min(0).max(100),
  totalIssues: z.number(),
  criticalIssues: z.number(),
  highIssues: z.number(),
  mediumIssues: z.number(),
  lowIssues: z.number(),
});

export const ScanResultSchema = z.object({
  id: z.string(),
  appName: z.string(),
  appVersion: z.string().optional(),
  platform: z.nativeEnum(Platform),
  scanType: z.nativeEnum(ScanType),
  screenName: z.string(),
  screenshot: z.string(), // Base64 encoded image
  accessibilityTree: z.any(), // Platform-specific accessibility tree
  issues: z.array(IssueSchema),
  score: A11yScoreSchema,
  metadata: z.object({
    deviceInfo: z.object({
      model: z.string(),
      osVersion: z.string(),
      screenResolution: z.string(),
    }),
    scanDuration: z.number(), // milliseconds
    scannerVersion: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// TypeScript types inferred from Zod schemas
export type Issue = z.infer<typeof IssueSchema>;
export type RemediationStep = z.infer<typeof RemediationStepSchema>;
export type A11yScore = z.infer<typeof A11yScoreSchema>;
export type ScanResult = z.infer<typeof ScanResultSchema>;

// API request/response types
export interface CreateScanResultRequest {
  appName: string;
  appVersion?: string;
  platform: Platform;
  scanType: ScanType;
  screenName: string;
  screenshot: string;
  accessibilityTree: any;
  issues: Omit<Issue, 'id' | 'createdAt'>[];
  metadata: ScanResult['metadata'];
}

export interface GetScanResultsResponse {
  results: ScanResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScanMetrics {
  totalScreensScanned: number;
  totalIssues: number;
  issuesBySeverity: Record<IssueSeverity, number>;
  issuesByCategory: Record<IssueCategory, number>;
  averageScore: number;
  trendsOverTime: {
    date: string;
    scansCount: number;
    averageScore: number;
    issuesCount: number;
  }[];
}