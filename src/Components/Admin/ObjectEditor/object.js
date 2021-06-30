import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
import TextPaneView from "../ObjectEditor/textpaneview";
import { Button } from "@material-ui/core";

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
    const [puzzleType, setPuzzleType] = useState("");
    const [animationsJson, setAnimationsJson] = useState({});
    const [origAnimJson, setOrigAnimJson] = useState({});
    const [isInteractable, setIsInteractable] = useState(null);

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
            setOrigAnimJson(data.animations_json);
            setAnimationsJson(data.animations_json);
            if (Object.keys(data.animations_json).length === 0) {
                setIsInteractable(false);
            } else {
                setPuzzleType(
                    data.animations_json.blackboardData.componentType
                );
                setIsInteractable(data.is_interactable);
            }
        };
        if (isInteractable === null && Object.keys(origAnimJson).length === 0) {
            getPuzzleBody();
        }
    }, [sceneId, objectId, isInteractable, origAnimJson, handleError]);

    const selectPuzzleType = (obj) => {
        if (obj) {
            setPuzzleType(obj.value);
            if (origAnimJson.blackboardData?.componentType === obj.value) {
                setAnimationsJson(origAnimJson);
            } else {
                const animCopy = {
                    blackboardData: { componentType: obj.value, jsonData: {} },
                };
                if (obj.value === "text-pane") {
                    animCopy.blackboardData.jsonData.data = [];
                    animCopy.blackboardData.jsonData.currPosition = 0;
                } else if (obj.value === "rotation-controls") {
                    animCopy.blackboardData.jsonData.position = [0, 0, 5];
                }
                setAnimationsJson(animCopy);
            }
        }
    };

    const saveTexts = (texts) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.data = texts;
        setAnimationsJson(animCopy);
    };

    const handleSave = () => {
        const savePuzzle = async () => {
            await editPuzzle(
                { sceneId, objectId, isInteractable, animationsJson },
                handleError
            );
        };
        if (
            isInteractable &&
            puzzleType === "text-pane" &&
            animationsJson?.blackboardData?.jsonData?.data?.length === 0
        ) {
            alert("Error: Need at least one text to save text-pane");
            return;
        }
        savePuzzle();
        alert("Saved puzzle CRUD changes for object with id: " + objectId);
    };

    const toggleButton = () => {
        if (isInteractable) {
            setAnimationsJson({});
        } else {
            setAnimationsJson(origAnimJson);
        }
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
                    texts={animationsJson.blackboardData.jsonData.data}
                    classes={classes}
                />
            ) : null}
            {!isInteractable || puzzleType !== "" ? (
                <div>
                    <Button color="primary" onClick={() => handleSave()}>
                        Save
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
