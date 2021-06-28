import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../../../firebaseCredentials";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

export default function ErrorModal({ error, resetErrorBoundary }) {
    const classes = useStyles();
    const history = useHistory();

    let code,
        message = null;

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        code =
            error.response.data.title +
            " : Status " +
            error.response.data.status;
        message = error.response.data.message;
    } else {
        message = error.message;
    }

    return (
        <Dialog open={true}>
            <DialogTitle id="error-title">
                {"Oops something went wrong..."}
            </DialogTitle>
            <DialogContent>{code}</DialogContent>
            <DialogContent>{message}</DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button
                    onClick={() => {
                        // TODO: send email to us
                    }}
                >
                    Report
                </Button>
                <Button
                    onClick={() => {
                        // 403, signout, go to /login route
                        if (error?.response?.data?.status === 403) {
                            auth.signOut();
                            history.push("/login");
                        }
                        resetErrorBoundary();
                    }}
                >
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}
