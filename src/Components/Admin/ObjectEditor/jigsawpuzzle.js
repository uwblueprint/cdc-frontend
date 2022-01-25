import React, { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { fileToBase64String } from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    textField: {
        width: "400px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
    },
    formControl: {
        width: "12vw",
    },
    dialog: {
        margin: theme.spacing(1),
    },
    input: {
        display: "none",
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    cell: {
        flex: "0 0 33.3333%",
        alignSelf: "flex-start",
    },
}));

export default function JigsawPuzzle(props) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [base64String, setBase64String] = React.useState("");
    const [imgPreview, setImgPreview] = React.useState("");
    const [name, setName] = React.useState(null);

    useEffect(() => {
        const uploadImage = async () => {
            const byteCharacters = atob(base64String);

            // From: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "" });
            setImgPreview(URL.createObjectURL(blob));
            props.saveJigsawImages(base64String);
            setBase64String("");
        };

        if (base64String !== "") {
            uploadImage();
        }
    }, [base64String, props, handleError]);

    const handleUploadFileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            await fileToBase64String(file, setBase64String);
            setName(file.name);
        }
    };

    return (
        <div>
            <br></br>
            <Typography component="div" variant="h5" className={classes.text}>
                Jigsaw Image
            </Typography>
            {imgPreview !== "" ? (
                <div>
                    <Typography
                        component="div"
                        variant="h6"
                        className={classes.text}
                    >
                        Image Preview:
                    </Typography>
                    <img
                        src={imgPreview}
                        height={250}
                        max-width={1000}
                        object-fit={"contain"}
                    ></img>
                </div>
            ) : null}
            <input
                accept=".jpg,.jpeg,.png"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleUploadFileChange}
            />
            <label htmlFor="contained-button-file">
                <Button
                    className={classes.uploadButton}
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#364254" }}
                    component="span"
                >
                    Upload
                </Button>
            </label>
        </div>
    );
}
