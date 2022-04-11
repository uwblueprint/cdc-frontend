import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { fileToByteArray } from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { useErrorHandler } from "react-error-boundary";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
    textField: {
        width: "400px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
    },
    formControl: {
        width: "12vw",
    },
    dialog: {
        margin: theme.spacing(1),
    },
    input: {
        display: "none",
    },
}));

export default function TextPaneView(props) {
    const [texts, setTexts] = useState(props.texts);
    const [type, setType] = React.useState(null);
    const [imageByteArray, setImageByteArray] = React.useState(null);
    const [curIndex, setCurIndex] = React.useState(0);
    const classes = useStyles();
    const handleError = useErrorHandler();

    useEffect(() => {
        const handleUploadImageSubmit = async (imageByteArray) => {
            const blob = new Blob([imageByteArray], { type: type });
            const textsCopy = _.cloneDeep(texts);
            textsCopy[curIndex].imageSrc = URL.createObjectURL(blob);
            textsCopy[curIndex].imgArr = imageByteArray;
            textsCopy[curIndex].type = type;
            setTexts(textsCopy);
            props.saveTexts(textsCopy);
        };

        const uploadImage = async () => {
            await handleUploadImageSubmit(imageByteArray);
            setImageByteArray(null);
        };

        if (imageByteArray !== null) {
            uploadImage();
        }
    }, [type, imageByteArray, curIndex, props, texts, handleError]);

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

    const deleteImage = (index) => {
        const tempTexts = JSON.parse(JSON.stringify(texts));
        delete tempTexts[index].imageSrc;
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

    const handleUploadFileChange = async (event, index) => {
        if (event.target.files && event.target.files[0]) {
            setCurIndex(index);
            const file = event.target.files[0];
            await fileToByteArray(file, setImageByteArray);
            setType(file.type.replace("image/", ""));
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
                                placeholder="Enter text"
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
                            {item.imageSrc ? (
                                <div>
                                    <Typography
                                        component="div"
                                        variant="h6"
                                        className={classes.text}
                                    >
                                        Optional Image:
                                    </Typography>
                                    <img
                                        src={item.imageSrc}
                                        height={250}
                                        max-width={1000}
                                        object-fit={"contain"}
                                    ></img>
                                    <IconButton
                                        onClick={() => deleteImage(index)}
                                    >
                                        <DeleteForever />
                                    </IconButton>
                                </div>
                            ) : (
                                <div>
                                    Optional Image:
                                    <br></br>
                                    <input
                                        accept=".jpg,.jpeg,.png"
                                        className={classes.input}
                                        id={"contained-button-file" + index}
                                        type="file"
                                        onChange={(e) =>
                                            handleUploadFileChange(e, index)
                                        }
                                    />
                                    <label
                                        htmlFor={
                                            "contained-button-file" + index
                                        }
                                    >
                                        <Button
                                            className={classes.uploadButton}
                                            variant="contained"
                                            color="primary"
                                            style={{
                                                backgroundColor: "#364254",
                                            }}
                                            component="span"
                                        >
                                            Upload
                                        </Button>
                                    </label>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
