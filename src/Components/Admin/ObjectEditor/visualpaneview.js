import React, { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import { fileToByteArray } from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteForever } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";

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
}));

export default function VisualPaneView(props) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [name, setName] = React.useState(null);
    const [type, setType] = React.useState(null);
    const [imageByteArray, setImageByteArray] = React.useState(null);
    const [caption, setCaption] = React.useState(props.caption);
    const [uploaded, setUploaded] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState(props.src);

    useEffect(() => {
        const handleUploadImageSubmit = async (imageByteArray) => {
            const blob = new Blob([imageByteArray], { type: "" });
            setImageSrc(URL.createObjectURL(blob));
            props.saveImage(caption, imageByteArray, type);
        };

        const uploadImage = async () => {
            handleUploadImageSubmit(imageByteArray);
            setUploaded(true);
            setImageByteArray(null);
        };

        if (imageByteArray !== null) {
            uploadImage();
        }
    }, [type, imageByteArray, caption, props, handleError]);

    const handleUploadFileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            await fileToByteArray(file, setImageByteArray);
            setName(file.name);
            setType(file.type.replace("image/", ""));
        }
    };

    const addCaption = () => {
        const newText = {
            text: prompt("Enter the text for the puzzle: "),
        };

        if (newText.text) {
            setCaption(newText.text);
            props.saveCaption(newText.text);
        }
    };

    const deleteCaption = () => {
        setCaption("");
    };

    const handleTextChange = (event) => {
        const newText = event.target.value;
        if (newText !== null) {
            setCaption(newText);
        }
    };

    return (
        <div>
            <br></br>
            <Typography component="div" variant="h5" className={classes.text}>
                Image
            </Typography>
            {imageSrc ? (
                <div>
                    <Typography
                        component="div"
                        variant="h6"
                        className={classes.text}
                    >
                        Image Preview:
                    </Typography>
                    <img
                        src={imageSrc}
                        height={250}
                        max-width={1000}
                        object-fit={"contain"}
                    ></img>
                    <br></br>
                </div>
            ) : null}
            <input
                accept=".jpg,.jpeg,.png"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleUploadFileChange}
            />
            {!uploaded ? (
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
            ) : (
                <label htmlFor="contained-button-file">
                    <Button
                        className={classes.uploadButton}
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#D5E1EE", color: "black" }}
                        component="span"
                    >
                        Change File
                    </Button>
                </label>
            )}
            {caption === "" ? (
                <div>
                    Add Caption
                    <IconButton
                        className={classes.addButton}
                        aria-label="add"
                        onClick={addCaption}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            ) : (
                <div>
                    <br></br>
                    Caption:
                    <TextField
                        value={caption}
                        onChange={(e) => handleTextChange(e)}
                        required
                        variant="outlined"
                        placeholder="Enter transition text"
                        multiline
                    />
                    <IconButton onClick={() => deleteCaption()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            {uploaded ? <div>{name} successfully uploaded</div> : null}
        </div>
    );
}
