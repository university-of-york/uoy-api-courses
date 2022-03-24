/**
 * Generic function to map the response from our Funnelback API so that it matches
 * our OpenAPI specification.
 */
const transformResponse = (response) =>
    response.map((course) => {
        const transformedCourse = course;
        transformDistanceLearning(transformedCourse);
        transformDepartment(transformedCourse);
        return transformedCourse;
    });

const transformDistanceLearning = (course) => {
    const distanceLearning = typeof course.distanceLearning === "string" ? course.distanceLearning.toLowerCase() : "no";

    course.distanceLearning = distanceLearning === "yes";

    return course;
};

const transformDepartment = (course) => {
    if (course.department && typeof course.department === "string") {
        const departments = course.department;

        // TODO: Business Analysis work to determine if we can change the delimiter for departments
        course.department = departments.includes(", ") ? departments.split(", ") : [departments];
    } else {
        course.department = [];
    }

    return course;
};

export { transformResponse };
