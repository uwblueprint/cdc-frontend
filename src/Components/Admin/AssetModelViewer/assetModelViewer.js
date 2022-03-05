import React, { useEffect, useState, useRef } from "react";
import "@google/model-viewer";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
    getAsset,
    editAsset,
    editAssetScreenshot,
} from "../../../lib/assetEndpoints";
import { useErrorHandler } from "react-error-boundary";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { ObjectTypes } from "./objectTypes.ts";
import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: {
        width: 250,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 250,
    },
    // necessary for content to be below navbar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    textfields: {
        "& .MuiTextField-root": {
            margin: theme.spacing(2),
            width: 220,
        },
    },
    formControl: {
        margin: theme.spacing(2),
        width: 220,
    },
}));

export default function AssetModelViewer({
    match: {
        params: { assetId },
    },
}) {
    const classes = useStyles();
    const history = useHistory();
    const handleError = useErrorHandler();
    const [asset, setAsset] = useState({});
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [objectType, setObjectType] = useState(ObjectTypes.NONE);
    const [buttonText, setButtonText] = useState("Save");
    const [assetLink, setAssetLink] = useState("");

    const modelViewerRef = useRef(null);

    useEffect(() => {
        const getObjectAsset = async () => {
            const data = await getAsset(assetId, handleError);
            setName(data.name);

            switch (data.obj_type) {
                case ObjectTypes.OBJECT:
                    setObjectType(ObjectTypes.OBJECT);
                    break;
                case ObjectTypes.BACKGROUND:
                    setObjectType(ObjectTypes.BACKGROUND);
                    break;
                default:
                    setObjectType(ObjectTypes.NONE);
                    throw new Error(
                        "Object type must be either object or background"
                    );
            }

            setAssetLink(
                process.env.REACT_APP_ADMIN_ASSET_PREFIX + data.s3_key
            );
            setAsset(data);

            if (data.screenshot_url === "") {
                modelViewerRef.current.addEventListener("load", () => {
                    takeAssetScreenshot();
                });
            }
        };

        const takeAssetScreenshot = async () => {
            const blob = await modelViewerRef.current.toBlob();

            const response = await createPresignedLinkAndUploadS3(
                {
                    file_type: "png",
                    type: "image",
                    file_content: blob,
                },
                handleError,
                true
            );

            editAssetScreenshot(assetId, response.data.s3_key, handleError);
        };

        if (assetId) {
            getObjectAsset();
        }
    }, [assetId, handleError, modelViewerRef]);

    const handleNameChange = (event) => {
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setNameError(
                "Maximum of 50 characters allowed (alphanumeric, dashes, or spaces)"
            );
        } else {
            setNameError("");
        }

        setName(event.target.value);
    };

    const handleObjectTypeChange = (event) => {
        switch (event.target.value) {
            case ObjectTypes.OBJECT:
                setObjectType(ObjectTypes.OBJECT);
                break;
            case ObjectTypes.BACKGROUND:
                setObjectType(ObjectTypes.BACKGROUND);
                break;
            default:
                setObjectType(ObjectTypes.NONE);
                throw new Error(
                    "Object type must be either object or background"
                );
        }
    };

    async function updateAsset(event) {
        event.preventDefault();
        setButtonText("Saved!");
        setTimeout(() => {
            setButtonText("Save");
        }, 2000);
        editAsset(assetId, name, objectType, asset.s3_key, handleError);
    }

    const isEmpty = (error) => {
        return error === "";
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}>
                    <ArrowBack
                        style={{
                            width: 50,
                            height: 50,
                            paddingTop: 15,
                            paddingLeft: 10,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            history.push("/admin");
                        }}
                    />
                </div>
                <Divider />
                <form
                    className={classes.textfields}
                    noValidate
                    onSubmit={updateAsset}
                    autoComplete="off"
                >
                    <Typography
                        variant="h6"
                        align="center"
                        style={{ marginTop: 20 }}
                    >
                        Asset Model Viewer
                    </Typography>
                    <TextField
                        id="nameTextField"
                        label="Asset Name"
                        value={name}
                        onChange={handleNameChange}
                        variant="outlined"
                        error={!isEmpty(nameError)}
                        helperText={nameError}
                    />

                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel id="objectTypeLabel">
                            Object Type
                        </InputLabel>
                        <Select
                            labelId="objectTypeTextField"
                            label="Object Type"
                            id="demo-simple-select-helper"
                            value={objectType}
                            onChange={handleObjectTypeChange}
                            disabled
                        >
                            <MenuItem value={ObjectTypes.OBJECT}>
                                {ObjectTypes.OBJECT}
                            </MenuItem>
                            <MenuItem value={ObjectTypes.BACKGROUND}>
                                {ObjectTypes.BACKGROUND}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={!isEmpty(nameError)}
                        style={{ maxWidth: 220, marginLeft: 15 }}
                    >
                        {buttonText}
                    </Button>
                </form>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <model-viewer
                    ref={modelViewerRef}
                    src={assetLink}
                    alt="A 3D model of an astronaut"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    environment-image="neutral"
                    auto-rotate
                    camera-controls
                    style={{ width: "calc(95vw - 250px)", height: "80vh" }}
                ></model-viewer>
            </main>
        </div>
    );
}
