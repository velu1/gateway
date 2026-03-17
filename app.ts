import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const topic = require("./config");
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const app = express();
let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.get('/health', (_req: any, res: any) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
// For access the images from public folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (_req: Request, res: Response) => {
  return res.json({ message: "connected to port 8080" });
});

require("./app/routes/users/user")(app);
require("./app/routes/settings/settings")(app);
require("./app/routes/incoming")(app);
require("./app/routes/settings/printerConfigurations")(app);
const server = app.listen(topic.server.authPort, () => {
  console.log(`connected... ${topic.server.authPort}`);
});
server.setMaxListeners(100);
