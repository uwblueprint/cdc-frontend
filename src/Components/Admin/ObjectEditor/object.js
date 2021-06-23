import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
import TextPaneView from "../ObjectEditor/textpaneview";

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
    const [puzzleType, setPuzzleType] = useState("");
    const [animationsJson, setAnimationsJson] = useState({});
    const [isInteractable, setIsInteractable] = useState(false);

    const puzzleTypeList = [
        { value: "text-pane", label: "Text Puzzle" },
        { value: "rotation-controls", label: "Rotation Puzzle" },
        { value: "keypad", label: "Keypad Puzzle" },
        { value: "visual-pane", label: "Visual Puzzle" },
        { value: "jigsaw-puzzle", label: "Jigsaw Puzzle" },
        { value: "ordered-puzzle", label: "Ordered Puzzle" },
    ];

    useEffect(() => {
        const getPuzzleBody = async () => {
            const data = await getPuzzle(sceneId, objectId, handleError);
            setAnimationsJson(data.animations_json);
            if (Object.keys(data.animations_json).length === 0) {
                setPuzzleBody({ jsonData: {} });
                setIsInteractable(false);
            } else {
                setPuzzleBody(data.animations_json.blackboardData);
                setPuzzleType(
                    data.animations_json.blackboardData.componentType
                );
                setIsInteractable(data.is_interactable);
            }
        };
        if (Object.keys(puzzleBody).length === 0) {
            getPuzzleBody();
        }
    }, [sceneId, objectId, puzzleBody, handleError]);

    const selectPuzzleType = (obj) => {
        if (obj) {
            const data = puzzleBody;
            data.componentType = obj.value;
            if (obj.value === "text-pane") {
                if (!data.jsonData.data) {
                    data.jsonData.data = [];
                }
            }
            setPuzzleBody(data);
            setPuzzleType(obj.value);
        }
    };

    const saveTexts = (texts) => {
        const animCopy = animationsJson;
        const puzzleBodyCopy = puzzleBody;
        puzzleBodyCopy.jsonData.data = texts;
        animCopy.blackboardData = puzzleBodyCopy;
        setAnimationsJson(animCopy);
        handleSave();
    };

    const handleSave = () => {
        const savePuzzle = async () => {
            await editPuzzle(
                { sceneId, objectId, isInteractable, animationsJson },
                handleError
            );
        };
        savePuzzle();
        alert("Saved puzzle CRUD changes for object with id: " + objectId);
    };

    const toggleButton = () => {
        setIsInteractable(!isInteractable);
    };

    return (
        <div
            className={classes.container}
            style={{ paddingLeft: "30px", paddingRight: "30px" }}
        >
            <div>
                <label htmlFor="subscribeNews">Interactable?</label>
                <input
                    type="checkbox"
                    value={isInteractable}
                    checked={isInteractable}
                    onChange={toggleButton}
                ></input>
            </div>
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
                <TextPaneView
                    saveTexts={saveTexts}
                    texts={puzzleBody.jsonData.data}
                    classes={classes}
                />
            ) : null}
        </div>
    );
}
