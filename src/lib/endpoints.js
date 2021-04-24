import { httpGet } from "./dataAccess";

export const getAllScenes = async () => {
    const response = await httpGet("/api/admin/v1/scenarios");
    return response.data;
};
