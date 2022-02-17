export interface CustomError extends Error {
    type: string;
    details?: {
        funnelBackUrl: string | null;
        statusCode: number;
        statusText: string;
    };
}

export class NoQueryGivenError extends Error {
    type: string = "NoQueryGivenError";
    details: unknown;

    constructor(message: string, details: unknown) {
        super(message);
        this.details = details;
    }
}

export class FunnelbackError extends Error {
    type: string = "FunnelbackError";
    details: unknown;

    constructor(message: string, details: unknown) {
        super(message);
        this.details = details;
    }
}
