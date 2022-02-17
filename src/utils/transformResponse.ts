import { FunnelbackCourse, APICourse } from "../types/courses";

/**
 * Generic function to map the response from our Funnelback API so that it matches
 * our OpenAPI specification.
 */
export const transformResponse = (response: FunnelbackCourse[]): APICourse[] => {
    return response.map((funnelbackCourse) => {
        return {
            title: funnelbackCourse.title,
            liveUrl: funnelbackCourse.liveUrl,
            award: funnelbackCourse.award,
            department: getDepartment(funnelbackCourse),
            level: funnelbackCourse.level,
            length: funnelbackCourse.length,
            typicalOffer: funnelbackCourse.typicalOffer,
            yearOfEntry: funnelbackCourse.yearOfEntry,
            distanceLearning: getDistanceLearning(funnelbackCourse),
            summary: funnelbackCourse.summary,
            imageUrl: funnelbackCourse.imageUrl,
            ucasCode: funnelbackCourse.ucasCode,
        } as APICourse;
    });
};

const getDistanceLearning = (course: FunnelbackCourse): boolean => {
    let distanceLearning: string;
    if (typeof course.distanceLearning === "string") {
        distanceLearning = course.distanceLearning.toLowerCase();
    } else {
        distanceLearning = "no";
    }

    return distanceLearning === "yes";
};

const getDepartment = (course: FunnelbackCourse): string[] => {
    if (course.department && typeof course.department === "string") {
        const departments = course.department;

        // TODO: Business Analysis work to determine if we can change the delimiter for departments
        if (departments.includes(", ")) {
            return departments.split(", ");
        }
        return [departments];
    }
    return [];
};
