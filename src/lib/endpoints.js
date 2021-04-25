import { httpGet, httpPost } from "./dataAccess";

export const getAllScenarios = async () => {
    const response = await httpGet("/api/admin/v1/scenarios");
    return response.data.scenarios;
};

export const postScenario = async ({ name, description, friendly_name }) => {
    const response = await httpPost("/api/admin/v1/scenario", {
        name,
        description,
        friendly_name,
    });
    return response;
};
