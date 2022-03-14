import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Navbar from "./navbar.js";
import EscapeRooms from "./Rooms/rooms.js";
import Assets from "./Assets/assets.js";
import Statistics from "./Stats/stats.js";
import RoomModal from "./Rooms/roomModal";
import DeleteModal from "./common/deleteModal";
import UploadAssetModal from "./Assets/uploadAssetModal";
import {
    getAllScenarios,
    postScenario,
    editScenario,
    deleteScenario,
} from "../../lib/scenarioEndpoints";
import {
    getAllAssets,
    createAsset,
    deleteAsset,
} from "../../lib/assetEndpoints";
import { useErrorHandler } from "react-error-boundary";
import { createPresignedLinkAndUploadS3 } from "../../lib/s3Utility";
import { Colours } from "../../styles/Constants.ts";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component="div" variant="h5">
                        {children}
                    </Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function TabHelper(index) {
    return {
        id: `wrapped-tab-${index}`,
        "aria-controls": `wrapped-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(12),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    root: {
        flexGrow: 1,
        background: "#fafafa",
    },

    defaultTab: {
        maxWidth: "182px",
        height: "65px",
        top: "20px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: "18px",
        lineHeight: "25px",
        color: Colours.Grey5,
        textTransform: "capitalize",
        marginBottom: "17px",
        borderBottom: "solid",
        borderColor: Colours.Grey5,
        borderBottomWidth: "5px",
    },
    activeTab: {
        maxWidth: "182px",
        height: "65px",
        top: "20px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: "18px",
        lineHeight: "25px",
        color: Colours.MainRed5,
        textTransform: "capitalize",
        marginBottom: "17px",
    },
    tabs: {
        "& .MuiTabs-indicator": {
            backgroundColor: Colours.MainRed5,
        },
    },
    addButton: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1),
        width: "50px",
        height: "50px",
        background: Colours.MainRed5,
        borderRadius: "24.5px",
        color: "white",
        float: "right",
        "&:hover": {
            backgroundColor: () => Colours.MainRed2,
        },
    },
    tabBackground: {
        width: "1000px",
    },
    menuHeader: {
        color: Colours.Grey5,
        marginLeft: "16px",
        marginTop: "6px",
        marginBottom: "6px",
    },
}));

export default function Admin() {
    const classes = useStyles();
    const handleError = useErrorHandler();

    const [value, setValue] = useState("rooms");
    const [anchorEl, setAnchorEl] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shareAndPublishModalOpen, setShareAndPublishModalOpen] = useState(
        false
    );
    const [recentIsPublished, setRecentIsPublished] = useState(false);
    const [recentIsPreviewable, setRecentIsPreviewable] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [uploadAssetModalOpen, setUploadAssetModalOpen] = useState(false);
    const [deleteAssetModalOpen, setDeleteAssetModalOpen] = useState(false);
    const [environments, setEnvironments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [editRoom, setEditRoom] = useState({});
    const [mostRecentRoom, setMostRecentRoom] = useState({});
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [deleteAssetId, setDeleteAssetId] = useState(null);
    const [searchWord, setSearchWord] = useState("");
    const [assetSnackbarOpen, setAssetSnackbarOpen] = useState(false);
    const [shareSnackbarOpen, setShareSnackbarOpen] = useState(false);
    const open = Boolean(anchorEl);

    const getAllEnvironments = async (handleError) => {
        const data = await getAllScenarios(handleError);
        setEnvironments(data);
    };

    const getAllAssetsAction = async (handleError) => {
        const data = await getAllAssets(handleError);
        setAssets(data);
    };

    useEffect(() => {
        if (value === "rooms") {
            getAllEnvironments(handleError);
        } else if (value === "assets") {
            getAllAssetsAction(handleError);
        }
    }, [value, handleError]);

    const getTabStyle = (isActive) => {
        return isActive ? classes.activeTab : classes.defaultTab;
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAddButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAddButtonClose = () => {
        setAnchorEl(null);
    };

    const handleCreateRoomSubmit = async ({
        name,
        description,
        friendly_name,
        display_image_url,
    }) => {
        setCreateModalOpen(false);
        const resp = await postScenario(
            {
                name,
                description,
                friendly_name,
                display_image_url,
            },
            handleError
        );
        setEnvironments([...environments, resp.data]);
    };

    const handleEditRoomClick = (roomId) => {
        const room = environments.find(
            (environment) => environment.id === roomId
        );
        setEditRoom(room);
        setEditModalOpen(true);
    };

    const handleShareAndPublishClick = (roomId) => {
        const room = environments.find(
            (environment) => environment.id === roomId
        );
        setEditRoom(room);
        setMostRecentRoom(room);
        setShareAndPublishModalOpen(true);
    };

    const handleEditRoomSubmit = async ({
        name,
        description,
        friendly_name,
        is_published,
        is_previewable,
        expected_solve_time,
        display_image_url,
    }) => {
        setEditModalOpen(false);
        const resp = await editScenario(
            {
                id: editRoom.id,
                name,
                friendly_name,
                description,
                scene_ids: editRoom.scene_ids,
                is_published,
                is_previewable,
                expected_solve_time,
                display_image_url,
            },
            handleError
        );
        const replaceIndex = environments.findIndex(
            (env) => env.id === editRoom.id
        );
        const copiedEnvs = [...environments];
        copiedEnvs[replaceIndex] = resp.data;
        setEnvironments(copiedEnvs);
    };

    const handleShareAndPublishSubmit = async ({
        is_published,
        is_previewable,
    }) => {
        setRecentIsPublished(is_published);
        setRecentIsPreviewable(is_previewable);
        setEditModalOpen(false);
        setShareSnackbarOpen(true);
        const resp = await editScenario(
            {
                id: editRoom.id,
                name: editRoom.name,
                friendly_name: editRoom.friendly_name,
                description: editRoom.description,
                scene_ids: editRoom.scene_ids,
                is_published,
                is_previewable,
                expected_solve_time: editRoom.expected_solve_time,
                display_image_url: editRoom.display_image_url,
            },
            handleError
        );
        const replaceIndex = environments.findIndex(
            (env) => env.id === editRoom.id
        );
        const copiedEnvs = [...environments];
        copiedEnvs[replaceIndex] = resp.data;
        setEnvironments(copiedEnvs);
    };

    const handleEditRoomClose = () => {
        setEditModalOpen(false);
        setEditRoom({});
    };

    const handleShareAndPublishClose = () => {
        setShareAndPublishModalOpen(false);
        setEditRoom({});
    };

    const handleDeleteRoomClick = (roomId) => {
        setDeleteRoomId(roomId);
        setDeleteModalOpen(true);
    };

    const handleDeleteRoomCancel = () => {
        setDeleteRoomId(null);
        setDeleteModalOpen(false);
    };

    const handleDeleteRoomSubmit = async () => {
        await deleteScenario(deleteRoomId, handleError);

        const modifiedEnv = environments.filter(
            (env) => env.id !== deleteRoomId
        );
        setEnvironments(modifiedEnv);
        setDeleteRoomId(null);
        setDeleteModalOpen(false);
    };

    const handleUploadAssetClose = () => {
        setUploadAssetModalOpen(false);
    };

    const handleUploadAssetSubmit = async (
        name,
        file_type,
        object_type,
        asset
    ) => {
        setAssetSnackbarOpen(true);

        const response = await createPresignedLinkAndUploadS3(
            { file_type: file_type, type: "asset", file_content: asset },
            handleError
        );

        // Add new asset to Postgres
        const responseAssetCreation = await createAsset(
            {
                name: name,
                obj_type: object_type,
                s3_key: response.data.s3_key,
            },
            handleError
        );

        setAssets([...assets, responseAssetCreation.data]);
        setAssetSnackbarOpen(false);
    };

    const handleAssetSnackbarClose = () => {
        setAssetSnackbarOpen(false);
    };

    const handleDeleteAssetClick = (assetId) => {
        setDeleteAssetId(assetId);
        setDeleteAssetModalOpen(true);
    };

    const handleDeleteAssetCancel = () => {
        setDeleteAssetId(null);
        setDeleteAssetModalOpen(false);
    };

    const handleDeleteAssetSubmit = async () => {
        await deleteAsset(deleteAssetId, handleError);

        const modifiedAssets = assets.filter(
            (asset) => asset.id !== deleteAssetId
        );
        setAssets(modifiedAssets);
        setDeleteAssetId(null);
        setDeleteAssetModalOpen(false);
    };

    const onSearchChange = (event) => {
        setSearchWord(event.target.value);
    };

    const handleShareSnackbarClose = () => {
        setShareSnackbarOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Navbar
                    search
                    color="primary"
                    onSearchChange={onSearchChange}
                />
                <div className={classes.root}>
                    <IconButton
                        className={classes.addButton}
                        aria-label="delete"
                        onClick={handleAddButtonClick}
                    >
                        <AddIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                        keepMounted
                        open={open}
                        onClose={handleAddButtonClose}
                    >
                        <h3 className={classes.menuHeader}>New</h3>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                setUploadAssetModalOpen(true);
                            }}
                        >
                            Object Asset
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                setCreateModalOpen(true);
                            }}
                        >
                            Escape Room
                        </MenuItem>
                    </Menu>
                    <RoomModal
                        modalOpen={createModalOpen}
                        handleModalClose={() => {
                            setCreateModalOpen(false);
                        }}
                        handleSubmit={handleCreateRoomSubmit}
                    />
                    <RoomModal
                        modalOpen={editModalOpen}
                        handleModalClose={handleEditRoomClose}
                        handleSubmit={handleEditRoomSubmit}
                        room={editRoom}
                        isEdit
                    />
                    <RoomModal
                        modalOpen={shareAndPublishModalOpen}
                        handleModalClose={handleShareAndPublishClose}
                        handleSubmit={handleShareAndPublishSubmit}
                        room={editRoom}
                        isShareAndPublish
                    />
                    <Snackbar
                        open={shareSnackbarOpen}
                        autoHideDuration={5000}
                        onClose={handleShareSnackbarClose}
                    >
                        <Alert
                            onClose={handleShareSnackbarClose}
                            severity="success"
                            sx={{ width: "100%" }}
                        >
                            {"Share & Publish changes made to room"}
                            {mostRecentRoom.scene_ids?.length === 0 &&
                            (recentIsPublished || recentIsPreviewable) ? (
                                <>
                                    <br />
                                    <span>
                                        Note: There are no rooms in this
                                        environment, so users will see nothing
                                    </span>
                                </>
                            ) : null}
                        </Alert>
                    </Snackbar>
                    <DeleteModal
                        open={deleteModalOpen}
                        title="Delete Room"
                        confirmMessage="Are you sure you want to delete this room?"
                        handleClose={handleDeleteRoomCancel}
                        handleSubmit={handleDeleteRoomSubmit}
                    />
                    <UploadAssetModal
                        modalOpen={uploadAssetModalOpen}
                        handleModalClose={handleUploadAssetClose}
                        handleSubmit={handleUploadAssetSubmit}
                    />
                    <Snackbar
                        open={assetSnackbarOpen}
                        onClose={handleAssetSnackbarClose}
                    >
                        <Alert
                            onClose={handleAssetSnackbarClose}
                            severity="success"
                            sx={{ width: "100%" }}
                        >
                            Asset Upload started, will take a minute to show up.
                        </Alert>
                    </Snackbar>
                    <DeleteModal
                        open={deleteAssetModalOpen}
                        title="Delete Asset"
                        confirmMessage="Are you sure you want to delete this asset? It will delete ALL objects using this asset."
                        handleClose={handleDeleteAssetCancel}
                        handleSubmit={handleDeleteAssetSubmit}
                    />
                    <Tabs
                        value={value}
                        className={classes.tabs}
                        onChange={handleChange}
                    >
                        <Tab
                            disableRipple
                            className={getTabStyle(value === "rooms")}
                            value="rooms"
                            label="Escape Rooms"
                            {...TabHelper("rooms")}
                        />
                        <Tab
                            disableRipple
                            className={getTabStyle(value === "assets")}
                            value="assets"
                            label="Object Assets"
                            {...TabHelper("assets")}
                        />
                        <Tab
                            disableRipple
                            className={getTabStyle(value === "stats")}
                            value="stats"
                            label="Statistics"
                            {...TabHelper("stats")}
                        />
                    </Tabs>
                    <TabPanel
                        className={classes.tabBackground}
                        value={value}
                        index="rooms"
                    >
                        <EscapeRooms
                            environments={environments.filter((env) => {
                                return env.name
                                    .toLowerCase()
                                    .includes(searchWord.toLowerCase());
                            })}
                            handleEditRoomClick={handleEditRoomClick}
                            handleDeleteRoomClick={handleDeleteRoomClick}
                            handleShareAndPublishClick={
                                handleShareAndPublishClick
                            }
                        />
                    </TabPanel>
                    <TabPanel
                        className={classes.tabBackground}
                        value={value}
                        index="assets"
                    >
                        <Assets
                            assets={assets.filter((asset) => {
                                return asset.name
                                    .toLowerCase()
                                    .includes(searchWord.toLowerCase());
                            })}
                            handleDeleteAssetClick={handleDeleteAssetClick}
                        />
                    </TabPanel>
                    <TabPanel
                        className={classes.tabBackground}
                        value={value}
                        index="stats"
                    >
                        <Statistics />
                    </TabPanel>
                </div>
            </div>
        </Container>
    );
}
