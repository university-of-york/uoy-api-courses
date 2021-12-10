const google = require("@googleapis/sheets");

const auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

module.exports.getClearingCourses = async () => {
    const authClient = await auth.getClient();
    // Google sheets instance
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClient });

    // Read front the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        spreadsheetId: process.env.CLEARING_SPREADSHEET_ID,
        range: "Sheet1!E2:M",
    });

    const rows = readData.data.values;

    if (!rows) throw new Error("no clearing data found");

    return rows.map((row) => {
        // 0 - ucas, 1 - link, 2 - sra, 3 - sra check, 4 - length, 5/6/7/8 - clear,
        return {
            ucasCode: row[0],
            inClearingHome: row[5] === "Y",
            inClearingInternational: row[6] === "Y",
            inAdjustmentOnlyHome: row[7] === "Y",
            inAdjustmentOnlyInternational: row[8] === "Y",
        };
    });
};
