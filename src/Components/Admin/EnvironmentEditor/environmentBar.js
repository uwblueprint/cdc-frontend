import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
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
}) {
    const classes = useStyles();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [addMenuAnchorEl, setAddMenuAnchorEl] = React.useState(null);
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
                            <MenuItem>Rename Escape Room</MenuItem>
                            <MenuItem>Copy Editor Link</MenuItem>
                            <MenuItem>Delete</MenuItem>
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
                        <Button className={classes.button}>
                            Share & Publish
                        </Button>
                        <Button>
                            <PlayArrowIcon className={classes.preview} />
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
