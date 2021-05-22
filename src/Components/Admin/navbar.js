import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import HomeIcon from "@material-ui/icons/Home";

import { httpGet } from "../../lib/dataAccess";
import { auth } from "../../firebaseCredentials";
import { UserContext } from "../../Providers/UserProviders";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    profileEnd: {
        marginLeft: "auto",
    },
    menu: {
        marginTop: "5px",
        marginRight: "5px",
    },
}));

export default function Navbar({ home }) {
    const classes = useStyles();
    const history = useHistory();
    const user = useContext(UserContext);
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

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar style={{ display: "flex" }}>
                    {home && (
                        <IconButton onClick={handleHomeClick} color="inherit">
                            <HomeIcon />
                        </IconButton>
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
                                <MenuItem onClick={handleClose}>
                                    Documentation
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    onClick={async () => {
                                        handleClose();
                                        history.push("/login");
                                        auth.signOut();
                                        await httpGet(
                                            process.env
                                                .REACT_APP_ADMIN_BASE_ENDPOINT +
                                                "admin_logout"
                                        );
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
