import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    closeButton: {
        backgroundColor: "#6AADD6",
        color: "#ffffff",
    },
}));

export default function ErrorModal({ error, resetErrorBoundary }) {
    const classes = useStyles();
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
                    onClick={resetErrorBoundary}
                    className={classes.deleteButton}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
