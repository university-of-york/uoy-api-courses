const google = require("@googleapis/sheets");

module.exports.getClearingCourses = async () => {
    const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_API_KEY });

    // Read front the spreadsheet
    const readData = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CLEARING_SPREADSHEET_ID,
        range: "Sheet1!E2:M",
    });

    const rows = readData.data.values;

    if (!rows) throw new Error("no clearing data found");

    return rows.map((row) => {
        // 0 - ucas, 1 - link, 2 - sra, 3 - sra check, 4 - length, 5/6/7/8 - clear,
        return {
            ucasCode: row[0],
            inClearingOnlyHome: row[5] === "Y",
            inClearingOnlyInternational: row[6] === "Y",
            inAdjustmentOnlyHome: row[7] === "Y",
            inAdjustmentOnlyInternational: row[8] === "Y",
        };
    });
};
