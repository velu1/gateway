import { Request, Response, NextFunction } from "express";
import redisClient from "../proxy/redisClient"; // adjust path as needed

export const resolveTenant = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const tenantCode =
      req.headers["x-tenant-code"] || req.query?.code || req.body?.code;
    if (tenantCode && typeof tenantCode === "string") {
      const cached = await redisClient.get(`tenant:${tenantCode}`);
      if (cached) {
        const tenantData = JSON.parse(cached);
        // attach to request for later access in proxy
        (req as any).tenantData = tenantData;
      }
    }
  } catch (error) {
    console.error("Redis lookup error:", error);
  }
  next(); // continue to proxy
};
