import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import empty from "is-empty";
import { FirebaseAuthProvider } from "@react-firebase/auth";
// import firebase from "firebase/app";
import firebase from "firebase";
require("firebase/auth");
import { firebaseConfig } from "./firebaseCredentials.js";
import { RotateLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function PasswordReset() {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [allErrors, setAllErrors] = useState({});

    function isNonEmptyForm() {
        return email.length > 0;
    }

    function sendResetEmail(event) {
        event.preventDefault();
        const errors = {};
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                setIsEmailSent(true);
                setTimeout(() => {
                    setIsEmailSent(false);
                }, 3000);
            })
            .catch(() => {
                errors.email =
                    "Error resetting password. Please check if email is valid.";
                setAllErrors(errors);
                setIsEmailSent(false);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <RotateLeft />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset your Password
                </Typography>
                <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={sendResetEmail}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            error={!empty(allErrors.email)}
                            helperText={allErrors.email}
                        />
                        {isEmailSent && (
                            <div className="test">
                                An email has been sent to you!
                            </div>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!isNonEmptyForm()}
                        >
                            Send Me a Reset Link
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/login" variant="body2">
                                    Back to Login page
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </FirebaseAuthProvider>
            </div>
        </Container>
    );
}
