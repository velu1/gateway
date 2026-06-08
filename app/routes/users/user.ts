import { Express } from "express";
const { proxy } = require("../../proxy");
import { resolveTenant } from "../../proxy/tenant";
module.exports = (app: Express) => {
  app.use("/baseServices/api/user", resolveTenant, proxy("/baseServices"));
  app.use("/baseServices/api/role", resolveTenant, proxy("/baseServices"));
  app.use(
    "/baseServices/api/dashboard-card",
    resolveTenant,
    proxy("/baseServices")
  );

  app.use(
    "/baseServices/api/assign-roles",
    resolveTenant,
    proxy("/baseServices")
  );

  app.use(
    "/baseServices/api/role-permission",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/company-profile",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/user-permission",
    resolveTenant,
    proxy("/baseServices")
  );
  // app.use("/baseServices/api/login", proxy("/baseServices"));

  app.use("/baseServices/api/login", proxy("/baseServices"));

  app.use(
    "/baseServices/api/user-details",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use("/baseServices/api/logout", resolveTenant, proxy("/baseServices"));
  app.use(
    "/baseServices/api/profileSettings",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/role-getRoles",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/fetchLastUserId",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/organization",
    resolveTenant,
    proxy("/baseServices")
  );
  app.use(
    "/baseServices/api/organization/delete",
    resolveTenant,
    proxy("/baseServices")
  );

  app.use(
    "/baseServices/api/forgot-password",
    resolveTenant,
    proxy("/baseServices")
  );

  app.use(
    "/baseServices/api/reset-password",
    resolveTenant,
    proxy("/baseServices")
  );
};
