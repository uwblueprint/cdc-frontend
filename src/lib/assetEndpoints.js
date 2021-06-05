import { httpGet } from "./dataAccess";

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
