import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { URLSearchParams } from "url";

export const coursesUrl = (parameters: APIGatewayProxyEventQueryStringParameters): string => {
    const queryParams = new URLSearchParams();

    queryParams.append("collection", process.env.COLLECTION || "");
    queryParams.append("form", process.env.FORM || "");
    queryParams.append("profile", process.env.PROFILE || "");
    queryParams.append("smeta_contentType", process.env.SMETA_CONTENT_TYPE || "");

    if (parameters.search) {
        queryParams.append("query", parameters.search);
    }

    if (parameters.max) {
        queryParams.append("num_ranks", parameters.max);
    }

    if (parameters.offset) {
        queryParams.append("start_rank", parameters.offset);
    }

    return `${process.env.BASE_URL}?${queryParams.toString()}`;
};
