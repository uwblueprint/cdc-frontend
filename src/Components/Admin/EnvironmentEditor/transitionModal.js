import React, { useEffect, useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Button, IconButton } from "@material-ui/core";
import {
    DeleteForever,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Colours } from "../../../styles/Constants.ts";
import "../../../styles/index.css";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginTop: theme.spacing(-0.5),
        marginLeft: theme.spacing(2),
        width: "20px",
        height: "20px",
        backgroundColor: Colours.MainRed5,
        borderRadius: "100%",
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
    },
    linkButton: {
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
        marginLeft: "15px",
        marginTop: "5px",
        marginBottom: "5px",
        borderRadius: "5px",
        backgroundColor: Colours.MainRed5,
        width: "128px",
        height: "32px",
        textTransform: "capitalize",
    },
    linkField: {
        width: "325px",
    },
    textField: {
        width: "475px",
    },
}));

export default function TransitionModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalTransitions,
}) {
    const classes = useStyles();
    const [allowSave, setAllowSave] = React.useState([]);
    const [transitions, setTransitions] = React.useState([]);
    const [imagesToDelete, setImagesToDelete] = React.useState([]);

    const [errors, setErrors] = useState({
        name: "",
        friendlyName: "",
        description: "",
        solveTime: "",
        assetUpload: "",
    });

    useEffect(() => {
        const tempTransitions = _.cloneDeep(originalTransitions);
        setTransitions(tempTransitions);
    }, [originalTransitions]);

    const reorder = (transitions, startIndex, endIndex) => {
        const result = transitions;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleUploadFileChange = (event, index) => {
        setErrors({ ...errors, assetUpload: "" });
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const name = file.name;
            if (name !== "") {
                const lastDot = name.lastIndexOf(".");
                const fileName = name.slice(0, lastDot);
                const fileType = name.slice(lastDot + 1);
                const previewUrl = URL.createObjectURL(file);

                const tempTransitions = _.cloneDeep(transitions);
                tempTransitions[index].fileName = fileName;
                tempTransitions[index].fileType = fileType;
                tempTransitions[index].file = file;
                tempTransitions[index].previewUrl = previewUrl;
                setTransitions(tempTransitions);
            }
        }
    };

    const handleLinkChange = (event, index) => {
        const linkInput = event.target.value;
        if (linkInput !== null) {
            const tempTransitions = _.cloneDeep(transitions);
            if (linkInput === "") {
                delete tempTransitions[index].link;
            } else {
                tempTransitions[index].link = linkInput;
            }
            setTransitions(tempTransitions);
        }
    };

    const handleTextChange = (event, index) => {
        const newText = event.target.value;
        if (newText !== null) {
            const tempTransitions = _.cloneDeep(transitions);
            tempTransitions[index].text = newText;
            setTransitions(tempTransitions);
        }
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
            text: "",
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
        const tempTransitions = _.cloneDeep(transitions);
        if (
            Object.prototype.hasOwnProperty.call(
                tempTransitions[index],
                "imageSrc"
            ) &&
            tempTransitions[index].imageSrc !== ""
        ) {
            const tempImagesToDelete = JSON.parse(
                JSON.stringify(imagesToDelete)
            );
            const s3Key = tempTransitions[index].imageSrc.replace(
                process.env.REACT_APP_ADMIN_ASSET_PREFIX,
                ""
            );
            tempImagesToDelete.push(s3Key);
            setImagesToDelete(tempImagesToDelete);
        }
        tempTransitions.splice(index, 1);
        setTransitions(tempTransitions);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
                Modify Transitions
                <IconButton
                    className={classes.addButton}
                    aria-label="add"
                    onClick={addTransition}
                >
                    <AddIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ width: 550 }}>
                {transitions.map((transition, index) => {
                    return (
                        <div key={transition.id}>
                            <h4>
                                Transition {index + 1} of {transitions.length}
                            </h4>
                            <div>
                                <p
                                    style={{
                                        width: "fit-content",
                                        marginBottom: 0,
                                        paddingRight: 20,
                                    }}
                                >
                                    Transition Image:
                                </p>
                                {transition.previewUrl ? (
                                    <div>
                                        <Typography
                                            component="div"
                                            variant="h6"
                                            style={{ width: "100%" }}
                                        >
                                            Image Preview:
                                        </Typography>
                                        <img
                                            src={transition.previewUrl}
                                            style={{
                                                maxHeight: "200px",
                                                maxWidth: "500px",
                                                height: "auto",
                                                width: "auto",
                                            }}
                                            objectFit={"contain"}
                                        />
                                    </div>
                                ) : transition.imageSrc ? (
                                    <div>
                                        <Typography
                                            component="div"
                                            variant="h6"
                                            style={{ width: "100%" }}
                                        >
                                            Image Preview:
                                        </Typography>
                                        <img
                                            src={transition.imageSrc}
                                            style={{
                                                maxHeight: "200px",
                                                maxWidth: "500px",
                                                height: "auto",
                                                width: "auto",
                                            }}
                                            objectFit={"contain"}
                                        />
                                    </div>
                                ) : null}

                                <input
                                    accept=".jpg,.jpeg,.png"
                                    style={{
                                        cursor: "pointer",
                                        marginTop: -5,
                                    }}
                                    type="file"
                                    onChange={(e) =>
                                        handleUploadFileChange(e, index)
                                    }
                                />
                            </div>
                            <div style={{ paddingBottom: 10 }}>
                                <p style={{ marginBottom: 0 }}>
                                    Transition Link:
                                </p>
                                <TextField
                                    value={
                                        transition.link ? transition.link : null
                                    }
                                    onChange={(e) => handleLinkChange(e, index)}
                                    className={classes.linkField}
                                    required
                                    error={Boolean(
                                        errors ? errors.name : false
                                    )}
                                    helperText={errors ? errors.name : false}
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: 10,
                                        },
                                    }}
                                    placeholder="Enter url to link (including http or https)"
                                />
                                <Button
                                    className={classes.linkButton}
                                    onClick={() =>
                                        window.open(transition.link, "_blank")
                                    }
                                    disabled={!transition.link}
                                >
                                    Test URL
                                </Button>
                            </div>
                            <div>
                                <p style={{ marginBottom: 0 }}>
                                    Transition Text:
                                </p>
                                <TextField
                                    value={transition.text}
                                    onChange={(e) => handleTextChange(e, index)}
                                    className={classes.textField}
                                    required
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: 10,
                                        },
                                    }}
                                    placeholder="Enter transition text"
                                    multiline
                                />
                            </div>
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
                    disabled={transitions.some(
                        (transition) =>
                            transition.text === null || transition.text === ""
                    )}
                    onClick={() => handleSubmit(transitions, imagesToDelete)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
