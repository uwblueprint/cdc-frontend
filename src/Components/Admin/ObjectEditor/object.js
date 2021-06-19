import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
import AddIcon from "@material-ui/icons/Add";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import Dialog from "@material-ui/core/Dialog";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";

// import { getPuzzle } from "../../../lib/puzzleEndpoints";
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
    const [texts, setTexts] = React.useState([]);

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
            const puzBody = data.animations_json.blackboardData;
            if (puzBody.componentType === "text-pane") {
                const tempTexts = puzBody.jsonData.data;
                for (let i = 0; i < puzBody.jsonData.data.length; i++) {
                    tempTexts[i]["index"] = i;
                }
                setTexts(tempTexts);
            }
        };
        if (!puzzleBody.componentType) {
            getPuzzleBody();
        }
    }, [sceneId, objectId, puzzleBody, handleError]);

    const selectPuzzleType = (obj) => {
        if (obj) {
            const data = puzzleBody;
            data.componentType = obj.value;
            setPuzzleBody(data);
            setPuzzleType(obj.value);
            // console.log(texts);
        }
    };

    const reorder = (texts, startIndex, endIndex) => {
        const result = texts;
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

        const reorderedList = reorder(texts, sourceIndex, destinationIndex);

        setTexts([...reorderedList]);
    };

    const addTransition = () => {
        const newTransition = {
            text: prompt("Enter the text for the transition: "),
            index: texts.length,
        };

        setTexts([...texts, newTransition]);
    };

    const onMoveUpClick = (index) => {
        reorderTransitions(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderTransitions(index, Math.min(texts.length - 1, index + 1));
    };

    const deleteTransition = (index) => {
        const tempTexts = JSON.parse(JSON.stringify(texts));
        tempTexts.splice(index, 1);
        setTexts(tempTexts);
    };

    const handleSubmit = () => {
        const puzzleBodyCopy = puzzleBody;
        const textsCopy = texts;
        for (let i = 0; i < textsCopy.length; i++) {
            delete textsCopy["index"];
        }
        puzzleBodyCopy.jsonData.data = textsCopy;
        // console.log(puzzleBodyCopy);
        const savePuzzle = async () => {
            await editPuzzle(
                { sceneId, objectId, isInteractable, puzzleBodyCopy },
                handleError
            );
        };

        savePuzzle();
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
                <div>
                    <div>
                        Modify Texts
                        <IconButton
                            className={classes.addButton}
                            aria-label="add"
                            onClick={addTransition}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                    <div>
                        {texts.map((item) => {
                            return (
                                <div key={item.index}>
                                    <h4>
                                        Text {item.index + 1} of {texts.length}
                                    </h4>
                                    <p>{item.text}</p>
                                    <IconButton
                                        onClick={() =>
                                            onMoveUpClick(item.index)
                                        }
                                    >
                                        <KeyboardArrowUp />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            onMoveDownClick(item.index)
                                        }
                                    >
                                        <KeyboardArrowDown />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            deleteTransition(item.index)
                                        }
                                        disabled={texts.length === 1}
                                    >
                                        <DeleteForever />
                                    </IconButton>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <Button color="primary" onClick={() => handleSubmit()}>
                            Save
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
