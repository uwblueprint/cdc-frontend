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
    { sceneId, objectId, isInteractable, blackboardData },
    handleError
) => {
    try {
        const response = await httpPut(
            baseEndpoint + `scene/${sceneId}/object/${objectId}/puzzle`,
            {
                is_interactable: isInteractable,
                animations_json: {
                    blackboardData: blackboardData,
                },
            }
        );
        // console.log("response");
        // console.log(response);
        return response;
    } catch (error) {
        // console.log("error");
        // console.log(error);
        handleError(error);
        throw error;
    }
};
