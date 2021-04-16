import axios from "axios";

const baseURL = process.env.REACT_APP_ADMIN_BACKEND_URL + "/";

export const httpGet = (endPoint, accessToken) => {
    const url = baseURL + endPoint;

    return axios
        .get(url, {
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const httpPost = (endPoint, accessToken, body) => {
    const url = baseURL + endPoint;

    return new Promise((resolve, reject) => {
        axios
            .post(url, body, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const httpPut = (endPoint, accessToken, body) => {
    const url = baseURL + endPoint;

    return new Promise((resolve, reject) => {
        axios
            .put(url, body, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
