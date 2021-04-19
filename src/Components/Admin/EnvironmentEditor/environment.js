import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddIcon from "@material-ui/icons/Add";

import Navbar from "../navbar";
import EnvironmentBar from "./environmentBar";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
    container: {
        paddingTop: theme.spacing(12),
    },
    emptyButtonsContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "space-around",
    },
    buttonContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(4),
    },
    button: {
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: "#E2E5ED",
        borderRadius: "12px",
    },
}));

export default function EnvironmentEditor() {
    const classes = useStyles();

    return (
        <div>
            <Navbar home />
            <div className={classes.page}>
                <EnvironmentBar />
            </div>
            <div className={classes.container}>
                <div className={classes.emptyButtonsContainer}>
                    <div className={classes.buttonContainer}>
                        <Button
                            startIcon={<AddIcon />}
                            className={classes.button}
                        >
                            New Scene from Scratch
                        </Button>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button
                            startIcon={<AccountBalanceIcon />}
                            className={classes.button}
                        >
                            New Scene from Template
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
