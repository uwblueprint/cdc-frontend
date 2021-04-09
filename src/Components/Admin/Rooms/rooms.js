import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function EscapeRooms() {
    const classes = useStyles();

    return (
        <Container component={"main"} maxWidth="xs">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="h1" variant="h5">
                    Escape Rooms Page
                </Typography>
            </div>
        </Container>
    );
}
