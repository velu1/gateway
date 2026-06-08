import { Express } from "express";
const { proxy } = require("../proxy");
import { resolveTenant } from "../proxy/tenant";

module.exports = (app: Express) => {
  const applyMiddlewareAndProxy = (route: string) => {
    app.use(`/incoming/api/${route}`, resolveTenant, proxy("incoming"));

    app.use("/incoming/api/templateHistories", proxy("incoming"));
  };

  const routes = [
    "masterData",
    "masterDataTemplate",
    "excelTemplate",
    "invoice",
    "invoicePallet",
    "validatePartNumber",
    "internalPN",
    "partsIn",
    "entityData",
    "capture",
    "semicapture",
    "partsList",
    "partHistoryReports",
    "partStockDetails",
    "trailRun",
    "template-manufacturer",
    "trailRunSave",
    "stickerData",
    "capture-image",
    "inward/template",
    "inward/templateHistory",
    "inward/partNumber",
     "associate-template",

  ];
  routes.forEach(applyMiddlewareAndProxy);
};
