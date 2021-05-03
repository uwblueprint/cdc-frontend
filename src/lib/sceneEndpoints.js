import { httpGet, httpPost } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getScene = async (id) => {
    const response = await httpGet(baseEndpoint + `scene/${id}`);
    return response.data;
};

export const createScene = async (name, background_id) => {
    const response = await httpPost(baseEndpoint + `scene`, {
        name,
        background_id,
    });

    return response.data;
};
