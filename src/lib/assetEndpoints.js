import { httpGet, httpPut, httpPost, httpDelete } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getAllAssets = async (handleError) => {
    try {
        const response = await httpGet(baseEndpoint + "assets");
        return response.data.assets;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const getAsset = async (id, handleError) => {
    try {
        const response = await httpGet(baseEndpoint + `asset/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const editAsset = async (id, name, obj_type, s3_key, handleError) => {
    try {
        const response = await httpPut(baseEndpoint + `asset/${id}`, {
            name,
            obj_type,
            s3_key,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const createAsset = async ({ name, obj_type, s3_key }, handleError) => {
    try {
        const response = await httpPost(baseEndpoint + `asset`, {
            name,
            obj_type,
            s3_key,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const deleteAsset = async (id, handleError) => {
    try {
        await httpDelete(baseEndpoint + `asset/${id}`);
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const editAssetScreenshot = async (id, screenshot_url, handleError) => {
    try {
        const response = await httpPut(
            baseEndpoint + `asset/${id}/screenshot`,
            {
                screenshot_url,
            }
        );
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
