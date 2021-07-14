import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { Colours } from "../../../styles/Constants.ts";

const useStyles = makeStyles((theme) => ({
    textField: {
        width: "500px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    createButton: {
        background: Colours.MainRed7,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 18,
        lineHeight: "24px",
        color: Colours.White,
        fontWeight: 600,
    },
    dialogTitle: {
        color: Colours.Grey9,
        fontSize: 28,
        fontWeight: "bold",
        height: 38,
    },
    closeButton: {
        marginTop: theme.spacing(0.5),
        width: "20px",
        height: "20px",
        borderRadius: "100%",
        float: "right",
    },
}));

export default function RoomModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    room,
    isEdit,
}) {
    const classes = useStyles();
    const [roomName, setRoomName] = React.useState("");
    const [friendlyName, setFriendlyName] = React.useState("");
    const [roomDescription, setRoomDescription] = React.useState("");
    const [roomSolveTime, setRoomSolveTime] = React.useState("");
    const [isPublished, setIsPublished] = React.useState(false);
    const [isPreviewable, setIsPreviewable] = React.useState(false);
    const [errors, setErrors] = React.useState({
        name: "",
        friendlyName: "",
        description: "",
        solveTime: "",
    });

    useEffect(() => {
        setRoomName(room ? room.name : "");
        setFriendlyName(room ? room.friendly_name : "");
        setRoomDescription(room ? room.description : "");
        setIsPublished(room ? room.is_published : false);
        setIsPreviewable(room ? room.is_previewable : false);
        setRoomSolveTime(room ? room.expected_solve_time : "");
        setErrors(
            room
                ? room.errors
                : {
                      name: "",
                      friendlyName: "",
                      description: "",
                      solveTime: "",
                  }
        );
    }, [room]);

    const handleRoomNameChange = (event) => {
        const response = event.target.value;
        setRoomName(response);
        setErrors({ ...errors, name: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,}$/).test(response);
        if (response.length > 50) {
            setErrors({
                ...errors,
                name: "Name cannot exceed 50 characters",
            });
        }
        if (!reg) {
            setErrors({
                ...errors,
                name:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), and spaces",
            });
        }
    };

    const handleFriendlyNameChange = (event) => {
        const response = event.target.value;
        setFriendlyName(response);
        setErrors({ ...errors, friendlyName: "" });
        const reg = new RegExp(/^[a-zA-Z0-9_-]{1,}$/).test(response);
        if (response.length > 50) {
            setErrors({
                ...errors,
                friendlyName: "Friendly name cannot exceed 50 characters",
            });
        }
        if (!reg) {
            setErrors({
                ...errors,
                friendlyName:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9) and dashes (- and _)",
            });
        }
    };

    const handleRoomDescriptionChange = (event) => {
        const response = event.target.value;
        setRoomDescription(response);
        setErrors({ ...errors, description: "" });
        const reg = new RegExp(/^[?!.,a-zA-Z0-9 _-]{1,}$/).test(response);
        if (response.length > 2000) {
            setErrors({
                ...errors,
                description: "Description cannot exceed 2000 characters",
            });
        }
        if (!reg) {
            setErrors({
                ...errors,
                description:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), punctuation (?!.,), and spaces",
            });
        }
    };

    const handleRoomSolveTimeChange = (event) => {
        setRoomSolveTime(event.target.value);
        setErrors({ ...errors, solveTime: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                ...errors,
                solveTime:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), and spaces",
            });
        }
    };

    const handleModalSubmitClick = () => {
        const error = Boolean(
            errors
                ? errors.name ||
                      errors.friendlyName ||
                      errors.description ||
                      errors.solveTime
                : false
        );

        if (isEdit && !error) {
            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
                is_published: isPublished,
                is_previewable: isPreviewable,
                expected_solve_time: roomSolveTime,
            });
        } else if (!isEdit && !error) {
            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
            });
        }
    };

    const handleIsPublishedClick = () => {
        setIsPublished(!isPublished);
    };

    const handleIsPreviewableClick = () => {
        setIsPreviewable(!isPreviewable);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle
                style={{
                    borderBottom: "1px solid #D5E1EE",
                    paddingBottom: 5,
                }}
            >
                <span className={classes.dialogTitle}>
                    {isEdit ? "Edit Escape Room" : "Name Game & Link"}
                </span>
                <IconButton
                    className={classes.closeButton}
                    aria-label="close"
                    onClick={handleModalClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                        }}
                    >
                        Game Name
                    </Typography>
                    <TextField
                        value={roomName}
                        onChange={handleRoomNameChange}
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
                        placeholder="Name your escape room game"
                    />
                </div>
                <div>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                            marginTop: 20,
                        }}
                    >
                        Game Link
                    </Typography>
                    <span>
                        <span
                            style={{
                                width: 100,
                                paddingRight: 10,
                                verticalAlign: "-webkit-baseline-middle",
                            }}
                        >
                            dcc.com/
                        </span>
                        <TextField
                            value={friendlyName}
                            onChange={handleFriendlyNameChange}
                            className={classes.textField}
                            required
                            error={Boolean(
                                errors ? errors.friendlyName : false
                            )}
                            helperText={errors ? errors.friendlyName : false}
                            style={{ width: "80%" }}
                            variant="outlined"
                            inputProps={{
                                style: {
                                    padding: 10,
                                },
                            }}
                            placeholder="friendly-url-to-share"
                        />
                    </span>
                </div>
                <div>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                            marginTop: 20,
                        }}
                    >
                        Room Description
                    </Typography>
                    <TextField
                        value={roomDescription}
                        onChange={handleRoomDescriptionChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.description : false)}
                        helperText={errors ? errors.description : false}
                        variant="outlined"
                        inputProps={{
                            style: {
                                padding: 10,
                            },
                        }}
                        placeholder="Describe your escape room game"
                    />
                </div>
                {isEdit && (
                    <div>
                        <Typography
                            style={{
                                fontSize: 20,
                                lineHeight: "27px",
                                marginTop: 20,
                            }}
                        >
                            Expected Solve Time
                        </Typography>
                        <TextField
                            value={roomSolveTime}
                            onChange={handleRoomSolveTimeChange}
                            className={classes.textField}
                            required
                            error={Boolean(errors ? errors.solveTime : false)}
                            helperText={errors ? errors.solveTime : false}
                            variant="outlined"
                            inputProps={{
                                style: {
                                    padding: 10,
                                },
                            }}
                            placeholder="Expected time to complete your escape room game"
                        />
                        <FormControlLabel
                            value="Room is Published"
                            control={
                                <Checkbox
                                    onClick={handleIsPublishedClick}
                                    checked={isPublished}
                                />
                            }
                            label="Room is Published"
                        />
                        <FormControlLabel
                            value="Room is Previewable"
                            control={
                                <Checkbox
                                    onClick={handleIsPreviewableClick}
                                    checked={isPreviewable}
                                />
                            }
                            label="Room is Previewable"
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button
                    onClick={handleModalSubmitClick}
                    className={classes.createButton}
                >
                    {isEdit ? "Edit" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
