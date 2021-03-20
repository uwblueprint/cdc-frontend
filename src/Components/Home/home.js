import React from "react";
import Button from "@material-ui/core/Button";
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
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Home() {
    const classes = useStyles();

    return (
        <Container component={"main"} maxWidth="xs">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="h1" variant="h5">
                    Calgary Distress Centre 🤠
                </Typography>
            </div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                    window.location.replace("/login");
                }}
            >
                Login
            </Button>
        </Container>
    );
}
