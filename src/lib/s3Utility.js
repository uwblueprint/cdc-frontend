import { httpPost } from "./dataAccess";
import { httpPostS3 } from "./dataAccessS3";

const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;

export const createPresignedLinkAndUploadS3 = async (
    { file_type, type, file_content, s3Key = "" },
    handleError,
    isFileContentBlob = false
) => {
    // First, send a request to backend to get presigned link
    const response = await getPresignedLink(
        {
            type: type,
            extension: file_type,
            s3_key: s3Key,
        },
        handleError
    );

    const formData = new FormData();

    Object.keys(response.data.fields).forEach((key) => {
        formData.append(key, response.data.fields[key]);
    });

    if (!isFileContentBlob) {
        const blob = new Blob([file_content], { type: file_type });
        formData.append("file", blob);
    } else {
        formData.append("file", file_content);
    }

    const endpoint = response.data.url;

    // Upload the asset blob file to S3
    await uploadAssetS3(
        {
            endpoint,
            formData,
        },
        handleError
    );

    return response;
};

export const getPresignedLink = async (
    { type, extension, s3_key },
    handleError
) => {
    try {
        const response = await httpPost(baseEndpoint + `upload`, {
            type,
            extension,
            s3_key,
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const uploadAssetS3 = async ({ endpoint, formData }, handleError) => {
    try {
        const response = await httpPostS3(endpoint, formData);
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const fileToByteArray = (file, setByteArray) => {
    fileToDataUri(file).then((dataUri) => {
        const dataUriSplit = dataUri.split(",")[1];
        const byteCharacters = atob(dataUriSplit);

        // From: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        setByteArray(byteArray);
    });
};

export const fileToBase64String = (file, setBase64String) => {
    fileToDataUri(file).then((dataUri) => {
        const dataUriSplit = dataUri.split(",")[1];
        setBase64String(dataUriSplit);
    });
};

const fileToDataUri = (file) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    });
