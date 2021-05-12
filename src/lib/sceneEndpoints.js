import { httpGet, httpPost, httpPut } from "./dataAccess";

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

export const editScene = async ({
    id,
    name,
    description,
    object_ids,
    position,
    scale,
    rotation,
    background_id,
    camera_properties,
}) => {
    const response = await httpPut(baseEndpoint + `scene/${id}`, {
        name,
        description,
        object_ids,
        position,
        scale,
        rotation,
        background_id,
        camera_properties,
    });
    return response;
};
