import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../../firebaseCredentials.js";
import { UserContext } from "../../Providers/UserProviders";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Admin() {
    const classes = useStyles();
    const user = useContext(UserContext);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Admin Dashboard 😎
                </Typography>
                <Typography component="h1" variant="h6">
                    Welcome {user.displayName}
                </Typography>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                        auth.signOut();
                    }}
                >
                    Sign Out
                </Button>
            </div>
        </Container>
    );
}
