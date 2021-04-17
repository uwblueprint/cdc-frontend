import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        marginTop: theme.spacing(8),
        backgroundColor: "#8196CC",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    buttonWrapperRight: {
        display: "flex",
        width: "300px",
        justifyContent: "space-between",
        float: "right",
    },
    buttonWrapperLeft: {
        display: "flex",
        width: "250px",
        justifyContent: "space-between",
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
            <AppBar position="fixed" className={classes.appBar} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.buttonWrapperLeft}>
                        <IconButton
                            aria-label="environment-menu"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button
                            className={classes.button}
                            startIcon={<AddIcon />}
                            endIcon={<ExpandMoreIcon />}
                        >
                            {" "}
                            New Scene{" "}
                        </Button>
                    </div>
                    <div className={classes.buttonWrapperRight}>
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
