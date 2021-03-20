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
import firebase from "firebase";
require("firebase/auth");
import { firebaseConfig } from "./firebaseCredentials.js";
import { AccountCircle } from "@material-ui/icons";

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

export default function Signup() {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [allErrors, setAllErrors] = useState({});

    function isNonEmptyForm() {
        return email.length > 0 && password.length > 0;
    }

    function createAccount(event) {
        event.preventDefault();
        const errors = {};

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                errors.login = "";
                window.location.replace("/admin");
            })
            .catch((error) => {
                errors.login = "Email or password is incorrect.";
                const errorCode = error.code;

                switch (errorCode) {
                    case "auth/email-already-in-use":
                        errors.email = "Email is already in use.";
                        break;
                    case "auth/invalid-email":
                        errors.email = "Email is invalid.";
                        break;
                    case "auth/operation-not-allowed":
                        errors.password =
                            "Email/password accounts are not enabled.";
                        break;
                    case "auth/weak-password":
                        errors.password = "Please enter a stronger password.";
                        break;
                    default:
                        errors.password = "An unexpected error has occurred.";
                        break;
                }
                setAllErrors(errors);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircle />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Signup
                </Typography>
                <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={createAccount}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="displayName"
                            label="Display Name"
                            name="display"
                            autoComplete="display-name"
                            autoFocus
                            onChange={(e) => setDisplayName(e.target.value)}
                            error={!empty(allErrors.displayName)}
                            helperText={allErrors.displayName}
                        />
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            error={!empty(allErrors.login)}
                            helperText={allErrors.login}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!isNonEmptyForm()}
                        >
                            Create Account
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </FirebaseAuthProvider>
            </div>
        </Container>
    );
}
