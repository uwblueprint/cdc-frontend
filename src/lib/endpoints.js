import { httpGet } from "./dataAccess";

export const getAllScenarios = async () => {
    const response = await httpGet("/api/admin/v1/scenarios");
    return response.data.scenarios;
};
