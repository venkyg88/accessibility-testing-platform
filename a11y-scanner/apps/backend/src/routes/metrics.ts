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
router.get("/", validateQuery(MetricsQuerySchema), async (req, res, next) => {
  try {
    const { days, appName, platform } = req.query as any;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build where clause
    const where: any = {
      createdAt: {
        gte: startDate,
      },
    };
    if (appName) where.appName = { contains: appName, mode: "insensitive" };
    if (platform) where.platform = platform;

    // Get total screens scanned
    const totalScreensScanned = await req.prisma.scanResult.count({ where });

    // Get total issues
    const totalIssues = await req.prisma.issue.count({
      where: {
        scanResult: where,
      },
    });

    // Get issues by severity
    const issuesBySeverityRaw = await req.prisma.issue.groupBy({
      by: ["severity"],
      _count: {
        severity: true,
      },
      where: {
        scanResult: where,
      },
    });

    const issuesBySeverity: Record<IssueSeverity, number> = {
      [IssueSeverity.CRITICAL]: 0,
      [IssueSeverity.HIGH]: 0,
      [IssueSeverity.MEDIUM]: 0,
      [IssueSeverity.LOW]: 0,
      [IssueSeverity.INFO]: 0,
    };

    issuesBySeverityRaw.forEach((item: any) => {
      issuesBySeverity[item.severity as IssueSeverity] = item._count.severity;
    });

    // Get issues by category
    const issuesByCategoryRaw = await req.prisma.issue.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      where: {
        scanResult: where,
      },
    });

    const issuesByCategory: Record<IssueCategory, number> = {
      [IssueCategory.PERCEIVABLE]: 0,
      [IssueCategory.OPERABLE]: 0,
      [IssueCategory.UNDERSTANDABLE]: 0,
      [IssueCategory.ROBUST]: 0,
    };

    issuesByCategoryRaw.forEach((item: any) => {
      issuesByCategory[item.category as IssueCategory] = item._count.category;
    });

    // Get average score
    const averageScoreResult = await req.prisma.a11yScore.aggregate({
      _avg: {
        overall: true,
      },
      where: {
        scanResult: where,
      },
    });

    const averageScore = averageScoreResult._avg.overall || 0;

    // Get trends over time (daily aggregation)
    const trendsOverTime = (await req.prisma.$queryRaw`
      SELECT 
        DATE(sr.created_at) as date,
        COUNT(sr.id)::int as scans_count,
        COALESCE(AVG(sc.overall), 0)::int as average_score,
        COUNT(i.id)::int as issues_count
      FROM scan_results sr
      LEFT JOIN a11y_scores sc ON sr.id = sc.scan_result_id
      LEFT JOIN issues i ON sr.id = i.scan_result_id
      WHERE sr.created_at >= ${startDate}
        ${appName ? `AND sr.app_name ILIKE '%${appName}%'` : ""}
        ${platform ? `AND sr.platform = '${platform}'` : ""}
      GROUP BY DATE(sr.created_at)
      ORDER BY DATE(sr.created_at) DESC
      LIMIT 30
    `) as any[];

    const formattedTrends = trendsOverTime.map((trend) => ({
      date: trend.date.toISOString().split("T")[0],
      scansCount: trend.scans_count,
      averageScore: trend.average_score,
      issuesCount: trend.issues_count,
    }));

    const metrics: ScanMetrics = {
      totalScreensScanned,
      totalIssues,
      issuesBySeverity,
      issuesByCategory,
      averageScore: Math.round(averageScore),
      trendsOverTime: formattedTrends,
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
    // First get the grouped scan counts
    const apps = await req.prisma.scanResult.groupBy({
      by: ["appName", "platform"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Then get average scores for each app/platform combination
    const formattedApps = await Promise.all(
      apps.map(async (app: any) => {
        const averageScoreResult = await req.prisma.a11yScore.aggregate({
          _avg: {
            overall: true,
          },
          where: {
            scanResult: {
              appName: app.appName,
              platform: app.platform,
            },
          },
        });

        return {
          appName: app.appName,
          platform: app.platform,
          scansCount: app._count.id,
          averageScore: Math.round(averageScoreResult._avg.overall || 0),
        };
      })
    );

    res.json({
      success: true,
      data: formattedApps,
    });
  } catch (error) {
    next(error);
  }
});

export { router as metricsRouter };
