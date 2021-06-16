import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
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

import Navbar from "../navbar";
import DeleteModal from "../common/deleteModal";
import { getPuzzle, editPuzzle } from "../../../lib/puzzleEndpoints";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
    sceneAndTransitionContainer: {
        minWidth: 600,
    },
    introContainer: {
        minWidth: 850,
        display: "flex",
    },
    container: {
        paddingTop: theme.spacing(12),
    },
    dragAndDropContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: "16px",
    },
    emptyButtonsContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "space-around",
    },
    buttonContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(4),
    },
    button: {
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: "#E2E5ED",
        borderRadius: "12px",
    },
}));

export default function ObjectEditor({
    match: {
        params: { sceneId, objectId },
    },
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [puzzleBody, setPuzzleBody] = useState({});
    const [puzzleType, setPuzzleType] = useState("ordered-puzzle");
    const [isInteractable, setIsInteractable] = useState(false);
    const [transitions, setTransitions] = React.useState([]);

    const puzzleTypeList = [
        { value: "text-pane", label: "text-pane" },
        { value: "rotation-controls", label: "rotation-controls" },
        { value: "keypad", label: "keypad" },
        { value: "visual-pane", label: "visual-pane" },
        { value: "jigsaw-puzzle", label: "jigsaw-puzzle" },
        { value: "ordered-puzzle", label: "ordered-puzzle" },
    ];
    // const [scenes, setScenes] = useState([]);
    // const [createModalOpen, setCreateModalOpen] = useState(false);
    // const [editModalOpen, setEditModalOpen] = useState(false);
    // const [editSceneInfo, setEditSceneInfo] = useState({});
    // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    // const [deleteSceneId, setDeleteSceneId] = React.useState(null);
    // const [editTransitionInfo, setEditTransitionInfo] = useState([]);
    // const [editTransitionModalOpen, setEditTransitionModalOpen] = useState(
    //     false
    // );
    // const [selectedTransitionId, setSelectedTransitionId] = useState(0);

    useEffect(() => {
        const getPuzzleBody = async () => {
            const data = await getPuzzle(sceneId, objectId, handleError);
            setPuzzleBody(data.animations_json.blackboardData);
            setPuzzleType(puzzleBody.componentType);
            setIsInteractable(data.is_interactable);
            console.log(puzzleBody);
        };

        getPuzzleBody();
    }, [sceneId, objectId, handleError]);

    const selectPuzzleType = (obj) => {
        if (obj) {
            const data = puzzleBody;
            data.componentType = obj.value;
            setPuzzleBody(data);
            setPuzzleType(obj.value);
            console.log(puzzleBody);
        }
    };

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

    const deleteTransition = (index) => {
        const tempTransitions = JSON.parse(JSON.stringify(transitions));
        tempTransitions.splice(index, 1);
        setTransitions(tempTransitions);
    };

    const handleSubmit = (obj) => {
        const savePuzzle = async () => {
            const data = await editPuzzle(
                sceneId,
                objectId,
                isInteractable,
                puzzleBody,
                handleError
            );
        };

        savePuzzle();
    };

    const handleRemove = (text) => {
        const newBody = puzzleBody;
        const newList = newBody.jsonData.data.filter(
            (item) => item.text !== text
        );
        newBody.jsonData.data = newList;
        setPuzzleBody(newBody);
    };

    const handleAdd = (text) => {
        const newBody = puzzleBody;
        if (!newBody.jsonData.data) {
            newBody.jsonData.data = [{ text: text }];
        } else {
            const newList = newBody.jsonData.data.concat({ text: text });
            newBody.jsonData.data = newList;
        }
        setPuzzleBody(newBody);
    };

    return (
        <div className={classes.container}>
            <p>
                Hello World! scene: {sceneId}, object: {objectId}{" "}
                {puzzleBody.componentType}
            </p>
            {isInteractable ? (
                <Select
                    value={puzzleTypeList.filter(
                        (option) => option.value === puzzleType
                    )}
                    options={puzzleTypeList}
                    placeholder="Select puzzle type..."
                    noResultsText="No puzzle types found"
                    searchable={true}
                    onChange={selectPuzzleType}
                />
            ) : null}
            {isInteractable && puzzleType === "text-pane" ? (
                // <Dialog>
                //     <DialogTitle>
                //         Modify Transitions
                //         <IconButton
                //             className={classes.addButton}
                //             aria-label="add"
                //             onClick={addTransition}
                //         >
                //             <AddIcon />
                //         </IconButton>
                //     </DialogTitle>
                //     <DialogContent>
                //         {transitions.map((transition, index) => {
                //             return (
                //                 <div key={transition.id}>
                //                     <h4>
                //                         Transition {index + 1} of{" "}
                //                         {transitions.length}
                //                     </h4>
                //                     <p>{transition.text}</p>
                //                     <IconButton
                //                         onClick={() => onMoveUpClick(index)}
                //                     >
                //                         <KeyboardArrowUp />
                //                     </IconButton>
                //                     <IconButton
                //                         onClick={() => onMoveDownClick(index)}
                //                     >
                //                         <KeyboardArrowDown />
                //                     </IconButton>
                //                     <IconButton
                //                         onClick={() => deleteTransition(index)}
                //                         disabled={transitions.length === 1}
                //                     >
                //                         <DeleteForever />
                //                     </IconButton>
                //                 </div>
                //             );
                //         })}
                //     </DialogContent>
                //     <DialogActions>
                //         <Button color="primary" onClick={() => handleSubmit()}>
                //             Save
                //         </Button>
                //     </DialogActions>
                // </Dialog>
                <div>
                    <ul>
                        {puzzleBody.jsonData.data.map((item) => (
                            <li key={item.text}>
                                <span>{item.text}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item.text)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input type="text" />
                        <button type="button" onClick={handleAdd}>
                            Add
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
