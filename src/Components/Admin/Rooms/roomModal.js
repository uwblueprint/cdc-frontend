import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useErrorHandler } from "react-error-boundary";
import { Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { deleteTransitionImages } from "../../../lib/scenarioEndpoints";
import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";
import { Colours } from "../../../styles/Constants.ts";

const useStyles = makeStyles((theme) => ({
    textField: {
        width: "500px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    createButton: {
        background: Colours.MainRed5,
        width: 133,
        height: 44,
        borderRadius: 4,
        textTransform: "capitalize",
        fontSize: 18,
        lineHeight: "24px",
        color: Colours.White,
        "&:hover": {
            backgroundColor: () => Colours.MainRed2,
        },
    },
    dialogTitle: {
        color: Colours.Grey9,
        fontSize: 28,
        fontWeight: "bold",
        height: 38,
    },
    closeButton: {
        marginTop: theme.spacing(0.5),
        width: "20px",
        height: "20px",
        borderRadius: "100%",
        float: "right",
    },
    switch_track: {
        backgroundColor: "lightgray",
        marginTop: 5,
    },
    switch_base: {
        marginTop: 5,
        color: "#f50057",
        "&.Mui-disabled": {
            color: "gray",
        },
        "&.Mui-checked": {
            color: "red",
        },
        "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "red",
        },
    },
    switch_primary: {
        "&.Mui-checked": {
            color: "white",
        },
        "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "white",
        },
    },
}));

export default function RoomModal({
    modalOpen,
    handleModalClose,
    handleSubmit,
    room,
    isEdit,
    isShareAndPublish,
    isRenameRoom,
    isEnvBar,
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();

    const [roomName, setRoomName] = useState("");
    const [friendlyName, setFriendlyName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [roomSolveTime, setRoomSolveTime] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [isPreviewable, setIsPreviewable] = useState(false);
    const [copy, setCopy] = useState(false);

    // handle second page image upload for scenario creation
    const [pageNum, setPageNum] = useState(1);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState(null);
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
        setPreviewSrc(
            room && room.display_image_url
                ? process.env.REACT_APP_ADMIN_ASSET_PREFIX +
                      room.display_image_url
                : ""
        );
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
            const fileName = name.slice(0, lastDot);
            const fileType = name.slice(lastDot + 1);

            setFileName(fileName);
            setFileType(fileType);
            setFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewSrc(previewUrl);
        }
    };

    const handleUploadDisplayImageSubmit = async (
        name,
        fileType,
        display_image
    ) => {
        let body = {};

        if (display_image) {
            body = {
                file_type: fileType,
                type: "image",
                file_content: display_image,
            };
        }
        const response = await createPresignedLinkAndUploadS3(
            body,
            handleError
        );

        setPreviewSrc(response.data.s3_key);
        return response.data.s3_key;
    };

    const handleRoomNameChange = (event) => {
        const response = event.target.value;
        setRoomName(response);
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
        if (!isEnvBar) {
            resetFields();
        }

        if (isEnvBar) {
            if (isRenameRoom) {
                setRoomName(room.name);
                setIsPublished(false);
                setIsPreviewable(false);
            } else {
                setIsPublished(room.is_published);
                setIsPreviewable(room.is_previewable);
                setRoomName("");
            }
        }

        handleModalClose();
    };

    const handleRenameRoomSubmit = () => {
        if (roomName !== room.name) {
            handleSubmit({
                name: roomName,
            });
        }

        handleModalClose();
    };

    const handleShareAndPublishSubmit = () => {
        if (
            isPublished !== room.is_published ||
            isPreviewable !== room.is_previewable
        ) {
            handleSubmit({
                is_published: isPublished,
                is_previewable: isPreviewable,
            });
        }

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
        setCopy(false);
    };

    const handleModalSubmitClick = async () => {
        const error = Boolean(
            errors
                ? errors.name ||
                      errors.friendlyName ||
                      errors.description ||
                      errors.solveTime
                : false
        );

        if (isEdit && !error) {
            let display_image_url = room.display_image_url;
            if (room && room.display_image_url && fileName !== "") {
                await deleteTransitionImages(
                    {
                        scenarioId: room.id,
                        imagesList: [room.display_image_url],
                    },
                    handleError
                );
            }
            if (fileName !== "") {
                display_image_url = await handleUploadDisplayImageSubmit(
                    fileName,
                    fileType,
                    file
                );
            }

            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
                is_published: isPublished,
                is_previewable: isPreviewable,
                expected_solve_time: roomSolveTime,
                display_image_url: display_image_url,
            });
        } else if (!isEdit && !error) {
            let display_image_url = "";
            if (fileName !== "") {
                display_image_url = await handleUploadDisplayImageSubmit(
                    fileName,
                    fileType,
                    file
                );
            }

            handleSubmit({
                name: roomName,
                description: roomDescription,
                friendly_name: friendlyName,
                display_image_url: display_image_url,
            });
        }

        if (!isEnvBar) {
            resetFields();
        }
    };

    const handleIsPublishedClick = () => {
        setIsPublished(!isPublished);
    };

    const handleIsPreviewableClick = () => {
        setIsPreviewable(!isPreviewable);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalCloseClick}>
            <DialogTitle
                style={{
                    borderBottom: "1px solid #D5E1EE",
                    paddingBottom: 5,
                }}
            >
                <span className={classes.dialogTitle}>
                    {isEdit
                        ? "Edit Escape Room"
                        : isShareAndPublish
                        ? "Share & Publish Game"
                        : isRenameRoom
                        ? "Rename Room"
                        : "Name Game & Link"}
                </span>
                <IconButton
                    className={classes.closeButton}
                    aria-label="close"
                    onClick={handleModalCloseClick}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {isShareAndPublish ? (
                    <>
                        <div>
                            <span
                                style={{
                                    paddingRight: 10,
                                    verticalAlign: "-webkit-baseline-middle",
                                    fontSize: 20,
                                    lineHeight: "27px",
                                    marginRight: 270,
                                }}
                            >
                                Game Published
                            </span>
                            <span style={{ margin: "auto", height: 70 }}>
                                <Switch
                                    checked={isPublished}
                                    onChange={() => {
                                        setIsPublished(!isPublished);
                                    }}
                                    inputProps={{
                                        "aria-label": "controlled",
                                        height: 40,
                                    }}
                                    classes={{
                                        track: classes.switch_track,
                                        switchBase: classes.switch_base,
                                        colorPrimary: classes.switch_primary,
                                    }}
                                />
                            </span>
                        </div>
                        <div>
                            <span
                                style={{
                                    paddingRight: 10,
                                    verticalAlign: "-webkit-baseline-middle",
                                    fontSize: 20,
                                    lineHeight: "27px",
                                    marginRight: 249,
                                }}
                            >
                                Game Previewable
                            </span>
                            <span style={{ margin: "auto", height: 70 }}>
                                <Switch
                                    checked={isPreviewable}
                                    onChange={() => {
                                        setIsPreviewable(!isPreviewable);
                                    }}
                                    inputProps={{
                                        "aria-label": "controlled",
                                        height: 40,
                                    }}
                                    classes={{
                                        track: classes.switch_track,
                                        switchBase: classes.switch_base,
                                        colorPrimary: classes.switch_primary,
                                    }}
                                />
                            </span>
                        </div>
                        <div style={{ paddingBottom: 15 }}>
                            <Typography
                                style={{
                                    fontSize: 20,
                                    lineHeight: "27px",
                                    marginTop: 20,
                                }}
                            >
                                Game Link
                            </Typography>
                            <span>
                                <span
                                    style={{
                                        width: 100,
                                        paddingRight: 10,
                                        verticalAlign:
                                            "-webkit-baseline-middle",
                                        fontSize: 14,
                                    }}
                                >
                                    interactive.calgaryconnecteen.com/
                                </span>
                                <TextField
                                    value={friendlyName}
                                    className={classes.textField}
                                    required
                                    error={Boolean(
                                        errors ? errors.friendlyName : false
                                    )}
                                    helperText={
                                        errors ? errors.friendlyName : false
                                    }
                                    style={{ width: 150, marginTop: 5 }}
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: "0px 10px",
                                            height: 25,
                                        },
                                    }}
                                    placeholder="friendly-url-to-share"
                                />
                                <span
                                    style={{
                                        width: 100,
                                        paddingLeft: 20,
                                        verticalAlign:
                                            "-webkit-baseline-middle",
                                        color: "red",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            process.env.REACT_APP_DEPLOYED_URL +
                                                friendlyName
                                        );
                                        setCopy(true);
                                    }}
                                >
                                    Copy Link
                                </span>
                                {copy ? (
                                    <p
                                        style={{
                                            color: "green",
                                            fontSize: 11,
                                            marginBottom: 0,
                                        }}
                                    >
                                        {process.env.REACT_APP_DEPLOYED_URL +
                                            friendlyName +
                                            " was copied to clipboard."}
                                    </p>
                                ) : null}
                            </span>
                        </div>
                    </>
                ) : isRenameRoom ? (
                    <>
                        <div>
                            <Typography
                                style={{
                                    fontSize: 20,
                                    lineHeight: "27px",
                                }}
                            >
                                Game Name
                            </Typography>
                            <TextField
                                value={roomName}
                                onChange={handleRoomNameChange}
                                className={classes.textField}
                                required
                                error={Boolean(errors ? errors.name : false)}
                                helperText={errors ? errors.name : false}
                                variant="outlined"
                                inputProps={{
                                    style: {
                                        padding: 10,
                                    },
                                }}
                                placeholder="Name your escape room game"
                            />
                        </div>
                    </>
                ) : pageNum === 1 ? (
                    <>
                        <div>
                            <Typography
                                style={{
                                    fontSize: 20,
                                    lineHeight: "27px",
                                }}
                            >
                                Game Name
                            </Typography>
                            <TextField
                                value={roomName}
                                onChange={handleRoomNameChange}
                                className={classes.textField}
                                required
                                error={Boolean(errors ? errors.name : false)}
                                helperText={errors ? errors.name : false}
                                variant="outlined"
                                inputProps={{
                                    style: {
                                        padding: 10,
                                    },
                                }}
                                placeholder="Name your escape room game"
                            />
                        </div>
                        <div>
                            <Typography
                                style={{
                                    fontSize: 20,
                                    lineHeight: "27px",
                                    marginTop: 20,
                                }}
                            >
                                Game Link
                            </Typography>
                            <span>
                                <span
                                    style={{
                                        width: 100,
                                        paddingRight: 10,
                                        paddingLeft: 5,
                                        verticalAlign:
                                            "-webkit-baseline-middle",
                                        fontSize: 14,
                                    }}
                                >
                                    interactive.calgaryconnecteen.com/
                                </span>
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
                                    style={{ width: "45%" }}
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: 10,
                                        },
                                    }}
                                    placeholder="friendly-url-to-share"
                                />
                            </span>
                        </div>
                        <div>
                            <Typography
                                style={{
                                    fontSize: 20,
                                    lineHeight: "27px",
                                    marginTop: 20,
                                }}
                            >
                                Room Description
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
                                variant="outlined"
                                inputProps={{
                                    style: {
                                        padding: 10,
                                    },
                                }}
                                placeholder="Describe your escape room game"
                            />
                        </div>
                        {isEdit && (
                            <div>
                                <Typography
                                    style={{
                                        fontSize: 20,
                                        lineHeight: "27px",
                                        marginTop: 20,
                                    }}
                                >
                                    Expected Solve Time
                                </Typography>
                                <TextField
                                    value={roomSolveTime}
                                    style={{ marginBottom: 15 }}
                                    onChange={handleRoomSolveTimeChange}
                                    className={classes.textField}
                                    required
                                    error={Boolean(
                                        errors ? errors.solveTime : false
                                    )}
                                    helperText={
                                        errors ? errors.solveTime : false
                                    }
                                    variant="outlined"
                                    inputProps={{
                                        style: {
                                            padding: 10,
                                        },
                                    }}
                                    placeholder="Expected time to complete your escape room game"
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
                                    disabled
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
                                    disabled
                                />
                                <p style={{ fontSize: 12, margin: 0 }}>
                                    To modify the above, open the &quot;Share
                                    &#38; Publish&quot; menu
                                </p>
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
                                    src={previewSrc}
                                    width={500}
                                    objectFit={"contain"}
                                />
                            </div>
                        ) : null}
                        <input
                            accept=".jpg,.jpeg,.png"
                            style={{ width: "100%" }}
                            type="file"
                            onChange={(e) => handleUploadFileChange(e)}
                        />
                        {previewSrc !== "" && fileName !== "" ? (
                            <div>{fileName} successfully uploaded</div>
                        ) : null}
                    </div>
                )}
            </DialogContent>
            {isRenameRoom ? (
                <DialogActions className={classes.buttonContainer}>
                    <Button
                        onClick={handleRenameRoomSubmit}
                        className={classes.createButton}
                        disabled={roomName === room.name}
                    >
                        Save
                    </Button>
                </DialogActions>
            ) : !isShareAndPublish ? (
                <DialogActions className={classes.buttonContainer}>
                    <Button
                        onClick={
                            pageNum === 2
                                ? handleModalSubmitClick
                                : () => {
                                      setPageNum(2);
                                  }
                        }
                        disabled={
                            (pageNum === 1 &&
                                (roomName === "" ||
                                    roomDescription === "" ||
                                    friendlyName === "")) ||
                            (errors
                                ? errors.name ||
                                  errors.friendlyName ||
                                  errors.description ||
                                  errors.solveTime ||
                                  errors.assetUpload
                                : false)
                        }
                        className={classes.createButton}
                    >
                        {pageNum === 1 ? "Next" : isEdit ? "Save" : "Create"}
                    </Button>
                </DialogActions>
            ) : (
                <DialogActions className={classes.buttonContainer}>
                    <Button
                        onClick={handleShareAndPublishSubmit}
                        disabled={
                            isPublished === room.is_published &&
                            isPreviewable === room.is_previewable
                        }
                        className={classes.createButton}
                    >
                        Save
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
