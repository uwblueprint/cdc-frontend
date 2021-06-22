import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
import AddIcon from "@material-ui/icons/Add";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";

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

class TextPaneView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            texts: this.props.texts,
        };
    }

    setTexts(newTexts) {
        this.setState({ texts: newTexts });
    }

    reorder = (startIndex, endIndex) => {
        const result = this.state.texts;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    reorderTexts = (sourceIndex, destinationIndex) => {
        if (
            sourceIndex == null ||
            destinationIndex == null ||
            sourceIndex === destinationIndex
        ) {
            return;
        }

        const reorderedList = this.reorder(sourceIndex, destinationIndex);

        this.setTexts([...reorderedList]);
    };

    addText = () => {
        const newText = {
            text: prompt("Enter the text for the puzzle: "),
            index: this.state.texts.length,
        };

        if (newText.text) {
            this.setTexts([...this.state.texts, newText]);
        }
    };

    onMoveUpClick = (index) => {
        this.reorderTexts(index, Math.max(0, index - 1));
    };

    onMoveDownClick = (index) => {
        this.reorderTexts(
            index,
            Math.min(this.state.texts.length - 1, index + 1)
        );
    };

    deleteText = (index) => {
        const tempTexts = JSON.parse(JSON.stringify(this.state.texts));
        tempTexts.splice(index, 1);
        this.setTexts(tempTexts);
    };

    handleSubmit() {
        this.props.saveTexts(this.state.texts);
    }

    componentDidMount() {
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <div>
                    Modify Texts
                    <IconButton
                        className={this.props.classes.addButton}
                        aria-label="add"
                        onClick={this.addText}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
                <div>
                    {this.state.texts.map((item, index) => {
                        return (
                            <div key={index}>
                                <h4>
                                    Text {index + 1} of{" "}
                                    {this.state.texts.length}
                                </h4>
                                <p>{item.text}</p>
                                <IconButton
                                    onClick={() => this.onMoveUpClick(index)}
                                >
                                    <KeyboardArrowUp />
                                </IconButton>
                                <IconButton
                                    onClick={() => this.onMoveDownClick(index)}
                                >
                                    <KeyboardArrowDown />
                                </IconButton>
                                <IconButton
                                    onClick={() => this.deleteText(index)}
                                    disabled={this.state.texts.length === 1}
                                >
                                    <DeleteForever />
                                </IconButton>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <Button color="primary" onClick={() => this.handleSubmit()}>
                        Save
                    </Button>
                </div>
            </div>
        );
    }
}

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
    };

    const toggleButton = () => {
        setIsInteractable(!isInteractable);
    };

    return (
        <div className={classes.container}>
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
