import { httpGet, httpPost, httpPut, httpDelete } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getAllScenarios = async (handleError) => {
    try {
        const response = await httpGet(baseEndpoint + "scenarios");
        return response.data.scenarios;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const getScenario = async (id, handleError) => {
    try {
        const response = await httpGet(baseEndpoint + `scenario/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const postScenario = async (
    { name, description, friendly_name },
    handleError
) => {
    try {
        const response = await httpPost(baseEndpoint + "scenario", {
            name,
            description,
            friendly_name,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const editScenario = async (
    {
        id,
        name,
        description,
        friendly_name,
        scene_ids,
        is_published,
        is_previewable,
        expected_solve_time,
        transitions,
    },
    handleError
) => {
    try {
        const response = await httpPut(baseEndpoint + `scenario/${id}`, {
            name,
            friendly_name,
            description,
            scene_ids,
            is_published,
            is_previewable,
            expected_solve_time,
            transitions,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const deleteScenario = async (id, handleError) => {
    try {
        await httpDelete(baseEndpoint + `scenario/${id}`);
    } catch (error) {
        handleError(error);
        throw error;
    }
};
