import axios from "axios";

const baseURL = process.env.REACT_APP_ADMIN_BACKEND_URL;

export const httpGet = (endPoint) => {
    const url = baseURL + endPoint;
    return axios
        .get(url, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const httpPost = (endPoint, body) => {
    const url = baseURL + endPoint;

    return new Promise((resolve, reject) => {
        axios
            .post(url, body)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const httpPut = (endPoint, body) => {
    const url = baseURL + endPoint;

    return new Promise((resolve, reject) => {
        axios
            .put(url, body)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const httpDelete = (endPoint) => {
    const url = baseURL + endPoint;

    return new Promise((resolve, reject) => {
        axios
            .delete(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
