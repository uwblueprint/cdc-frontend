import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles(() => ({
    textField: {
        width: "500px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
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
        setRoomName(event.target.value);
        setErrors({ name: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{1,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                name:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), and spaces",
            });
        }
    };

    const handleFriendlyNameChange = (event) => {
        setFriendlyName(event.target.value);
        setErrors({ friendlyName: "" });
        const reg = new RegExp(/^[a-zA-Z0-9_-]{1,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                friendlyName:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9) and dashes (- and _)",
            });
        }
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
        setErrors({ description: "" });
        const reg = new RegExp(/^[?!.,a-zA-Z0-9 _-]{,2000}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                description:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), punctuation (?!.,), and spaces",
            });
        }
    };

    const handleRoomSolveTimeChange = (event) => {
        setRoomSolveTime(event.target.value);
        setErrors({ solveTime: "" });
        const reg = new RegExp(/^[a-zA-Z0-9 _-]{,50}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
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
            <DialogTitle>
                {isEdit ? "Edit Escape Room" : "New Escape Room"}
            </DialogTitle>
            <DialogContent>
                <div>
                    <Typography component="div" variant="h5">
                        Room Name:{" "}
                    </Typography>
                    <TextField
                        value={roomName}
                        onChange={handleRoomNameChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.name : false)}
                        helperText={errors ? errors.name : false}
                    />
                </div>
                <div>
                    <Typography component="div" variant="h5">
                        Room Friendly Name:{" "}
                    </Typography>
                    <TextField
                        value={friendlyName}
                        onChange={handleFriendlyNameChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.friendlyName : false)}
                        helperText={errors ? errors.friendlyName : false}
                    />
                </div>
                <div>
                    <Typography component="div" variant="h5">
                        Room Description:{" "}
                    </Typography>
                    <TextField
                        value={roomDescription}
                        onChange={handleRoomDescriptionChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.description : false)}
                        helperText={errors ? errors.description : false}
                    />
                </div>
                {isEdit && (
                    <div>
                        <Typography component="div" variant="h5">
                            Expected Solve Time:{" "}
                        </Typography>
                        <TextField
                            value={roomSolveTime}
                            onChange={handleRoomSolveTimeChange}
                            className={classes.textField}
                            required
                            error={Boolean(errors ? errors.solveTime : false)}
                            helperText={errors ? errors.solveTime : false}
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
                <Button onClick={handleModalClose}> Cancel </Button>
                <Button onClick={handleModalSubmitClick}>
                    {isEdit ? "Edit" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
