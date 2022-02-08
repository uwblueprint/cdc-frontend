import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { useErrorHandler } from "react-error-boundary";

import RoomModal from "../Rooms/roomModal";
import DeleteModal from "../common/deleteModal";
import { deleteScenario, editScenario } from "../../../lib/scenarioEndpoints";
import { Colours } from "../../../styles/Constants.ts";
import "../../../styles/index.css";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        marginTop: theme.spacing(8),
        backgroundColor: Colours.Grey7,
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    add: {
        width: 25,
        height: 25,
        color: Colours.White,
    },
    expand: {
        width: 12,
        height: 12,
        color: Colours.White,
    },
    preview: {
        width: 30,
        height: 30,
        color: Colours.White,
    },
    buttonWrapperRight: {
        display: "flex",
        width: "300px",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    buttonWrapperLeft: {
        display: "flex",
        width: "250px",
    },
    button: {
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
        borderRadius: "5px",
        backgroundColor: Colours.MainRed5,
        width: "164px",
        height: "44px",
        textTransform: "capitalize",
    },
    menuHeader: {
        color: Colours.Grey5,
        marginLeft: "16px",
        marginTop: "6px",
        marginBottom: "6px",
    },
}));

export default function EnvironmentBar({
    onCreateButtonClick,
    onTemplateButtonClick,
    initialEnv,
}) {
    const classes = useStyles();
    const history = useHistory();
    const handleError = useErrorHandler();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
    const [shareAndPublishModalOpen, setShareAndPublishModalOpen] = useState(
        false
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [environment, setEnvironment] = useState({});

    useEffect(() => {
        setEnvironment(initialEnv);
    }, [initialEnv]);

    const menuOpen = Boolean(menuAnchorEl);
    const addMenuOpen = Boolean(addMenuAnchorEl);

    const onMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const onMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const onAddMenuClick = (event) => {
        setAddMenuAnchorEl(event.currentTarget);
    };

    const onAddMenuClose = () => {
        setAddMenuAnchorEl(null);
    };

    const handleCreateButtonClick = () => {
        setAddMenuAnchorEl(null);
        onCreateButtonClick();
    };

    const handleTemplateButtonClick = () => {
        setAddMenuAnchorEl(null);
        onTemplateButtonClick();
    };

    const handleDeleteRoomClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteRoomCancel = () => {
        setDeleteModalOpen(false);
    };

    const handleDeleteRoomSubmit = async () => {
        await deleteScenario(environment.id, handleError);
        history.push("/admin");
        setDeleteModalOpen(false);
    };

    const handleShareAndPublishClick = () => {
        setShareAndPublishModalOpen(true);
    };

    const handleShareAndPublishClose = () => {
        setShareAndPublishModalOpen(false);
    };

    const handleShareAndPublishSubmit = async ({
        is_published,
        is_previewable,
    }) => {
        setShareAndPublishModalOpen(false);
        const resp = await editScenario(
            {
                id: environment.id,
                name: environment.name,
                friendly_name: environment.friendly_name,
                description: environment.description,
                scene_ids: environment.scene_ids,
                is_published,
                is_previewable,
                expected_solve_time: environment.expected_solve_time,
                display_image_url: environment.display_image_url,
            },
            handleError
        );

        setEnvironment(resp.data);
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.buttonWrapperLeft}>
                        <Button
                            aria-label="environment-menu"
                            color="inherit"
                            onClick={onMenuClick}
                        >
                            <MenuIcon />
                        </Button>

                        <Menu
                            anchorEl={menuAnchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            keepMounted
                            open={menuOpen}
                            onClose={onMenuClose}
                        >
                            <h3 className={classes.menuHeader}>Menu</h3>
                            <MenuItem disabled>Rename Escape Room</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchorEl(null);
                                    navigator.clipboard.writeText(
                                        process.env
                                            .REACT_APP_ADMIN_DEPLOYED_URL +
                                            `admin/environment/${environment.id}`
                                    );
                                }}
                            >
                                Copy Editor Link
                            </MenuItem>
                            <MenuItem onClick={handleDeleteRoomClick}>
                                Delete
                            </MenuItem>
                        </Menu>
                        <Button
                            startIcon={<AddIcon className={classes.add} />}
                            endIcon={
                                <ExpandMoreIcon className={classes.expand} />
                            }
                            onClick={onAddMenuClick}
                        ></Button>
                        <Menu
                            anchorEl={addMenuAnchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            keepMounted
                            open={addMenuOpen}
                            onClose={onAddMenuClose}
                        >
                            <h3 className={classes.menuHeader}>New Scene</h3>
                            <MenuItem onClick={handleCreateButtonClick}>
                                From Scratch
                            </MenuItem>
                            <MenuItem onClick={handleTemplateButtonClick}>
                                From Template
                            </MenuItem>
                        </Menu>
                    </div>
                    <div className={classes.buttonWrapperRight}>
                        <Button
                            className={classes.button}
                            onClick={handleShareAndPublishClick}
                        >
                            Share & Publish
                        </Button>
                        <Button>
                            <a
                                href={
                                    process.env.REACT_APP_DEPLOYED_URL +
                                    environment.friendly_name
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <PlayArrowIcon className={classes.preview} />
                            </a>
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <RoomModal
                modalOpen={shareAndPublishModalOpen}
                handleModalClose={handleShareAndPublishClose}
                handleSubmit={handleShareAndPublishSubmit}
                room={environment}
                isShareAndPublish
            />
            <DeleteModal
                open={deleteModalOpen}
                title="Delete Room"
                confirmMessage="Are you sure you want to delete this room?"
                handleClose={handleDeleteRoomCancel}
                handleSubmit={handleDeleteRoomSubmit}
            />
        </div>
    );
}
