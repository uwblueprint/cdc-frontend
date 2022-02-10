import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import HomeIcon from "@material-ui/icons/Home";
import { useErrorHandler } from "react-error-boundary";

import { httpGet } from "../../lib/dataAccess";
import { auth } from "../../firebaseCredentials";
import { UserContext } from "../../Providers/UserProviders";
import "../../styles/index.css";
import { Colours } from "../../styles/Constants.ts";
import HoudiniLogoBlack from "../Images/houdini-logo-black.png";
import HoudiniLogoRed from "../Images/houdini-logo-red.png";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        color: Colours.Grey7,
    },
    profileEnd: {
        marginLeft: "auto",
    },
    menu: {
        marginTop: "0px",
        marginRight: "0px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "center",
    },
    roomName: {
        position: "absolute",
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    search: {
        position: "absolute",
        borderRadius: "4px",
        backgroundColor: Colours.White,
        marginLeft: "431px",
        height: "37px",
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: Colours.Grey6,
    },
    inputRoot: {
        color: Colours.Grey6,
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        [theme.breakpoints.up("md")]: {
            width: "579px",
        },
    },
    menuHeader: {
        color: Colours.Grey5,
        marginLeft: "16px",
        marginTop: "6px",
        marginBottom: "6px",
    },
}));

export default function Navbar({
    home,
    search,
    color,
    roomName,
    onSearchChange,
}) {
    const classes = useStyles();
    const history = useHistory();
    const handleError = useErrorHandler();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleHomeClick = () => {
        history.push("/admin");
    };

    async function handleLogout() {
        handleClose();

        try {
            await httpGet(
                process.env.REACT_APP_ADMIN_BASE_ENDPOINT + "admin_logout"
            );
            auth.signOut();
            history.push("/login");
        } catch (error) {
            handleError(error);
        }
    }

    const { user } = useContext(UserContext);

    return (
        <div className={classes.root}>
            <AppBar position="fixed" color={color}>
                <Toolbar className={classes.toolbar}>
                    <img
                        src={home ? HoudiniLogoBlack : HoudiniLogoRed}
                        alt="Application logo"
                        style={{ height: 50, cursor: "pointer" }}
                        onClick={handleHomeClick}
                    />
                    {home && (
                        <>
                            <IconButton
                                onClick={handleHomeClick}
                                color="inherit"
                            >
                                <HomeIcon />
                            </IconButton>
                            <Typography className={classes.roomName}>
                                {roomName}
                            </Typography>
                        </>
                    )}
                    {search && (
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search for objects and environments"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ "aria-label": "search" }}
                                onChange={onSearchChange}
                            />
                        </div>
                    )}
                    {user && (
                        <div className={classes.profileEnd}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={open}
                                onClose={handleClose}
                                className={classes.menu}
                            >
                                <h3 className={classes.menuHeader}>Actions</h3>
                                <MenuItem disabled onClick={handleClose}>
                                    Account Settings
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Log out
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
