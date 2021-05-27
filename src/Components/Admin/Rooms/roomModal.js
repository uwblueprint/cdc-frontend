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

    useEffect(() => {
        if (room) {
            setRoomName(room.name);
            setFriendlyName(room.friendly_name);
            setRoomDescription(room.description);
            setIsPublished(room.is_published);
            setIsPreviewable(room.is_previewable);
            setRoomSolveTime(room.expected_solve_time);
        }
    }, [room]);

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
    };

    const handleFriendlyNameChange = (event) => {
        setFriendlyName(event.target.value);
    };

    const handleRoomSolveTimeChange = (event) => {
        setRoomSolveTime(event.target.value);
    };

    const handleModalCloseClick = () => {
        handleModalClose();
        setRoomName("");
        setRoomDescription("");
        setFriendlyName("");
        setRoomSolveTime("");
        setIsPublished(false);
        setIsPreviewable(false);
    };

    const handleModalSubmitClick = () => {
        if (isEdit) {
            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
                is_published: isPublished,
                is_previewable: isPreviewable,
                expected_solve_time: roomSolveTime,
            });
            setRoomSolveTime("");
            setIsPublished(false);
            setIsPreviewable(false);
        } else {
            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
            });
        }
        setRoomName("");
        setRoomDescription("");
        setFriendlyName("");
    };

    const handleIsPublishedClick = () => {
        if (isPublished === true) {
            setIsPublished(false);
        } else {
            setIsPublished(true);
        }
    };

    const handleIsPreviewableClick = () => {
        if (isPreviewable === true) {
            setIsPreviewable(false);
        } else {
            setIsPreviewable(true);
        }
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
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
                    />
                </div>
                {isEdit ? (
                    <div>
                        <Typography component="div" variant="h5">
                            Expected Solve Time:{" "}
                        </Typography>
                        <TextField
                            value={roomSolveTime}
                            onChange={handleRoomSolveTimeChange}
                            className={classes.textField}
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
                ) : null}
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalCloseClick}> Cancel </Button>
                <Button onClick={handleModalSubmitClick}>
                    {isEdit ? "Edit" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
