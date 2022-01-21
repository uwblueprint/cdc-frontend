import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Colours } from "../../styles/Constants.ts";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(12),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        background: Colours.MainRed5,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 18,
        lineHeight: "24px",
        color: Colours.White,
        "&:hover": {
            backgroundColor: () => Colours.MainRed2,
        },
    },
}));

export default function Home() {
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        history.push("/login");
    }, [history]);

    return (
        <Container component={"main"} maxWidth="xs">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="div" variant="h5">
                    Distress Centre Calgary 🤠
                </Typography>
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
            </div>
        </Container>
    );
}
