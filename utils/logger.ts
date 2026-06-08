const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
let httpContext = require("express-http-context");

module.exports = createLogger({
  transports: new transports.DailyRotateFile({
    filename: "./logs/Gateway-Log-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    level: "info",
    format: format.combine(
      format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      format.align(),
      format.printf(
        (info: any) =>
          `${[info.level.toUpperCase()]}: ${[info.timestamp]}:${
            httpContext.get("reqId") ? httpContext.get("reqId") : ""
          }: ${info.message}`
      )
    ),
  }),
});
