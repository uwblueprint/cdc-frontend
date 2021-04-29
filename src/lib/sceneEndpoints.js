import { httpGet } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getScene = async (id) => {
    const response = await httpGet(baseEndpoint + `scene/${id}`);
    return response.data;
};
