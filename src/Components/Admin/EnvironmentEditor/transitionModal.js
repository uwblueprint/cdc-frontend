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
        marginTop: theme.spacing(0.5),
        width: "20px",
        height: "20px",
        background: "#B9BECE",
        borderRadius: "100%",
        color: "white",
        float: "right",
    },
    linkButton: {
        color: Colours.White,
        "&:hover": {
            backgroundColor: Colours.MainRed7,
            color: Colours.White,
        },
        marginTop: "15px",
        marginBottom: "5px",
        borderRadius: "5px",
        backgroundColor: Colours.MainRed5,
        width: "128px",
        height: "32px",
        textTransform: "capitalize",
    },
    textField: {
        width: "500px",
    },
}));

export default function TransitionModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    originalTransitions,
}) {
    const classes = useStyles();
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
            <DialogContent>
                {transitions.map((transition, index) => {
                    return (
                        <div key={transition.id}>
                            <h4>
                                Transition {index + 1} of {transitions.length}
                            </h4>
                            <div>
                                <Typography
                                    component="div"
                                    variant="h5"
                                    style={{ width: "100%" }}
                                >
                                    Upload Image
                                </Typography>
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
                                    style={{ width: "100%" }}
                                    type="file"
                                    onChange={(e) =>
                                        handleUploadFileChange(e, index)
                                    }
                                />
                            </div>
                            <TextField
                                value={transition.link ? transition.link : null}
                                onChange={(e) => handleLinkChange(e, index)}
                                className={classes.textField}
                                required
                                error={Boolean(errors ? errors.name : false)}
                                helperText={errors ? errors.name : false}
                                variant="outlined"
                                inputProps={{
                                    style: {
                                        padding: 10,
                                    },
                                }}
                                placeholder="Enter url to link (including http or https)"
                            />
                            {transition.link && (
                                <Button
                                    className={classes.linkButton}
                                    onClick={() =>
                                        window.open(transition.link, "_blank")
                                    }
                                >
                                    Test url
                                </Button>
                            )}
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
                    onClick={() => handleSubmit(transitions, imagesToDelete)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
