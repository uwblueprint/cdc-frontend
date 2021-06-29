import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ObjectTypes } from "../AssetModelViewer/objectTypes.ts";
import { FileTypes } from "./fileTypes.ts";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { fileToByteArray } from "../../../lib/s3Utility";

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

export default function UploadAssetModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
}) {
    const classes = useStyles();
    const [assetName, setAssetName] = React.useState("");
    const [objectType, setObjectType] = React.useState(ObjectTypes.NONE);
    const [fileType, setFileType] = React.useState(FileTypes.NONE);
    const [assetByteArray, setAssetByteArray] = React.useState(null);
    const [errors, setErrors] = React.useState({
        name: "",
        objectType: "Object type must be either object or background",
        fileType: "File type must be either GLTF or GLB",
        assetBlob: "",
    });

    const handleAssetNameChange = (event) => {
        setAssetName(event.target.value);
        setErrors({ name: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                name:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), and spaces",
            });
        }
    };

    const handleObjectTypeChange = (event) => {
        setErrors({ objectType: "" });

        switch (event.target.value) {
            case ObjectTypes.OBJECT:
                setObjectType(ObjectTypes.OBJECT);
                break;
            case ObjectTypes.BACKGROUND:
                setObjectType(ObjectTypes.BACKGROUND);
                break;
            default:
                setObjectType(ObjectTypes.NONE);
                setErrors({
                    objectType:
                        "Object type must be either object or background",
                });
        }
    };

    const handleFileTypeChange = (event) => {
        setErrors({ fileType: "" });

        switch (event.target.value) {
            case FileTypes.GLTF:
                setFileType(FileTypes.GLTF);
                break;
            case FileTypes.GLB:
                setFileType(FileTypes.GLB);
                break;
            default:
                setFileType(FileTypes.NONE);
                setErrors({
                    fileType: "File type must be either GLTF or GLB",
                });
        }
    };

    const handleUploadFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            fileToByteArray(file, setAssetByteArray);
        }
    };

    const fileToDataUri = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });

    const handleModalSubmitClick = () => {
        const error = Boolean(
            errors
                ? errors.assetName ||
                      errors.objectType ||
                      errors.fileType ||
                      errors.assetBlob
                : false
        );

        if (!error) {
            handleSubmit(assetName, fileType, objectType, assetByteArray);
        }
    };

    return (
        <Dialog
            open={modalOpen}
            onClose={handleModalClose}
            className={classes.dialog}
        >
            <DialogTitle>{"New Asset"}</DialogTitle>
            <DialogContent>
                <div>
                    <Typography component="div" variant="h5">
                        Asset Name:
                    </Typography>
                    <TextField
                        value={assetName}
                        onChange={handleAssetNameChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.name : false)}
                        helperText={errors ? errors.name : false}
                    />
                </div>
                <div>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <Typography component="div" variant="h5">
                            Object Type:
                        </Typography>
                        <Select
                            labelId="objectTypeTextField"
                            value={objectType}
                            onChange={handleObjectTypeChange}
                            displayEmpty
                        >
                            <MenuItem value={ObjectTypes.OBJECT}>
                                {ObjectTypes.OBJECT}
                            </MenuItem>
                            <MenuItem value={ObjectTypes.BACKGROUND}>
                                {ObjectTypes.BACKGROUND}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <Typography component="div" variant="h5">
                            File Type:
                        </Typography>
                        <Select
                            labelId="fileTypeTextField"
                            value={fileType}
                            onChange={handleFileTypeChange}
                            displayEmpty
                        >
                            <MenuItem value={FileTypes.GLTF}>
                                {FileTypes.GLTF}
                            </MenuItem>
                            <MenuItem value={FileTypes.GLB}>
                                {FileTypes.GLB}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Typography
                        component="div"
                        variant="h5"
                        className={classes.text}
                    >
                        Upload Asset
                    </Typography>
                    <input
                        accept=".glb,.gltf"
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
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalClose}> Cancel </Button>
                <Button onClick={handleModalSubmitClick}>{"Create"}</Button>
            </DialogActions>
        </Dialog>
    );
}
