import { Router } from "express";
import { z } from "zod";
import {
  CreateScanResultRequest,
  ScanResultSchema,
  calculateA11yScore,
  generateScanId,
  generateIssueId,
} from "@a11y-scanner/shared";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import { ApiResponse, PaginationParams } from "../types";

const router = Router();

// Validation schemas
const CreateScanResultSchema = z.object({
  appName: z.string().min(1),
  appVersion: z.string().optional(),
  platform: z.enum(["ios", "android", "web"]),
  scanType: z.enum(["manual", "automated"]),
  screenName: z.string().min(1),
  screenshot: z.string().min(1), // Base64 encoded image
  accessibilityTree: z.any(),
  issues: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      category: z.enum(["perceivable", "operable", "understandable", "robust"]),
      wcagLevel: z.enum(["A", "AA", "AAA"]),
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
      screenshot: z.string().optional(),
    })
  ),
  metadata: z.object({
    deviceInfo: z.object({
      model: z.string(),
      osVersion: z.string(),
      screenResolution: z.string(),
    }),
    scanDuration: z.number(),
    scannerVersion: z.string(),
  }),
});

const GetScanResultsQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("10"),
  appName: z.string().optional(),
  platform: z.enum(["ios", "android", "web"]).optional(),
  scanType: z.enum(["manual", "automated"]).optional(),
});

const ScanResultParamsSchema = z.object({
  id: z.string(),
});

// POST /api/scan-results - Create a new scan result
router.post(
  "/",
  validateBody(CreateScanResultSchema),
  async (req, res, next) => {
    try {
      const data: CreateScanResultRequest = req.body;
      const scanId = generateScanId();

      // Generate IDs for issues and calculate score
      const issuesWithIds = data.issues.map((issue: any) => ({
        ...issue,
        id: generateIssueId(),
        createdAt: new Date(),
      }));

      const score = calculateA11yScore(issuesWithIds);

      // Create scan result with issues and score
      const scanResult = await req.prisma.scanResult.create({
        data: {
          id: scanId,
          appName: data.appName,
          appVersion: data.appVersion,
          platform: data.platform,
          scanType: data.scanType,
          screenName: data.screenName,
          screenshot: data.screenshot,
          accessibilityTree: data.accessibilityTree,
          metadata: data.metadata,
          issues: {
            create: issuesWithIds.map((issue: any) => ({
              id: issue.id,
              title: issue.title,
              description: issue.description,
              severity: issue.severity,
              category: issue.category,
              wcagLevel: issue.wcagLevel,
              wcagCriteria: issue.wcagCriteria,
              element: issue.element,
              screenshot: issue.screenshot,
            })),
          },
          score: {
            create: {
              overall: score.overall,
              perceivable: score.perceivable,
              operable: score.operable,
              understandable: score.understandable,
              robust: score.robust,
              totalIssues: score.totalIssues,
              criticalIssues: score.criticalIssues,
              highIssues: score.highIssues,
              mediumIssues: score.mediumIssues,
              lowIssues: score.lowIssues,
            },
          },
        },
        include: {
          issues: true,
          score: true,
        },
      });

      res.status(201).json({
        success: true,
        data: scanResult,
        message: "Scan result created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/scan-results - Get scan results with pagination and filtering
router.get(
  "/",
  validateQuery(GetScanResultsQuerySchema),
  async (req, res, next) => {
    try {
      const { page, limit, appName, platform, scanType } = req.query as any;
      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (appName) where.appName = { contains: appName, mode: "insensitive" };
      if (platform) where.platform = platform;
      if (scanType) where.scanType = scanType;

      // Get total count
      const total = await req.prisma.scanResult.count({ where });

      // Get scan results
      const results = await req.prisma.scanResult.findMany({
        where,
        include: {
          issues: true,
          score: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      });

      res.json({
        success: true,
        data: {
          results,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/scan-results/:id - Get a specific scan result
router.get(
  "/:id",
  validateParams(ScanResultParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const scanResult = await req.prisma.scanResult.findUnique({
        where: { id },
        include: {
          issues: {
            include: {
              remediationSteps: true,
            },
          },
          score: true,
        },
      });

      if (!scanResult) {
        return res.status(404).json({
          success: false,
          error: "Not found",
          message: "Scan result not found",
        });
      }

      res.json({
        success: true,
        data: scanResult,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/scan-results/:id - Delete a scan result
router.delete(
  "/:id",
  validateParams(ScanResultParamsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      await req.prisma.scanResult.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Scan result deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as scanResultsRouter };
