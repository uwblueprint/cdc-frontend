import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
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
import { useHistory } from "react-router-dom";

import { auth } from "../../firebaseCredentials.js";
import { UserContext } from "../../Providers/UserProviders";
import EscapeRooms from "./Rooms/rooms.js";
import Assets from "./Assets/assets.js";
import Statistics from "./Stats/stats.js";
import RoomModal from "./Rooms/roomModal";
import DeleteModal from "./common/deleteModal";
import {
    getAllScenarios,
    postScenario,
    editScenario,
    deleteScenario,
} from "../../lib/endpoints";

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
                    <Typography>{children}</Typography>
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
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        flexGrow: 1,
        background: "#fafafa",
    },
    tab: {
        maxWidth: "182px",
        height: "65px",
        background: "#E4EBFF",
        borderTopRightRadius: "32px",
        borderTopLeftRadius: "32px",
        top: "20px",
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: "18px",
        lineHeight: "20px",
        color: "#737272",
        textTransform: "capitalize",
        marginBottom: "10px",
    },
    addButton: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(1),
        width: "50px",
        height: "50px",
        background: "#B9BECE",
        borderRadius: "24.5px",
        color: "white",
        float: "right",
    },
    tabBackground: {
        background: "#E4EBFF",
        width: "1000px",
        borderBottomRightRadius: "32px",
        borderBottomLeftRadius: "32px",
        borderTopRightRadius: "32px",
    },
}));

export default function Admin() {
    const classes = useStyles();
    const user = useContext(UserContext);

    const history = useHistory();
    const [value, setValue] = React.useState("rooms");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [createModalOpen, setCreateModalOpen] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [environments, setEnvironments] = React.useState([]);
    const [editRoom, setEditRoom] = React.useState({});
    const [deleteRoomId, setDeleteRoomId] = React.useState(null);
    const open = Boolean(anchorEl);

    const getAllEnvironments = async () => {
        const data = await getAllScenarios();
        setEnvironments(data);
    };

    useEffect(() => {
        if (value === "rooms") {
            getAllEnvironments();
        }
    }, [value]);

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
    }) => {
        setCreateModalOpen(false);
        const resp = await postScenario({ name, description, friendly_name });
        setEnvironments([...environments, resp.data]);
    };

    const handleEditRoomClick = (roomId) => {
        const room = environments.find(
            (environment) => environment.id === roomId
        );
        setEditRoom(room);
        setEditModalOpen(true);
    };

    const handleEditRoomSubmit = async ({
        name,
        description,
        friendly_name,
    }) => {
        setEditModalOpen(false);
        const resp = await editScenario({
            id: editRoom.id,
            name,
            friendly_name,
            description,
            scene_ids: editRoom.scene_ids,
            is_published: editRoom.is_published,
            is_previewable: editRoom.is_previewable,
        });
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

    const handleDeleteRoomClick = (roomId) => {
        setDeleteRoomId(roomId);
        setDeleteModalOpen(true);
    };

    const handleDeleteRoomCancel = () => {
        setDeleteRoomId(null);
        setDeleteModalOpen(false);
    };

    const handleDeleteRoomSubmit = async () => {
        await deleteScenario(deleteRoomId);
        const modifiedEnv = environments.filter(
            (env) => env.id !== deleteRoomId
        );
        setEnvironments(modifiedEnv);
        setDeleteRoomId(null);
        setDeleteModalOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Admin Dashboard 😎
                </Typography>
                <Typography component="h1" variant="h6">
                    Welcome {user.displayName}
                </Typography>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                        history.push("/login");
                        auth.signOut();
                    }}
                >
                    Sign Out
                </Button>

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
                        <MenuItem>Object Upload</MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                setCreateModalOpen(true);
                            }}
                        >
                            New Escape Room
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
                    <DeleteModal
                        open={deleteModalOpen}
                        confirmMessage="Are you sure you want to delete this room?"
                        handleClose={handleDeleteRoomCancel}
                        handleSubmit={handleDeleteRoomSubmit}
                    />
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        onChange={handleChange}
                    >
                        <Tab
                            className={classes.tab}
                            value="rooms"
                            label="Escape Rooms"
                            {...TabHelper("rooms")}
                        />
                        <Tab
                            className={classes.tab}
                            value="assets"
                            label="Object Assets"
                            {...TabHelper("assets")}
                        />
                        <Tab
                            className={classes.tab}
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
                            environments={environments}
                            handleEditRoomClick={handleEditRoomClick}
                            handleDeleteRoomClick={handleDeleteRoomClick}
                        />
                    </TabPanel>
                    <TabPanel
                        className={classes.tabBackground}
                        value={value}
                        index="assets"
                    >
                        <Assets />
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
