import { httpGet, httpPost, httpPut, httpDelete } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getAllScenarios = async () => {
    const response = await httpGet(baseEndpoint + "scenarios");
    return response.data.scenarios;
};

export const getScenario = async (id) => {
    const response = await httpGet(baseEndpoint + `scenario/${id}`);
    return response.data;
};

export const postScenario = async ({ name, description, friendly_name }) => {
    const response = await httpPost(baseEndpoint + "scenario", {
        name,
        description,
        friendly_name,
    });
    return response;
};

export const editScenario = async ({
    id,
    name,
    description,
    friendly_name,
    scene_ids,
    is_published,
    is_previewable,
}) => {
    const response = await httpPut(baseEndpoint + `scenario/${id}`, {
        name,
        friendly_name,
        description,
        scene_ids,
        is_published,
        is_previewable,
    });
    return response;
};

export const deleteScenario = async (id) => {
    await httpDelete(baseEndpoint + `scenario/${id}`);
};
