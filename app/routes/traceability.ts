import { Express } from "express";
const { proxy } = require("../proxy");
import { resolveTenant } from "../proxy/tenant";

module.exports = (app: Express) => {
  app.use("/traceability/api", resolveTenant, proxy("/traceability"));
};
