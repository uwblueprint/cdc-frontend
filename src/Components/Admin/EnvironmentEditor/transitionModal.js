import React, { useEffect } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";

export default function TransitionModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalTransitions,
}) {
    const [transitions, setTransitions] = React.useState([]);

    useEffect(() => {
        setTransitions(JSON.parse(JSON.stringify(originalTransitions)));
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

    const deleteTransition = (index) => {
        const tempTransitions = JSON.parse(JSON.stringify(transitions));
        tempTransitions.splice(index, 1);
        setTransitions(tempTransitions);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>Edit Transitions Order</DialogTitle>
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
                            <IconButton
                                onClick={() => deleteTransition(index)}
                                disabled={transitions.length === 1}
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
                        setTransitions(originalTransitions);
                        handleModalClose();
                    }}
                >
                    Cancel
                </Button>
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
