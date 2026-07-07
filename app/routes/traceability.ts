import { Express } from "express";
const { proxy } = require("../proxy");
import { resolveTenant } from "../proxy/tenant";

module.exports = (app: Express) => {
  const applyMiddlewareAndProxy = (route: string) => {
    app.use(`/traceability/api/${route}`, resolveTenant, proxy("/traceability"));
  };

  const routes = [
    "traceability/settings/field-config",
    "traceability/generate",
    "traceability/serial-number",
    "traceability/panel-mapping",
    "traceability/tracking",
    "traceability/change-over",
    "traceability/manual",
    "traceability/finished-goods",
    "traceability/serial-number-meta",
    "traceability/thawing",
    "traceability/components-farming",
    "traceability/loading-chart",
    "traceability/first-article",
    "traceability/finished-board-approval",
    "traceability/dashboard",
    "traceability/audit/report",
    "traceability/audit/serial-number-report",
    "traceability/audit/status-report",
    "traceability/audit/lot-number",
    "traceability/audit/unique-id",
    "traceability/audit/binary-tree",
  ];
  routes.forEach(applyMiddlewareAndProxy);
};
