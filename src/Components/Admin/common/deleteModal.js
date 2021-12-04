import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { Colours } from "../../../styles/Constants.ts";

const useStyles = makeStyles(() => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 20,
    },
    dialogTitle: {
        color: Colours.Grey9,
        fontSize: 28,
        fontWeight: "bold",
        height: 38,
    },
    dialogText: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "20px",
        lineHeight: "27px",
        color: Colours.Grey8,
    },
    yesButton: {
        background: Colours.MainRed5,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 14,
        lineHeight: "22px",
        color: Colours.White,
    },
    noButton: {
        background: Colours.Grey3,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 14,
        lineHeight: "22px",
        color: Colours.Black,
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
            <DialogContent style={{ width: 408, height: 133 }}>
                <DialogTitle
                    style={{
                        borderBottom: "1px solid #D5E1EE",
                        padding: 0,
                        paddingBottom: 5,
                    }}
                >
                    <span className={classes.dialogTitle}>{title}</span>
                </DialogTitle>
                <span className={classes.dialogText}>
                    {NewlineText(confirmMessage)}
                </span>
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleClose} className={classes.noButton}>
                    No
                </Button>
                <Button onClick={handleSubmit} className={classes.yesButton}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
