import React, { useEffect, useState } from "react";
import "@google/model-viewer";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { getAsset, editAsset } from "../../../lib/assetEndpoints";
import { useErrorHandler } from "react-error-boundary";
import SaveIcon from "@material-ui/icons/Save";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { ObjectTypes } from "./objectTypes.ts";

const drawerWidth = 17;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: {
        width: drawerWidth + "vw",
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth + "vw",
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
            width: "15vw",
        },
    },
    formControl: {
        margin: theme.spacing(2),
        width: "15vw",
    },
}));

export default function AssetModelViewer({
    match: {
        params: { assetId },
    },
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [asset, setAsset] = useState({});
    const [name, setName] = useState("");
    const [objectType, setObjectType] = useState(ObjectTypes.NONE);
    const [buttonText, setButtonText] = useState("Save");
    const [assetLink, setAssetLink] = useState("");

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
        };

        if (assetId) {
            getObjectAsset();
        }
    }, [assetId, handleError]);

    const handleNameChange = (event) => {
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
                <div className={classes.toolbar} />
                <Divider />

                <form
                    className={classes.textfields}
                    noValidate
                    onSubmit={updateAsset}
                    autoComplete="off"
                >
                    <Typography variant="h6" align="center">
                        Asset Model Viewer
                    </Typography>
                    <TextField
                        id="nameTextField"
                        label="Asset Name"
                        value={name}
                        onChange={handleNameChange}
                        variant="outlined"
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
                    >
                        {buttonText}
                    </Button>
                </form>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <model-viewer
                    src={assetLink}
                    alt="A 3D model of an astronaut"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    environment-image="neutral"
                    auto-rotate
                    camera-controls
                    style={{ width: 100 - drawerWidth + "vw", height: "80vh" }}
                ></model-viewer>
            </main>
        </div>
    );
}
