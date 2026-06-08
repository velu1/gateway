import { connectDBs } from "./dbConnection";

export const initDB = (mongodbURI: string) => {
  return connectDBs(mongodbURI).then((connection: any) => {
    const db = {
      printerConfigs: require("./settings/printerConfigurations")(connection),
    };

    return db;
  });
};
