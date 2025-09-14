import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiResponse } from "../types";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error("Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      message: error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", "),
    });
  }

  // Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          error: "Conflict",
          message: "A record with this data already exists",
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          error: "Not found",
          message: "The requested record was not found",
        });
      default:
        return res.status(500).json({
          success: false,
          error: "Database error",
          message: "An error occurred while accessing the database",
        });
    }
  }

  // Default error
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
};
