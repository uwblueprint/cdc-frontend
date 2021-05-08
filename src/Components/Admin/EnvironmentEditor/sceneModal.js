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

export default function SceneModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    scene,
    isEdit,
}) {
    const classes = useStyles();
    const [sceneName, setSceneName] = React.useState("");
    const [backgroundId, setBackgroundId] = React.useState("");

    useEffect(() => {
        if (scene) {
            setSceneName(scene.name);
            setBackgroundId(scene.background_id);
        }
    }, [scene]);

    const handleSceneNameChange = (event) => {
        setSceneName(event.target.value);
    };

    const handleSceneBackgroundChange = (event) => {
        setBackgroundId(event.target.value);
    };

    const handleModalCloseClick = () => {
        handleModalClose();
        setSceneName("");
        setBackgroundId(null);
    };

    const handleModalSubmitClick = () => {
        handleSubmit(sceneName, parseInt(backgroundId));
        setSceneName("");
        setBackgroundId(null);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle>{isEdit ? "Edit Scene" : "New Scene"}</DialogTitle>
            <DialogContent>
                <div>
                    <Typography>Scene Name: </Typography>
                    <TextField
                        value={sceneName}
                        onChange={handleSceneNameChange}
                        className={classes.textField}
                    />
                </div>
                <div>
                    <Typography>Scene background ID: </Typography>
                    <TextField
                        value={backgroundId}
                        onChange={handleSceneBackgroundChange}
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
