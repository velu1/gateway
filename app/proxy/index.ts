import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import url from "url";
import { Request, Response } from "express";
import redisClient from "../proxy/redisClient";
const topic = require("../../config/index");
const { logCall } = require("../../utils/extra");
const { seed } = require("../service/extra/seed");

// Extend the Request interface to include user and tenant info
interface CustomRequest extends Request {
  userId?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  userIP?: string;
}

// Main proxy function
const proxy = (urlData: string) => {
  // Extract port number based on the incoming path
  function extractPortFromUrlData(urlData: string) {
    const portMapping: any = {
      "/baseServices": topic.server.user,
      "/incoming": topic.server.incoming,
      "/traceability": topic.server.traceability,
    };
    return portMapping[urlData] || topic.server.incoming;
  }
  // Determine dynamic port for proxying
  const dynamicURL = extractPortFromUrlData(urlData);
  return createProxyMiddleware({
    // Target backend server
    target: dynamicURL,
    changeOrigin: true,

    // Rewriting the path to remove the base service path (e.g., "/baseServices")
    pathRewrite: (path, req) => {
      const { pathname } = url.parse(req.url || "", true);
      return pathname ? pathname.replace(`${urlData}`, "") : path;
    },

    // Called before sending request to backend
    onProxyReq: (proxyReq, req: CustomRequest) => {
      // This is now synchronous
      const tenantData = (req as any).tenantData;

      // Add tenant's MongoDB URI to header for backend usage
      proxyReq.setHeader(
        "x-tenant-mongodb-uri",
        process.env.MONGO_URI || "mongodb://localhost:27017/inventory"
      );
      if (tenantData?.mongodbURI) {
        proxyReq.setHeader("x-tenant-code", tenantData.code);
        proxyReq.setHeader("x-keycloak-clientId", tenantData.keycloak.clientId);
        proxyReq.setHeader(
          "x-keycloak-clientSecret",
          tenantData.keycloak.clientSecret
        );
      }

      // Ensure the request body is correctly forwarded
      fixRequestBody(proxyReq, req);

      // Log the access attempt
      logCall(req, "Try to access the data");
    },

    // Called when response is received from backend
    onProxyRes: async (proxyRes, req: Request, _res: Response) => {
      // Intercept login response to cache tenant info
      if (req.url?.includes("/api/code/login")) {
        let responseBody = Buffer.from([]);

        // Collect the data chunks from the response stream
        proxyRes.on("data", (chunk) => {
          responseBody = Buffer.concat([responseBody, chunk]);
        });

        // Once response is fully received
        proxyRes.on("end", async () => {
          try {
            const rawBody = responseBody.toString("utf8");
            const parsedBody = JSON.parse(rawBody);

            // If login is successful

            if (parsedBody.status) {
              // Extract tenant info
              const tenantData = {
                keycloak: {
                  clientId: parsedBody.tenantInfo?.keycloak?.clientId,
                  clientSecret: parsedBody.tenantInfo?.keycloak?.clientSecret,
                },
                mongodbURI: parsedBody.tenantInfo?.database?.mongodbURI,
                code: parsedBody.tenantInfo?.code,
                dataSeed: true,
              };
              // Cache the tenant info in Redis for 1 hour
              await redisClient.set(
                `tenant:${parsedBody.tenantInfo?.code}`,
                JSON.stringify(tenantData),
                "EX",
                60 * 60 // 1 hour
              );

              console.log(`Redis cache updated for tenant: ${tenantData.code}`);

              // Step 2: Connect to tenant DB and run seeding logic (optional, currently commented)
              try {
                // // Pass mongoose to seed function if needed
                const result = await seed(
                  parsedBody.tenantInfo?.database?.mongodbURI
                );

                if (result.status === "success") {
                  console.log("Data seeded successfully:", result.message);
                } else {
                  console.warn("⚠️ Data seeding warning:", result.message);
                }
              } catch (seedError) {
                console.error("Data seeding error:", seedError);
              }
            }
          } catch (err) {
            console.error("Failed to cache tenant info in Redis:", err);
          }
        });
      }
    },
  });
};

// Export the proxy function
module.exports = {
  proxy,
};
