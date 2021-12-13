const google = require("@googleapis/sheets");

module.exports.getClearingCourses = async () => {
    const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_API_KEY });

    // Read from the spreadsheet
    const readData = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CLEARING_SPREADSHEET_ID,
        range: "Sheet1!E2:M",
    });

    const rows = readData.data.values;

    if (!rows) throw new Error("no clearing data found");

    return rows.map((row) => {
        // 0 - ucas, 1 - link, 2 - sra, 3 - sra check, 4 - length, 5/6/7/8 - clearing data,
        return {
            ucasCode: row[0],
            inClearingOnlyHome: row[5] === "Y",
            inClearingOnlyInternational: row[6] === "Y",
            inAdjustmentOnlyHome: row[7] === "Y",
            inAdjustmentOnlyInternational: row[8] === "Y",
        };
    });
};

module.exports.addClearingData = (searchedCourses, clearingCourses) => {
    // We create a map storing key-value pairs (UCAS code / clearing data)
    // This allows us to query for a course's clearing data by UCAS code.
    const clearingsWithIndex = clearingCourses.reduce(
        (clearingsWithIndex, clearing) => clearingsWithIndex.set(clearing.ucasCode, clearing),
        new Map()
    );

    return searchedCourses.map((course) => {
        let clearing = clearingsWithIndex.get(course.ucasCode);
        if (clearing) {
            let courseAndClearing = course;
            courseAndClearing.inClearingOnlyHome = clearing.inClearingOnlyHome;
            courseAndClearing.inClearingOnlyInternational = clearing.inClearingOnlyInternational;
            courseAndClearing.inAdjustmentOnlyHome = clearing.inAdjustmentOnlyHome;
            courseAndClearing.inAdjustmentOnlyInternational = clearing.inAdjustmentOnlyInternational;
            return courseAndClearing;
        }
        return course;
    });
};
