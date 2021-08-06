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

function NewlineText(string) {
    return string.split("\n").map((str, index) => (
        <p style={{ fontSize: 14, lineHeight: "16px" }} key={index}>
            {str}
        </p>
    ));
}

export default function DeleteModal({
    open,
    title = "",
    confirmMessage,
    handleClose,
    handleSubmit,
}) {
    const classes = useStyles();
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                {title}
                {NewlineText(confirmMessage)}
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} className={classes.deleteButton}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
