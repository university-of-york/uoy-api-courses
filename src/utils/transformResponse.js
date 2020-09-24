/**
 * Generic function to map the response from our Funnelback API so that it matches
 * our OpenAPI specification.
 * @param response {{[Object]}
 * @returns {[Object]}
 */
module.exports.transformResponse = (response) => {
    return response.map(course => (
        transformDistanceLearning(course)
    ));
};


const transformDistanceLearning = (course) => {
    if(course && course.distanceLearning) {
        const distanceLearning = typeof course.distanceLearning === "string"
          ? course.distanceLearning.toLowerCase()
          : null;

        course.distanceLearning = distanceLearning === "yes" ? true : distanceLearning === "no" ? false : null;
    }

    return course;
};