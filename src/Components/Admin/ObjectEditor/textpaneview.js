import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";

export default function TextPaneView(props) {
    const [texts, setTexts] = useState(props.texts);

    const reorder = (startIndex, endIndex) => {
        const result = texts;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const reorderTexts = (sourceIndex, destinationIndex) => {
        if (
            sourceIndex == null ||
            destinationIndex == null ||
            sourceIndex === destinationIndex
        ) {
            return;
        }

        const reorderedList = reorder(sourceIndex, destinationIndex);

        setTexts([...reorderedList]);
    };

    const addText = () => {
        const newText = {
            text: prompt("Enter the text for the puzzle: "),
            index: texts.length,
        };

        if (newText.text) {
            setTexts([...texts, newText]);
        }
    };

    const onMoveUpClick = (index) => {
        reorderTexts(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderTexts(index, Math.min(texts.length - 1, index + 1));
    };

    const deleteText = (index) => {
        const tempTexts = JSON.parse(JSON.stringify(texts));
        tempTexts.splice(index, 1);
        setTexts(tempTexts);
    };

    const handleSubmit = () => {
        props.saveTexts(texts);
    };

    return (
        <div>
            <div>
                Modify Texts
                <IconButton
                    className={props.classes.addButton}
                    aria-label="add"
                    onClick={addText}
                >
                    <AddIcon />
                </IconButton>
            </div>
            <div>
                {texts.map((item, index) => {
                    return (
                        <div key={index}>
                            <h4>
                                Text {index + 1} of {texts.length}
                            </h4>
                            <p>{item.text}</p>
                            <IconButton onClick={() => onMoveUpClick(index)}>
                                <KeyboardArrowUp />
                            </IconButton>
                            <IconButton onClick={() => onMoveDownClick(index)}>
                                <KeyboardArrowDown />
                            </IconButton>
                            <IconButton
                                onClick={() => deleteText(index)}
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
    );
}
