import { httpGet, httpPost } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getAllScenarios = async () => {
    const response = await httpGet(baseEndpoint + "scenarios");
    return response.data.scenarios;
};

export const postScenario = async ({ name, description, friendly_name }) => {
    const response = await httpPost(baseEndpoint + "scenario", {
        name,
        description,
        friendly_name,
    });
    return response;
};
