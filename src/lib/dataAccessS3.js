import axios from "axios";

export const httpPostS3 = (endPoint, body) => {
    const headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    };

    return new Promise((resolve, reject) => {
        axios
            .post(endPoint, body, { headers: headers })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
