import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../navbar";
import EnvironmentBar from "./environmentBar";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
}));

export default function EnvironmentEditor() {
    const classes = useStyles();

    return (
        <div>
            <Navbar home />
            <div className={classes.page}>
                <EnvironmentBar />
                Hello
            </div>
        </div>
    );
}
