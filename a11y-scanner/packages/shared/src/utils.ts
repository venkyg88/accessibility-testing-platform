import { Issue, A11yScore, IssueSeverity, IssueCategory } from './types';

/**
 * Calculate accessibility score based on issues found
 */
export function calculateA11yScore(issues: Issue[]): A11yScore {
  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL).length;
  const highIssues = issues.filter(i => i.severity === IssueSeverity.HIGH).length;
  const mediumIssues = issues.filter(i => i.severity === IssueSeverity.MEDIUM).length;
  const lowIssues = issues.filter(i => i.severity === IssueSeverity.LOW).length;

  // Weight different severity levels
  const severityWeights = {
    [IssueSeverity.CRITICAL]: 10,
    [IssueSeverity.HIGH]: 7,
    [IssueSeverity.MEDIUM]: 4,
    [IssueSeverity.LOW]: 2,
    [IssueSeverity.INFO]: 1,
  };

  const totalWeight = issues.reduce((sum, issue) => {
    return sum + severityWeights[issue.severity];
  }, 0);

  // Calculate overall score (0-100, where 100 is perfect)
  const maxPossibleWeight = 100; // Arbitrary baseline
  const overall = Math.max(0, Math.min(100, 100 - (totalWeight / maxPossibleWeight) * 100));

  // Calculate category-specific scores
  const categoryIssues = {
    [IssueCategory.PERCEIVABLE]: issues.filter(i => i.category === IssueCategory.PERCEIVABLE),
    [IssueCategory.OPERABLE]: issues.filter(i => i.category === IssueCategory.OPERABLE),
    [IssueCategory.UNDERSTANDABLE]: issues.filter(i => i.category === IssueCategory.UNDERSTANDABLE),
    [IssueCategory.ROBUST]: issues.filter(i => i.category === IssueCategory.ROBUST),
  };

  const calculateCategoryScore = (categoryIssues: Issue[]): number => {
    if (categoryIssues.length === 0) return 100;
    const categoryWeight = categoryIssues.reduce((sum, issue) => {
      return sum + severityWeights[issue.severity];
    }, 0);
    return Math.max(0, Math.min(100, 100 - (categoryWeight / 25) * 100));
  };

  return {
    overall: Math.round(overall),
    perceivable: Math.round(calculateCategoryScore(categoryIssues[IssueCategory.PERCEIVABLE])),
    operable: Math.round(calculateCategoryScore(categoryIssues[IssueCategory.OPERABLE])),
    understandable: Math.round(calculateCategoryScore(categoryIssues[IssueCategory.UNDERSTANDABLE])),
    robust: Math.round(calculateCategoryScore(categoryIssues[IssueCategory.ROBUST])),
    totalIssues,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
  };
}

/**
 * Generate a unique ID for scan results
 */
export function generateScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique ID for issues
 */
export function generateIssueId(): string {
  return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: IssueSeverity): string {
  switch (severity) {
    case IssueSeverity.CRITICAL:
      return '#dc2626'; // red-600
    case IssueSeverity.HIGH:
      return '#ea580c'; // orange-600
    case IssueSeverity.MEDIUM:
      return '#d97706'; // amber-600
    case IssueSeverity.LOW:
      return '#65a30d'; // lime-600
    case IssueSeverity.INFO:
      return '#0284c7'; // sky-600
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get score color based on score value
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return '#16a34a'; // green-600
  if (score >= 70) return '#65a30d'; // lime-600
  if (score >= 50) return '#d97706'; // amber-600
  if (score >= 30) return '#ea580c'; // orange-600
  return '#dc2626'; // red-600
}

/**
 * Validate base64 image string
 */
export function isValidBase64Image(str: string): boolean {
  try {
    // Check if it's a valid base64 string with image data URL format
    const regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
    return regex.test(str);
  } catch {
    return false;
  }
}

/**
 * Convert accessibility tree to readable format
 */
export function formatAccessibilityTree(tree: any, platform: string): string {
  // This is a simplified version - in practice, you'd want more sophisticated formatting
  // based on the platform-specific accessibility tree structure
  try {
    return JSON.stringify(tree, null, 2);
  } catch {
    return 'Unable to format accessibility tree';
  }
}