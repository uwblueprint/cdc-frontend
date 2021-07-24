import React, { useEffect, useState } from "react";
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
import { useErrorHandler } from "react-error-boundary";

import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";

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
    const handleError = useErrorHandler();

    const [roomName, setRoomName] = useState("");
    const [friendlyName, setFriendlyName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [roomSolveTime, setRoomSolveTime] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [isPreviewable, setIsPreviewable] = useState(false);

    // handle second page image upload for scenario creation
    const [pageNum, setPageNum] = useState(1);
    const [fileName, setFileName] = useState("");
    const [previewSrc, setPreviewSrc] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        friendlyName: "",
        description: "",
        solveTime: "",
        assetUpload: "",
    });

    useEffect(() => {
        setRoomName(room ? room.name : "");
        setFriendlyName(room ? room.friendly_name : "");
        setRoomDescription(room ? room.description : "");
        setIsPublished(room ? room.is_published : false);
        setIsPreviewable(room ? room.is_previewable : false);
        setRoomSolveTime(room ? room.expected_solve_time : "");
        setPreviewSrc(room ? room.display_image_url : "");
        setFileName(room ? room.display_image_url : "");
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

    const handleUploadFileChange = (event) => {
        setErrors({ ...errors, assetUpload: "" });
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const name = file.name;
            const lastDot = name.lastIndexOf(".");
            const split = name.split(lastDot);
            const fileName = split[0];
            const fileType = split[1];

            setFileName(fileName);
            handleUploadDisplayImageSubmit(fileName, fileType, file);
        }
    };

    const handleUploadDisplayImageSubmit = async (
        name,
        file_type,
        display_image
    ) => {
        const response = await createPresignedLinkAndUploadS3(
            {
                file_type: file_type,
                type: "image",
                file_content: display_image,
            },
            handleError
        );

        setPreviewSrc(response.data.s3_key);
    };

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

    const handleModalCloseClick = () => {
        resetFields();
        handleModalClose();
    };

    const resetFields = () => {
        setRoomName("");
        setFriendlyName("");
        setRoomDescription("");
        setIsPublished(false);
        setIsPreviewable(false);
        setRoomSolveTime("");
        setErrors({
            name: "",
            friendlyName: "",
            description: "",
            solveTime: "",
        });
        setPageNum(1);
        setFileName("");
        setPreviewSrc("");
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
                display_image_url: previewSrc,
            });
        } else if (!isEdit && !error) {
            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
                display_image_url: previewSrc,
            });
        }

        resetFields();
    };

    const handleIsPublishedClick = () => {
        setIsPublished(!isPublished);
    };

    const handleIsPreviewableClick = () => {
        setIsPreviewable(!isPreviewable);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle>
                {isEdit ? "Edit Escape Room" : "New Escape Room"}
            </DialogTitle>
            <DialogContent>
                {pageNum === 1 ? (
                    <>
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
                                error={Boolean(
                                    errors ? errors.friendlyName : false
                                )}
                                helperText={
                                    errors ? errors.friendlyName : false
                                }
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
                                error={Boolean(
                                    errors ? errors.description : false
                                )}
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
                                    error={Boolean(
                                        errors ? errors.solveTime : false
                                    )}
                                    helperText={
                                        errors ? errors.solveTime : false
                                    }
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
                    </>
                ) : (
                    <div>
                        <Typography
                            component="div"
                            variant="h5"
                            style={{ width: "100%" }}
                        >
                            Upload Image
                        </Typography>
                        {previewSrc ? (
                            <div>
                                <Typography
                                    component="div"
                                    variant="h6"
                                    style={{ width: "100%" }}
                                >
                                    Image Preview:
                                </Typography>
                                <img
                                    src={
                                        process.env
                                            .REACT_APP_ADMIN_ASSET_PREFIX +
                                        previewSrc
                                    }
                                    width={500}
                                    objectFit={"contain"}
                                ></img>
                            </div>
                        ) : null}
                        <input
                            accept=".jpg,.jpeg,.png"
                            style={{ width: "100%" }}
                            type="file"
                            onChange={(e) => handleUploadFileChange(e)}
                        />
                        {previewSrc !== "" ? (
                            <div>{fileName} successfully uploaded</div>
                        ) : null}
                    </div>
                )}
            </DialogContent>
            <DialogActions className={classes.buttonContainer}>
                <Button onClick={handleModalCloseClick}> Cancel </Button>
                <Button
                    onClick={
                        pageNum === 2
                            ? handleModalSubmitClick
                            : () => {
                                  setPageNum(2);
                              }
                    }
                >
                    {pageNum === 1 ? "Next" : isEdit ? "Edit" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
