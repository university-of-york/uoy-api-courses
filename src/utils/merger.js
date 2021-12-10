module.exports.merger = (searchedCourses, clearingCourses) => {
    const coursesWithIndex = clearingCourses.reduce(
        (prevCourse, curCourse) => prevCourse.set(curCourse.ucasCode, curCourse),
        new Map()
    );

    return searchedCourses.map((searched) => {
        let course = coursesWithIndex.get(searched.ucasCode);
        if (course) {
            let combinedCourse = searched;
            combinedCourse.inClearingHome = course.inClearingHome;
            combinedCourse.inClearingInternational = course.inClearingInternational;
            combinedCourse.inAdjustmentOnlyHome = course.inAdjustmentOnlyHome;
            combinedCourse.inAdjustmentOnlyInternational = course.inAdjustmentOnlyInternational;
            return combinedCourse;
        }
        return searched;
    });
};
