import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    deleteButton: {
        backgroundColor: "#F52000",
        color: "#ffffff",
    },
}));

export default function DeleteModal({
    open,
    confirmMessage,
    handleClose,
    handleSubmit,
}) {
    const classes = useStyles();
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>{confirmMessage}</DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} className={classes.deleteButton}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
