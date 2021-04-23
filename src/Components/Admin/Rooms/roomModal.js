import React from "react";
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
}) {
    const classes = useStyles();
    const [roomName, setRoomName] = React.useState("");
    const [roomDescription, setRoomDescription] = React.useState("");

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
    };

    const handleModalCloseClick = () => {
        handleModalClose();
        setRoomName("");
        setRoomDescription("");
    };

    const handleModalSubmitClick = () => {
        handleSubmit();
        setRoomName("");
        setRoomDescription("");
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle> New Escape Room </DialogTitle>
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
                <Button onClick={handleModalSubmitClick}> Create </Button>
            </DialogActions>
        </Dialog>
    );
}
