import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL + "/";

export const httpGet = (endPoint, accessToken) => {
    const url = baseURL + "api/" + endPoint;
    const offset = new Date().getTimezoneOffset();

    return axios
        .get(url, {
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json",
                "Aspire-Client-Timezone-Offset": offset.toString(),
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const httpPost = (endPoint, accessToken, body) => {
    const url = baseURL + "api/" + endPoint;
    const offset = new Date().getTimezoneOffset();

    return new Promise((resolve, reject) => {
        axios
            .post(url, body, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                    "Aspire-Client-Timezone-Offset": offset.toString(),
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
    const url = baseURL + "api/" + endPoint;
    const offset = new Date().getTimezoneOffset();

    return new Promise((resolve, reject) => {
        axios
            .put(url, body, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                    "Aspire-Client-Timezone-Offset": offset.toString(),
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
