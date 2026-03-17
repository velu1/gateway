import { Express } from "express";
const { proxy } = require("../../proxy");
const { resolveTenant } = require("../../proxy/tenant");
module.exports = (app: Express) => {
  app.use(
    "/baseServices/api/settings/printerConfigurations",
    resolveTenant,
    proxy("/baseServices")
  );
};
