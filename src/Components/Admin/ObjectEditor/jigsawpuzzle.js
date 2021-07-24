import React, { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { fileToBase64String } from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";
import { httpPost } from "../../../lib/dataAccess";

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
    const [images, setImages] = React.useState(props.images);

    useEffect(() => {
        const uploadImage = async () => {
            const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;
            const response = await httpPost(baseEndpoint + `jigsaw`, {
                encoded_image: base64String,
            });
            setImages(response.data.data);
            props.saveJigsawImages(response.data.data);
            setBase64String("");
        };

        if (base64String !== "") {
            uploadImage();
        }
    }, [base64String, images, props, handleError]);

    const handleUploadFileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            await fileToBase64String(file, setBase64String);
        }
    };

    return (
        <div>
            <Typography component="div" variant="h5" className={classes.text}>
                Upload Image
            </Typography>
            {images ? (
                <div>
                    <Typography
                        component="div"
                        variant="h6"
                        className={classes.text}
                    >
                        Images Preview:
                    </Typography>
                    <div className={classes.grid}>
                        <div className={classes.cell}>
                            <img
                                src={images[0]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[1]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[2]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[3]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[4]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[5]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[6]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[7]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>

                        <div className={classes.cell}>
                            <img
                                src={images[8]}
                                height={125}
                                max-width={1000}
                                object-fit={"contain"}
                            ></img>
                        </div>
                    </div>
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
                    component="span"
                >
                    Upload
                </Button>
            </label>
        </div>
    );
}
