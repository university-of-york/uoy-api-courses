/**
 * Generic function to map the response from our Funnelback API so that it matches
 * our OpenAPI specification.
 */
module.exports.transformResponse = (response) => {
    return response.map((course) => {
        const transformedCourse = course;
        transformDistanceLearning(transformedCourse);
        transformDepartment(transformedCourse);
        return transformedCourse;
    });
};

const transformDistanceLearning = (course) => {
    let distanceLearning;
    if (course) {
        if (typeof course.distanceLearning === "string") {
            distanceLearning = course.distanceLearning.toLowerCase();
        } else {
            distanceLearning = "no";
        }

        course.distanceLearning = distanceLearning === "yes";
    }

    return course;
};

const transformDepartment = (course) => {
    if (course.department && typeof course.department === "string") {
        const departments = course.department;

        // TODO: Business Analysis work to determine if we can change the delimiter for departments
        if (departments.includes(", ")) {
            course.department = departments.split(", ");
        } else {
            course.department = [departments];
        }
    }

    return course;
};
