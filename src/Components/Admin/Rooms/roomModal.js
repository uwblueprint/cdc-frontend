import React from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function RoomModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
}) {
    const [roomName, setRoomName] = React.useState("");
    const [roomDescription, setRoomDescription] = React.useState("");

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle> New Escape Room </DialogTitle>
            <DialogContent>
                <div>
                    <Typography>Room Name: </Typography>
                    <TextField
                        value={roomName}
                        onChange={handleRoomNameChange}
                    />
                </div>
                <div>
                    <Typography>Room Description: </Typography>
                    <TextField
                        value={roomDescription}
                        onChange={handleRoomDescriptionChange}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose}> Cancel </Button>
                <Button onClick={handleSubmit}> Create </Button>
            </DialogActions>
        </Dialog>
    );
}
