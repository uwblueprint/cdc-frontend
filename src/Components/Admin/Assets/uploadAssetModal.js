import React from "react";
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
import FormHelperText from "@material-ui/core/FormHelperText";
import { Colours } from "../../../styles/Constants.ts";

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
    uploadButton: {
        background: Colours.MainRed5,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 18,
        lineHeight: "24px",
        color: Colours.White,
        "&:hover": {
            backgroundColor: () => Colours.MainRed2,
        },
    },
}));

export default function UploadAssetModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
}) {
    const classes = useStyles();
    const [assetName, setAssetName] = React.useState("");
    const [objectType, setObjectType] = React.useState(ObjectTypes.OBJECT);
    const [fileType, setFileType] = React.useState(FileTypes.NONE);
    const [assetByteArray, setAssetByteArray] = React.useState(null);
    const [fileName, setFileName] = React.useState("");
    const [errors, setErrors] = React.useState({
        name: "",
        objectType: "Select an object type",
        fileType: "Select a file type",
        assetBlob: "Upload a file",
    });

    const clearFields = () => {
        setAssetName("");
        setObjectType(ObjectTypes.NONE);
        setFileType(FileTypes.NONE);
        setAssetByteArray(null);
        setErrors({
            name: "",
            objectType: "Select an object type",
            fileType: "Select a file type",
            assetBlob: "Upload a file",
        });
    };

    const handleAssetNameChange = (event) => {
        const response = event.target.value;
        setAssetName(response);
        setErrors({ ...errors, name: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,50}$/).test(response);
        if (!reg) {
            setErrors({
                ...errors,
                name:
                    "1-50 characters allowed (alphanumeric, dashes, or spaces)",
            });
        }
    };

    const handleObjectTypeChange = (event) => {
        setErrors({ ...errors, objectType: "" });

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
                    ...errors,
                    objectType:
                        "Object type must be either object or background",
                });
        }
    };

    const handleFileTypeChange = (event) => {
        setErrors({ ...errors, fileType: "" });

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
                    ...errors,
                    fileType: "File type must be either GLTF or GLB",
                });
        }
    };

    const handleUploadFileChange = (event) => {
        setErrors({ ...errors, assetBlob: "" });
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            fileToByteArray(file, setAssetByteArray);

            const name = file.name;
            const lastDot = name.lastIndexOf(".");
            const fileName = name.substring(0, lastDot);
            setFileName(fileName);
        }
    };

    const handleModalSubmitClick = async () => {
        await handleSubmit(assetName, fileType, objectType, assetByteArray);
        clearFields();
    };

    const isValidInput = () => {
        return (
            errors.name === "" &&
            errors.objectType === "" &&
            errors.fileType === "" &&
            errors.assetBlob === "" &&
            assetName.length > 0
        );
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
                        </Select>
                    </FormControl>
                    <FormHelperText>
                        {" "}
                        {errors.objectType ? errors.objectType : ""}{" "}
                    </FormHelperText>
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
                    <FormHelperText>
                        {" "}
                        {errors.fileType ? errors.fileType : ""}{" "}
                    </FormHelperText>
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
                    <FormHelperText>
                        {" "}
                        {errors.assetBlob
                            ? errors.assetBlob
                            : "File uploaded: " + fileName}{" "}
                    </FormHelperText>
                </div>
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalClose}> Cancel </Button>
                <Button
                    onClick={handleModalSubmitClick}
                    disabled={!isValidInput()}
                >
                    {"Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
