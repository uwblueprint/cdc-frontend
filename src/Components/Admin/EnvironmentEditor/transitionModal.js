import React, { useEffect } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Button, IconButton } from "@material-ui/core";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginTop: theme.spacing(0.5),
        width: "20px",
        height: "20px",
        background: "#B9BECE",
        borderRadius: "100%",
        color: "white",
        float: "right",
    },
}));

export default function TransitionModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalTransitions,
}) {
    const classes = useStyles();
    const [transitions, setTransitions] = React.useState([]);

    useEffect(() => {
        setTransitions(originalTransitions);
    }, [originalTransitions]);

    const reorder = (transitions, startIndex, endIndex) => {
        const result = transitions;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const reorderTransitions = (sourceIndex, destinationIndex) => {
        if (
            sourceIndex == null ||
            destinationIndex == null ||
            sourceIndex === destinationIndex
        ) {
            return;
        }

        const reorderedList = reorder(
            transitions,
            sourceIndex,
            destinationIndex
        );

        setTransitions([...reorderedList]);
    };

    const addTransition = () => {
        const newTransition = {
            text: prompt("Enter the text for the transition: "),
        };

        setTransitions([...transitions, newTransition]);
    };

    const onMoveUpClick = (index) => {
        reorderTransitions(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderTransitions(index, Math.min(transitions.length - 1, index + 1));
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
                Modify Transitions
                <IconButton
                    className={classes.addButton}
                    aria-label="add"
                    onClick={addTransition}
                >
                    <AddIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {transitions.map((transition, index) => {
                    return (
                        <div key={transition.id}>
                            <h4>
                                Transition {index + 1} of {transitions.length}
                            </h4>
                            <p>{transition.text}</p>
                            <IconButton onClick={() => onMoveUpClick(index)}>
                                <KeyboardArrowUp />
                            </IconButton>
                            <IconButton onClick={() => onMoveDownClick(index)}>
                                <KeyboardArrowDown />
                            </IconButton>
                        </div>
                    );
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={() => handleSubmit(transitions)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
