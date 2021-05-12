import { httpGet, httpPost } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getScene = async (id, handleError) => {
    try {
        const response = await httpGet(baseEndpoint + `scene/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const createScene = async (name, background_id, handleError) => {
    try {
        const response = await httpPost(baseEndpoint + `scene`, {
            name,
            background_id,
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const getAllScenes = async (handleError) => {
    try {
        const response = await httpGet(baseEndpoint + "scenes");
        return response.data.scenes;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
