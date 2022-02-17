export interface FunnelbackResponse {
    numberOfMatches: number;
    results: FunnelbackCourse[];
}

export interface FunnelbackCourse {
    title: string;
    liveUrl: string;
    award: string;
    department: string;
    level: string;
    length: string;
    typicalOffer: string;
    yearOfEntry: string;
    distanceLearning: string;
    summary: string;
    imageUrl: string;
    ucasCode: string;
}

export interface APICourse {
    title: string;
    liveUrl: string;
    award: string;
    department: string[];
    level: string;
    length: string;
    typicalOffer: string;
    yearOfEntry: string;
    distanceLearning: boolean;
    summary: string;
    imageUrl: string;
    ucasCode: string;
}
