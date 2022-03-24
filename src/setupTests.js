import jestFetchMock from "jest-fetch-mock";
import dotenv from "dotenv";

global.fetch = jestFetchMock.enableMocks();
dotenv.config({
    path: ".env.test",
});
