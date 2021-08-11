import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Navbar from "../Admin/navbar.js";
import empty from "is-empty";
import { useHistory } from "react-router-dom";
import { useErrorHandler } from "react-error-boundary";

import { UserContext } from "../../Providers/UserProviders.jsx";
import { auth, Auth } from "../../firebaseCredentials.js";
import { httpPost } from "../../lib/dataAccess";
import { LoginErrors } from "./loginErrors.ts";

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

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const handleError = useErrorHandler();

    const { reloadUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allErrors, setAllErrors] = useState({});

    function isNonEmptyForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const errors = {};

        auth.setPersistence(Auth.Persistence.SESSION);

        await auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                // Get the user's ID token as it is needed to exchange for a session cookie.
                auth.currentUser.getIdToken().then(async (idToken) => {
                    try {
                        const response = await httpPost(
                            "/admin_login",
                            {
                                idToken: idToken,
                            },
                            true
                        );

                        reloadUser();
                        return response;
                    } catch (error) {
                        handleError(error);
                        errors.login = error.response.data.message;

                        // Given the nesting of logic here, the "user" object has already been updated
                        // so our routing will begin using admin routes. This signout ensures the user
                        // remains in the login/signup screens (ie. non-admin routes).
                        auth.signOut();
                    }
                });
            })
            .catch((error) => {
                setErrorMessage(error, errors);
            });

        setAllErrors(errors);
        if (!errors.email && !errors.login) {
            history.push("/admin");
        }
    }

    function setErrorMessage(error, errors) {
        const errorCode = error.code;
        switch (errorCode) {
            case "auth/invalid-email":
                errors.email = LoginErrors.InvalidEmail;
                break;
            case "auth/user-disabled":
                errors.email = LoginErrors.UserDisabled;
                break;
            case "auth/wrong-password":
                errors.login = LoginErrors.WrongPassword;
                break;
            case "auth/user-not-found":
                errors.email = LoginErrors.UserNotFound;
                break;
            default:
                handleError(error);
                errors.login = error.message;
                auth.signOut();
                break;
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Navbar color="primary" />
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="div" variant="h5">
                    Login
                </Typography>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!isNonEmptyForm()}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                href="/passwordReset"
                                style={{ fontSize: 14 }}
                            >
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href="/signup"
                                style={{ fontSize: 14, textAlign: "right" }}
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
