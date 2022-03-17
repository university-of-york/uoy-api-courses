import { HTTP_CODES } from "../constants/constants";

const success = (body) => ({
    statusCode: HTTP_CODES.OK,
    body: JSON.stringify(body),
});

const error = (message, status, error, path) => ({
    statusCode: status,
    body: JSON.stringify({
        timestamp: new Date().toISOString(),
        status,
        error,
        message,
        path,
    }),
});

export { success, error };
