import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";

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

        props.saveTexts([...reorderedList]);
        setTexts([...reorderedList]);
    };

    const addText = () => {
        const newText = {
            text: "sample text",
            index: texts.length,
        };

        if (newText.text) {
            props.saveTexts([...texts, newText]);
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
        props.saveTexts(tempTexts);
    };

    const handleTextChange = (event, index) => {
        const newText = event.target.value;
        if (newText !== null) {
            const tempTexts = JSON.parse(JSON.stringify(texts));
            tempTexts[index].text = newText;
            setTexts(tempTexts);
            props.saveTexts(tempTexts);
        }
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
                            <TextField
                                value={item.text}
                                onChange={(e) => handleTextChange(e, index)}
                                required
                                variant="outlined"
                                placeholder="Enter transition text"
                                multiline
                            />
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
        </div>
    );
}
