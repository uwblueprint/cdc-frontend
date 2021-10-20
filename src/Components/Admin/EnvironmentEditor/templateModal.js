import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAllScenes } from "../../../lib/sceneEndpoints";
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

export default function TemplateModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [sceneId, setSceneId] = React.useState(null);
    const [scenes, setScenes] = React.useState([]);

    useEffect(() => {
        const getScenes = async () => {
            const data = await getAllScenes(handleError);
            setScenes(data);
        };
        getScenes();
    }, [handleError]);

    const handleModalCloseClick = () => {
        setSceneId(null);
        handleModalClose();
    };

    const handleModalSubmitClick = () => {
        handleSubmit(sceneId);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle>{"Create Scene from Template"}</DialogTitle>
            <DialogContent>
                <div style={{ width: 500, overflowY: "hidden" }}>
                    <Autocomplete
                        id="backgroundIdSelection"
                        style={{ width: 300 }}
                        options={scenes}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        onChange={(_event, value) =>
                            setSceneId(value ? value.id : null)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose a scene to duplicate"
                                variant="outlined"
                                className={classes.textField}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "background",
                                }}
                            />
                        )}
                    />
                </div>
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalCloseClick}>Cancel</Button>
                <Button onClick={handleModalSubmitClick}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
