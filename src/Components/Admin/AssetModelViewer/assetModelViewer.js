import React, { useEffect, useState } from "react";
import "@google/model-viewer";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoubleArrow from "@material-ui/icons/DoubleArrow";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { getAsset, editAsset } from "../../../lib/assetEndpoints";
import { useErrorHandler } from "react-error-boundary";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    textfields: {
        "& .MuiTextField-root": {
            margin: theme.spacing(2),
            width: 205,
        },
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
    const [objectType, setObjectType] = useState("");

    useEffect(() => {
        console.log("using effect");
        const getObjectAsset = async () => {
            const data = await getAsset(assetId, handleError);
            setAsset(data);
        };

        if (assetId) {
            getObjectAsset();
        }
    }, [assetId, handleError]);

    async function updateAsset(event) {
        event.preventDefault();
        console.log(asset);
        console.log(asset.name);
        console.log(asset.obj_type);

        const s3_key = asset.s3_key;

        editAsset({ assetId, name, objectType, s3_key }, handleError);
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
                        id="outlined-helperText"
                        label="Asset Name"
                        defaultValue={asset.name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-helperText"
                        label="Object Type"
                        defaultValue={asset.obj_type}
                        onChange={(e) => setObjectType(e.target.value)}
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </form>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <model-viewer
                    src="Astronaut.gltf"
                    alt="A 3D model of an astronaut"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    environment-image="neutral"
                    auto-rotate
                    camera-controls
                ></model-viewer>
            </main>
        </div>
    );
}
