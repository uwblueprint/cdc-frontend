import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import { isWhiteSpaceLike } from "typescript";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    buttonWrapper: {
        display: "flex",
        width: "300px",
        justifyContent: "space-between",
        float: "right",
    },
    button: {
        color: "white",
        backgroundColor: "#A0BBFF",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: "#A0BBFF",
        },
    },
}));

export default function EnvironmentBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar className={classes.toolbar}>
                    <IconButton aria-label="environment-menu" color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.buttonWrapper}>
                        <Button className={classes.button}> Preview </Button>
                        <Button className={classes.button}>
                            {" "}
                            Share and Publish{" "}
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
