import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Colours } from "../../../styles/Constants.ts";

const useStyles = makeStyles(() => ({
    sceneItem: {
        display: "inline-flex",
        flexDirection: "column",
        backgroundColor: "#E2E5ED",
        padding: 16,
        userSelect: "none",
        margin: "0 16px 0 0",
        width: "300px",
        height: "300px",
    },
    sceneTopRow: {
        display: "flex",
        width: "100%",
        height: "90%",
        justifyContent: "center",
        marginTop: 140,
    },
    sceneBottomRow: {
        alignSelf: "flex-end",
    },
    menuItem: {
        "&:hover": {
            background: Colours.MainRed1,
            color: Colours.MainRed8,
        },
        "&:onclick": {
            background: Colours.MainRed5,
            color: Colours.White,
        },
        fontSize: 15,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 8,
        paddingBottom: 8,
    },
    menuItemDelete: {
        "&:hover": {
            background: Colours.MainRed1,
            color: Colours.MainRed8,
        },
        "&:onclick": {
            background: Colours.MainRed5,
            color: Colours.White,
        },
        color: Colours.MainRed5,
        fontSize: 15,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 8,
        paddingBottom: 10,
    },
}));

export default function SceneCard({
    scene,
    handleEditClick,
    handleEditHintsClick,
    handleDeleteClick,
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.sceneItem}>
            <div className={classes.sceneTopRow}>{scene.name}</div>
            <div className={classes.sceneBottomRow}>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
            </div>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: 0,
                    horizontal: 150,
                }}
                MenuListProps={{ disablePadding: true }}
                keepMounted
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => {
                        setAnchorEl(null);
                        handleEditClick(scene.id);
                    }}
                >
                    Edit Metadata
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => {
                        setAnchorEl(null);
                        handleEditHintsClick(scene.id);
                    }}
                >
                    Edit Scene Hints
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                    <a
                        href={
                            process.env.REACT_APP_ADMIN_BACKEND_URL +
                            "/admin/scene/" +
                            scene.id
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            color: "#000",
                        }}
                    >
                        Open Inspector
                    </a>
                </MenuItem>
                <MenuItem
                    className={classes.menuItemDelete}
                    onClick={() => {
                        setAnchorEl(null);
                        handleDeleteClick(scene.id);
                    }}
                >
                    Delete Scene
                </MenuItem>
            </Menu>
        </div>
    );
}
