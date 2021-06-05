import React, { useEffect } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Button, IconButton } from "@material-ui/core";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

export default function TransitionModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalTransitions,
}) {
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

    const onMoveUpClick = (index) => {
        reorderTransitions(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderTransitions(index, Math.min(transitions.length - 1, index + 1));
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>Edit Transitions Order</DialogTitle>
            <DialogContent>
                {transitions.map((transition, index) => {
                    return (
                        <div key={transition.id}>
                            <h4>{transition.text}</h4>
                            <h5>
                                Transition {index + 1} of {transitions.length}
                            </h5>
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
