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
import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import { auth } from "../../firebaseCredentials.js";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(12),
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
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [allErrors, setAllErrors] = useState({});

    function isNonEmptyForm() {
        return email.length > 0 && password.length > 0;
    }

    async function createAccount(event) {
        event.preventDefault();
        const errors = {};

        try {
            const reg = new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/
            ).test(password);

            if (!reg) {
                const error = { code: "auth/weak-password" };
                throw error;
            }

            const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
            );
            user.sendEmailVerification().then(() => {
                user.updateProfile({ displayName }).then(() => {
                    auth.signOut();
                });
            });
            history.push("/login");
        } catch (error) {
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
                    errors.password =
                        "Password should contain one lowercase letter, one uppercase letter, one symbol, one number, and be at least 10 characters long.";
                    break;
                default:
                    errors.password = "An unexpected error has occurred.";
                    break;
            }
            setAllErrors(errors);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountCircle />
                </Avatar>
                <Typography component="div" variant="h5">
                    Signup
                </Typography>
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
                        error={!empty(allErrors.password)}
                        helperText={allErrors.password}
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
                        <Grid item xs style={{ textAlign: "center" }}>
                            <Link href="/login" style={{ fontSize: 14 }}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
