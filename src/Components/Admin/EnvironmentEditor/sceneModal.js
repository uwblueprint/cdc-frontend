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
    const [backgroundId, setBackgroundId] = React.useState(null);
    const [description, setDescription] = React.useState("");
    const [errors, setErrors] = React.useState({
        name: "",
        backgroundId: "",
        description: "",
    });

    useEffect(() => {
        if (scene) {
            setSceneName(scene ? scene.name : "");
            setBackgroundId(scene ? scene.background_id : null);
            setDescription(scene ? scene.description : "");
            setErrors(
                scene
                    ? scene.errors
                    : {
                          name: "",
                          backgroundId: "",
                          description: "",
                      }
            );
        }
    }, [scene]);

    const handleSceneNameChange = (event) => {
        setSceneName(event.target.value);
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

    const handleSceneBackgroundChange = (event) => {
        setBackgroundId(event.target.value);
    };

    const handleSceneDescriptionChange = (event) => {
        setDescription(event.target.value);
        setErrors({ description: "" });
        const reg = new RegExp(/^[?!.,a-zA-Z0-9 _-]{1,2000}$/).test(
            event.target.value
        );
        if (!reg) {
            setErrors({
                description:
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), punctuation (?!.,), and spaces",
            });
        }
    };

    const handleModalSubmitClick = () => {
        const error = Boolean(
            errors
                ? errors.name || errors.backgroundId || errors.description
                : false
        );
        if (!error) {
            handleSubmit(sceneName, parseInt(backgroundId), description);
        }
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>{isEdit ? "Edit Scene" : "New Scene"}</DialogTitle>
            <DialogContent>
                <div>
                    <Typography>Scene Name: </Typography>
                    <TextField
                        value={sceneName}
                        onChange={handleSceneNameChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.name : false)}
                        helperText={errors ? errors.name : false}
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
                <div>
                    <Typography>Description: </Typography>
                    <TextField
                        value={description}
                        onChange={handleSceneDescriptionChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.description : false)}
                        helperText={errors ? errors.description : false}
                    />
                </div>
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
