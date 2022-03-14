import React, { useEffect, useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Colours } from "../../../styles/Constants.ts";
import "../../../styles/index.css";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginTop: theme.spacing(-0.5),
        marginLeft: theme.spacing(2),
        width: "20px",
        height: "20px",
        backgroundColor: Colours.MainRed5,
        borderRadius: "100%",
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
    },
    linkButton: {
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
        marginLeft: "15px",
        marginTop: "5px",
        marginBottom: "5px",
        borderRadius: "5px",
        backgroundColor: Colours.MainRed5,
        width: "128px",
        height: "32px",
        textTransform: "capitalize",
    },
    textField: {
        width: "550px",
    },
}));

export default function HintsModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalHints,
}) {
    const classes = useStyles();
    const [hints, setHints] = useState([]);

    useEffect(() => {
        const tempHints = _.cloneDeep(originalHints);
        setHints(tempHints);
    }, [originalHints]);

    const reorder = (hints, startIndex, endIndex) => {
        const result = hints;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleHintChange = (event, index) => {
        const newHint = event.target.value;
        if (newHint !== null) {
            const tempHints = _.cloneDeep(hints);
            tempHints[index] = newHint;
            setHints(tempHints);
        }
    };

    const reorderHints = (sourceIndex, destinationIndex) => {
        if (
            sourceIndex == null ||
            destinationIndex == null ||
            sourceIndex === destinationIndex
        ) {
            return;
        }

        const reorderedList = reorder(hints, sourceIndex, destinationIndex);

        setHints([...reorderedList]);
    };

    const addHint = () => {
        const newHint = "";
        setHints([...hints, newHint]);
    };

    const onMoveUpClick = (index) => {
        reorderHints(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderHints(index, Math.min(hints.length - 1, index + 1));
    };

    const deleteHint = (index) => {
        const tempHints = _.cloneDeep(hints);
        tempHints.splice(index, 1);
        setHints(tempHints);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
                Edit Hints
                <IconButton
                    className={classes.addButton}
                    aria-label="add"
                    onClick={addHint}
                >
                    <AddIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ width: 600 }}>
                {hints.map((hint, index) => {
                    return (
                        <div key={index}>
                            <h4>
                                {index + 1 !== hints.length
                                    ? "Hint " + (index + 1)
                                    : "Solution"}
                            </h4>
                            <div>
                                <TextField
                                    value={hint}
                                    onChange={(e) => handleHintChange(e, index)}
                                    className={classes.textField}
                                    required
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: 10,
                                        },
                                    }}
                                    placeholder={
                                        index + 1 !== hints.length
                                            ? "Hint text"
                                            : "Solution to the room"
                                    }
                                    multiline
                                />
                            </div>
                            <IconButton onClick={() => onMoveUpClick(index)}>
                                <KeyboardArrowUp />
                            </IconButton>
                            <IconButton onClick={() => onMoveDownClick(index)}>
                                <KeyboardArrowDown />
                            </IconButton>
                            <IconButton
                                onClick={() => deleteHint(index)}
                                disabled={hints.length === 1}
                            >
                                <DeleteForever />
                            </IconButton>
                        </div>
                    );
                })}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setHints(originalHints);
                        handleModalClose();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    disabled={hints.some(
                        (hint) => hint === null || hint === ""
                    )}
                    onClick={() => handleSubmit(hints)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
