import { Express } from "express";
const { proxy } = require("../../proxy");
import { resolveTenant } from "../../proxy/tenant";

module.exports = (app: Express) => {
  const applyMiddlewareAndProxy = (route: string) => {
    app.use(route, resolveTenant, proxy("/baseServices"));
  };

  const routes = [
    "/baseServices/api/settings/parts-config",
    "/baseServices/api/settings/system-config",
  ];

  routes.forEach(applyMiddlewareAndProxy);
};
