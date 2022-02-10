import { httpGet, httpPost, httpPut, httpDelete } from "./dataAccess";

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

export const createScene = async (
    name,
    background_id,
    description,
    handleError
) => {
    try {
        const response = await httpPost(baseEndpoint + `scene`, {
            name,
            background_id,
            description,
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

export const editScene = async (
    {
        id,
        name,
        description,
        object_ids,
        position,
        scale,
        rotation,
        background_id,
        hints,
        camera_properties,
    },
    handleError
) => {
    try {
        const response = await httpPut(baseEndpoint + `scene/${id}`, {
            name,
            description,
            object_ids,
            position,
            scale,
            rotation,
            background_id,
            hints,
            camera_properties,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const deleteScene = async (id, handleError) => {
    try {
        await httpDelete(baseEndpoint + `scene/${id}`);
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const duplicateScene = async (id, handleError) => {
    try {
        const response = await httpPost(
            baseEndpoint + `scene/${id}/duplicate`,
            {
                id,
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
