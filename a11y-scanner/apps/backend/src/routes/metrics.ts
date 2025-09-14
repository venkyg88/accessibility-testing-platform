import { Router } from "express";
import { z } from "zod";
import {
  IssueSeverity,
  IssueCategory,
  ScanMetrics,
} from "@a11y-scanner/shared";
import { validateQuery } from "../middleware/validation";

const router = Router();

// Validation schemas
const MetricsQuerySchema = z.object({
  days: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("30"),
  appName: z.string().optional(),
  platform: z.enum(["ios", "android", "web"]).optional(),
});

// GET /api/metrics - Get scan metrics and analytics
router.get("/", async (req, res, next) => {
  try {
    // Minimal test version
    const metrics = {
      totalScreensScanned: 10,
      totalIssues: 5,
      issuesBySeverity: {
        critical: 1,
        high: 2,
        medium: 1,
        low: 1,
        info: 0,
      },
      issuesByCategory: {
        perceivable: 2,
        operable: 2,
        understandable: 1,
        robust: 0,
      },
      averageScore: 85,
      trendsOverTime: [],
    };

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/metrics/apps - Get list of apps with their metrics
router.get("/apps", async (req, res, next) => {
  try {
    // Minimal test version
    const formattedApps = [
      {
        appName: "TestApp",
        platform: "android",
        scansCount: 5,
        averageScore: 85,
      },
      {
        appName: "MyApp",
        platform: "ios",
        scansCount: 3,
        averageScore: 92,
      },
    ];

    res.json({
      success: true,
      data: formattedApps,
    });
  } catch (error) {
    next(error);
  }
});

export { router as metricsRouter };
