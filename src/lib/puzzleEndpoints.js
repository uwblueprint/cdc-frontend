import { httpGet, httpPut } from "./dataAccess";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const getPuzzle = async (sceneId, objectId, handleError) => {
    try {
        const response = await httpGet(
            baseEndpoint + `scene/${sceneId}/object/${objectId}/puzzle`
        );
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const editPuzzle = async (
    { sceneId, objectId, isInteractable, animationsJson },
    handleError
) => {
    try {
        const response = await httpPut(
            baseEndpoint + `scene/${sceneId}/object/${objectId}/puzzle`,
            {
                is_interactable: isInteractable,
                animations_json: animationsJson,
            }
        );
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
