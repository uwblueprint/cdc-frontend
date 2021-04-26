import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

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

    useEffect(() => {
        if (room) {
            setRoomName(room.name);
            setFriendlyName(room.friendly_name);
            setRoomDescription(room.description);
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

    const handleModalCloseClick = () => {
        handleModalClose();
        setRoomName("");
        setRoomDescription("");
        setFriendlyName("");
    };

    const handleModalSubmitClick = () => {
        handleSubmit({
            name: roomName,
            description: roomDescription,
            friendly_name: friendlyName,
        });
        setRoomName("");
        setRoomDescription("");
        setFriendlyName("");
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle>
                {isEdit ? "Edit Escape Room" : "New Escape Room"}
            </DialogTitle>
            <DialogContent>
                <div>
                    <Typography>Room Name: </Typography>
                    <TextField
                        value={roomName}
                        onChange={handleRoomNameChange}
                        className={classes.textField}
                    />
                </div>
                <div>
                    <Typography>Room Friendly Name: </Typography>
                    <TextField
                        value={friendlyName}
                        onChange={handleFriendlyNameChange}
                        className={classes.textField}
                    />
                </div>
                <div>
                    <Typography>Room Description: </Typography>
                    <TextField
                        value={roomDescription}
                        onChange={handleRoomDescriptionChange}
                        className={classes.textField}
                    />
                </div>
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
