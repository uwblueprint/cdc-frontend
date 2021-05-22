import axios from "axios";

const baseURL = process.env.REACT_APP_ADMIN_BACKEND_URL;

export function getCookie(name) {
    const r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

export const httpGet = (endPoint) => {
    const url = baseURL + endPoint;

    return axios
        .get(url, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
        .catch((error) => {
            throw error;
        });
};

export const httpPost = (endPoint, body, isLogin = false) => {
    const url = baseURL + endPoint;
    const headers = {};
    if (!isLogin) {
        headers["X-Xsrftoken"] = getCookie("_xsrf");
    }

    return new Promise((resolve, reject) => {
        axios
            .post(url, body, { headers: headers, withCredentials: true })
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
            .put(url, body, {
                headers: {
                    "X-Xsrftoken": getCookie("_xsrf"),
                },
                withCredentials: true,
            })
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
            .delete(url, {
                headers: {
                    "X-Xsrftoken": getCookie("_xsrf"),
                },
                withCredentials: true,
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
