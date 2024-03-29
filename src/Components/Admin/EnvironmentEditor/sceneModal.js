import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAllAssets } from "../../../lib/assetEndpoints";
import { useErrorHandler } from "react-error-boundary";

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
    const handleError = useErrorHandler();
    const [sceneName, setSceneName] = React.useState("");
    const [backgroundId, setBackgroundId] = React.useState(null);
    const [description, setDescription] = React.useState("");
    const [errors, setErrors] = React.useState({
        name: "",
        backgroundId: "",
        description: "",
    });
    const [assets, setAssets] = React.useState([]);

    useEffect(() => {
        const getAsset = async () => {
            const data = await getAllAssets(handleError);
            const modifiedData = data.filter(
                (asset) => asset.obj_type === "background"
            );
            setAssets(modifiedData);
        };

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
        getAsset();
    }, [scene, handleError]);

    const handleSceneNameChange = (event) => {
        const response = event.target.value;
        setSceneName(response);
        setErrors({ ...errors, name: "" });
        const reg = new RegExp(/^[:()'?!.",a-zA-Z0-9 _-]{1,}$/).test(response);
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
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), punctuation (:()'?!,.\"), and spaces",
            });
        }
    };

    const handleSceneDescriptionChange = (event) => {
        const response = event.target.value;
        setDescription(response);
        setErrors({ ...errors, description: "" });
        const reg = new RegExp(/^[:()'?!.",a-zA-Z0-9 _-]{1,}$/).test(response);
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
                    "Only characters allowed are alphanumeric (a-z, A-Z, 0-9), dashes (- and _), punctuation (:()'?!,.\"), and spaces",
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
            handleModalCloseClick();
        }
    };

    const handleModalCloseClick = () => {
        setSceneName("");
        setDescription("");
        setBackgroundId(null);
        setErrors({
            name: "",
            backgroundId: "",
            description: "",
        });
        handleModalClose();
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
                        required
                        error={Boolean(errors ? errors.name : false)}
                        helperText={errors ? errors.name : ""}
                    />
                </div>
                <div style={{ paddingBottom: 15 }}>
                    <Typography>Description: </Typography>
                    <TextField
                        value={description}
                        onChange={handleSceneDescriptionChange}
                        className={classes.textField}
                        required
                        error={Boolean(errors ? errors.description : false)}
                        helperText={errors ? errors.description : ""}
                    />
                </div>
                {!isEdit && (
                    <div>
                        <Autocomplete
                            id="backgroundIdSelection"
                            style={{ width: 300 }}
                            options={assets}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            onChange={(_event, value) =>
                                setBackgroundId(value ? value.id : null)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose a background asset"
                                    variant="outlined"
                                    className={classes.textField}
                                    helperText={
                                        errors ? errors.backgroundId : ""
                                    }
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "background",
                                    }}
                                />
                            )}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalCloseClick}> Cancel </Button>
                <Button
                    onClick={handleModalSubmitClick}
                    disabled={
                        !sceneName ||
                        !description ||
                        !backgroundId ||
                        (errors
                            ? errors.name ||
                              errors.description ||
                              errors.backgroundId
                            : false)
                    }
                >
                    {isEdit ? "Edit" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
