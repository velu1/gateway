import { getDB } from "../services/dbInstance";

export const seed = async (mongoConnString: string) => {
  try {
    const db = await getDB(mongoConnString);
    let settingsInfo = await db.printerConfigs.findOne().select("dataSeed");
    if (settingsInfo && settingsInfo.dataSeed) {
      return { status: "exists", message: "Data seed already exists!" };
    }
    let settingsData = {
      entityTableRows: [
        {
          slNo: 1,
          name: "Part Number",
          id: "partNumber",
          default: true,
          defaultTableRow: true,
        },
        {
          slNo: 2,
          name: "Quantity",
          id: "quantity",
          default: true,
          defaultTableRow: true,
        },
        {
          slNo: 3,
          name: "Mfg Date",
          id: "mfgDate",
          default: true,
          defaultTableRow: true,
        },
        {
          slNo: 4,
          name: "Lot No",
          id: "lotNumber",
          default: true,
          defaultTableRow: true,
        },
        {
          slNo: 5,
          name: "Unique ID",
          id: "uniqueId",
          default: true,
          defaultTableRow: false,
        },
        {
          slNo: 6,
          name: "Internal Part Number",
          id: "internalPartNo",
          default: true,
          defaultTableRow: false,
        },
        {
          slNo: 7,
          name: "Reciept No",
          id: "receiptNumber",
          default: true,
          defaultTableRow: false,
        },
      {
          slNo: 8,
          name: "Part Location",
          id: "partLocation",
          default: true,
          defaultTableRow: false,
        },

      ],
      dataSeed: true,
      type: "partsInPrinterConfig",
    };
    await db.printerConfigs.create(settingsData);

    return { status: "success", message: "Data-Seed-Successful" };
  } catch (error) {
    return { status: false, message: "Data-Seed-Error" };
  }
};
