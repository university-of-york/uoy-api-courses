const { getClearingCourses } = require("./getClearing");
const { success } = require("../response");

module.exports.clearing = async () => {
    const result = await getClearingCourses();

    return success(result);
};
