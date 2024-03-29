import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useErrorHandler } from "react-error-boundary";
import Select from "react-select";
import { Button, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { DeleteForever } from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import TextPaneView from "../ObjectEditor/textpaneview";
import VisualPaneView from "../ObjectEditor/visualpaneview";
import UnorderedPuzzle from "../ObjectEditor/unorderedpuzzle";
import KeypadPuzzle from "../ObjectEditor/keypadpuzzle";
import { Colours } from "../../../styles/Constants.ts";
import TextField from "@material-ui/core/TextField";

import {
    getPuzzle,
    editPuzzle,
    deletePuzzleImages,
} from "../../../lib/puzzleEndpoints";
import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";
import JigsawPuzzle from "./jigsawpuzzle";
import { httpPost } from "../../../lib/dataAccess";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
    sceneAndTransitionContainer: {
        minWidth: 600,
    },
    introContainer: {
        minWidth: 850,
        display: "flex",
    },
    container: {
        paddingTop: theme.spacing(12),
    },
    dragAndDropContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: "16px",
    },
    emptyButtonsContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "space-around",
    },
    buttonContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(4),
    },
    button: {
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: "#E2E5ED",
        borderRadius: "12px",
    },
    switch_track: {
        backgroundColor: "lightgray",
    },
    switch_base: {
        color: Colours.MainRed5,
        "&.Mui-disabled": {
            color: "gray",
        },
        "&.Mui-checked": {
            color: Colours.MainRed5,
        },
        "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: Colours.MainRed5,
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

export default function ObjectEditor({
    match: {
        params: { sceneId, objectId },
    },
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [puzzleType, setPuzzleType] = useState("");
    const [animationsJson, setAnimationsJson] = useState({});
    const [origAnimJson, setOrigAnimJson] = useState({});
    const [isInteractable, setIsInteractable] = useState(null);
    const [isLastPuzzle, setIsLastPuzzle] = useState(null);
    const [header, setHeader] = useState(null);
    const [caption, setCaption] = useState(null);
    const [images, setImages] = useState([{}, {}]);
    const [imagesList, setImagesList] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successText, setSuccessText] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const puzzleTypeList = [
        { value: "text-pane", label: "Text Puzzle" },
        { value: "rotation-controls", label: "Rotation Puzzle" },
        { value: "numpad-puzzle", label: "Numpad Puzzle" },
        { value: "keyboard-puzzle", label: "Keyboard Puzzle" },
        { value: "visual-pane", label: "Visual Puzzle" },
        { value: "jigsaw-puzzle", label: "Jigsaw Puzzle" },
        { value: "ordered-puzzle", label: "Ordered Puzzle" },
        { value: "unordered-puzzle", label: "Unordered Puzzle" },
    ];

    useEffect(() => {
        const getPuzzleBody = async () => {
            const data = await getPuzzle(sceneId, objectId, handleError);
            setOrigAnimJson(JSON.parse(JSON.stringify(data.animations_json)));
            setAnimationsJson(JSON.parse(JSON.stringify(data.animations_json)));
            if (data.animations_json.blackboardData?.jsonData?.caption) {
                setCaption(
                    data.animations_json.blackboardData.jsonData.caption
                );
            }
            if (data.animations_json.blackboardData?.blackboardParagraph) {
                setCaption(
                    data.animations_json.blackboardData.blackboardParagraph
                );
            }
            if (Object.keys(data.animations_json).length === 0) {
                setIsInteractable(false);
            } else {
                setPuzzleType(
                    data.animations_json.blackboardData.componentType
                );
                if (
                    data.animations_json.blackboardData.componentType ===
                    "ordered-puzzle"
                ) {
                    setImages(
                        JSON.parse(
                            JSON.stringify(
                                data.animations_json.blackboardData.jsonData
                                    .images
                            )
                        )
                    );
                    if (
                        !data.animations_json.blackboardData.jsonData.useTargets
                    ) {
                        setPuzzleType("unordered-puzzle");
                    }
                }
                if (
                    data.animations_json.blackboardData.componentType ===
                    "keypad"
                ) {
                    if (
                        data.animations_json.blackboardData.jsonData.model ===
                        "numpad"
                    ) {
                        setPuzzleType("numpad-puzzle");
                    } else if (
                        data.animations_json.blackboardData.jsonData.model ===
                        "basic"
                    ) {
                        setPuzzleType("keyboard-puzzle");
                    }
                }
                setIsInteractable(data.is_interactable);
                if (data.animations_json.blackboardData.blackboardText) {
                    setHeader(
                        data.animations_json.blackboardData.blackboardText
                    );
                }
            }
        };
        if (isInteractable === null && Object.keys(origAnimJson).length === 0) {
            getPuzzleBody();
        }
    }, [
        sceneId,
        objectId,
        isInteractable,
        origAnimJson,
        setCaption,
        showSuccess,
        showError,
        handleError,
    ]);

    const selectPuzzleType = (obj) => {
        if (obj) {
            if (obj.value !== puzzleType) {
                setIsLastPuzzle(false);
            }
            if (puzzleType === "unordered-puzzle" && obj.value !== puzzleType) {
                setImages([{}, {}]);
            }
            if (puzzleType === "ordered-puzzle" && obj.value !== puzzleType) {
                setImages([{}, {}]);
            }
            if (puzzleType !== obj.value && obj.value === "ordered-puzzle") {
                const imagesCopy =
                    origAnimJson?.blackboardData?.jsonData?.useTargets === true
                        ? origAnimJson.blackboardData.jsonData.images
                        : [{}, {}];
                setImages(imagesCopy);
            }
            if (puzzleType !== obj.value && obj.value === "unordered-puzzle") {
                const imagesCopy =
                    origAnimJson?.blackboardData?.jsonData?.useTargets === false
                        ? JSON.parse(
                              JSON.stringify(
                                  origAnimJson.blackboardData.jsonData.images
                              )
                          )
                        : [{}, {}];
                setImages(imagesCopy);
            }
            setPuzzleType(obj.value);
            if (
                obj.value === "unordered-puzzle" &&
                origAnimJson.blackboardData?.componentType ===
                    "ordered-puzzle" &&
                origAnimJson.blackboardData?.jsonData?.useTargets === false
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
            } else if (
                obj.value === "ordered-puzzle" &&
                origAnimJson.blackboardData?.componentType ===
                    "ordered-puzzle" &&
                origAnimJson.blackboardData?.jsonData?.useTargets === true
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
                setIsLastPuzzle(
                    origAnimJson?.blackboardData?.jsonData?.is_last_object
                );
            } else if (
                obj.value === "numpad-puzzle" &&
                origAnimJson.blackboardData?.componentType === "keypad" &&
                origAnimJson.blackboardData?.jsonData?.model === "numpad"
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
                setIsLastPuzzle(
                    origAnimJson?.blackboardData?.jsonData?.is_last_object
                );
            } else if (
                obj.value === "keyboard-puzzle" &&
                origAnimJson.blackboardData?.componentType === "keypad" &&
                origAnimJson.blackboardData?.jsonData?.model === "basic"
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
                setIsLastPuzzle(
                    origAnimJson?.blackboardData?.jsonData?.is_last_object
                );
            } else if (
                obj.value === "jigsaw-puzzle" &&
                origAnimJson.blackboardData?.componentType === "jigsaw-puzzle"
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
                setIsLastPuzzle(
                    origAnimJson?.blackboardData?.jsonData?.is_last_object
                );
            } else if (
                obj.value !== "unordered-puzzle" &&
                obj.value !== "ordered-puzzle" &&
                origAnimJson.blackboardData?.componentType === obj.value
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
                setImages([{}, {}]);
            } else {
                const animCopy = {
                    blackboardData: { componentType: obj.value, jsonData: {} },
                };
                if (obj.value === "text-pane") {
                    animCopy.blackboardData.jsonData.data = [];
                    animCopy.blackboardData.jsonData.currPosition = 0;
                } else if (obj.value === "rotation-controls") {
                    animCopy.blackboardData.jsonData.position = [0, 0, 5];
                } else if (obj.value === "visual-pane") {
                    animCopy.blackboardData.jsonData.position = [0, 0, 0];
                } else if (obj.value === "unordered-puzzle") {
                    animCopy.blackboardData.componentType = "ordered-puzzle";
                    animCopy.blackboardData.jsonData.useTargets = false;
                    animCopy.blackboardData.jsonData.randomizePos = true;
                    animCopy.blackboardData.draggable = true;
                } else if (obj.value === "ordered-puzzle") {
                    animCopy.blackboardData.jsonData.useTargets = true;
                    animCopy.blackboardData.jsonData.randomizePos = true;
                    animCopy.blackboardData.jsonData.is_last_object = false;
                    animCopy.blackboardData.draggable = true;
                } else if (obj.value === "numpad-puzzle") {
                    animCopy.blackboardData.componentType = "keypad";
                    animCopy.blackboardData.jsonData.model = "numpad";
                    animCopy.blackboardData.jsonData.is_last_object = false;
                    animCopy.blackboardData.jsonData.password = "";
                } else if (obj.value === "keyboard-puzzle") {
                    animCopy.blackboardData.componentType = "keypad";
                    animCopy.blackboardData.jsonData.model = "basic";
                    animCopy.blackboardData.jsonData.is_last_object = false;
                    animCopy.blackboardData.jsonData.password = "";
                } else if (obj.value === "jigsaw-puzzle") {
                    animCopy.blackboardData.componentType = "jigsaw-puzzle";
                    animCopy.blackboardData.jsonData.is_last_object = false;
                }
                if (obj.value !== "ordered-puzzle") {
                    setImages([{}, {}]);
                }
                setAnimationsJson(animCopy);
            }
        }
    };

    const saveTexts = (texts) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.data = texts;
        setAnimationsJson(animCopy);
    };

    const savePass = (pass) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.password = pass;
        setAnimationsJson(animCopy);
    };

    const saveCaption = (caption) => {
        const animCopy = animationsJson;
        if (caption === "") {
            delete animCopy.blackboardData.jsonData.caption;
        } else {
            animCopy.blackboardData.jsonData.caption = caption;
        }
        setAnimationsJson(animCopy);
    };

    const setErrorMsg = (errorMsg) => {
        const animCopy = animationsJson;
        if (errorMsg === "") {
            delete animCopy.blackboardData.jsonData.errorMsg;
        } else {
            animCopy.blackboardData.jsonData.errorMsg = errorMsg;
        }
        setAnimationsJson(animCopy);
    };

    const saveImage = (imgArr, type) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.imgArr = imgArr;
        animCopy.blackboardData.jsonData.type = type;
        setAnimationsJson(animCopy);
    };

    const saveJigsawImages = (base64String) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.b64string = base64String;
        setAnimationsJson(animCopy);
    };

    const saveImageN = (index, imgArr, type, imgBlob) => {
        const imagesCopy = _.cloneDeep(images);
        imagesCopy[index].imageSrc = imgBlob;
        imagesCopy[index].imgArr = imgArr;
        imagesCopy[index].type = type;
        setImages(imagesCopy);
    };

    const saveImages = (imagesCopy) => {
        const tempImageCopy = _.cloneDeep(imagesCopy);
        setImages(tempImageCopy);
    };

    const addImage = () => {
        setImages([...images, {}]);
    };

    const deleteImage = (index) => {
        const imagePrefix = process.env.REACT_APP_ADMIN_ASSET_PREFIX;
        if (
            images[index].imageSrc &&
            images[index].imageSrc.indexOf(imagePrefix) !== -1
        ) {
            const imgSrc = images[index].imageSrc;
            const s3key = imgSrc.replace(imagePrefix, "");
            setImagesList([...imagesList, s3key]);
        }
        const tempImages = images;
        tempImages.splice(index, 1);
        setImages(tempImages);
    };

    const handleSave = async () => {
        const animCopy = animationsJson;
        if (isInteractable && header !== "" && header !== null) {
            animCopy.blackboardData.blackboardText = header;
        } else {
            if (animCopy.blackboardData?.blackboardText) {
                delete animCopy.blackboardData.blackboardText;
            }
        }
        if (isInteractable && caption !== "" && caption !== null) {
            if (puzzleType === "visual-pane") {
                animCopy.blackboardData.jsonData.caption = caption;
                delete animCopy.blackboardData.blackboardParagraph;
            } else {
                animCopy.blackboardData.blackboardParagraph = caption;
                delete animCopy.blackboardData.jsonData.caption;
            }
        } else {
            if (animCopy.blackboardData?.jsonData?.caption) {
                delete animCopy.blackboardData.jsonData.caption;
            }
            if (animCopy.blackboardData?.blackboardParagraph) {
                delete animCopy.blackboardData.blackboardParagraph;
            }
        }
        if (isInteractable && puzzleType === "text-pane") {
            delete animCopy.blackboardData?.jsonData?.caption;
        }
        if (
            (isInteractable && puzzleType === "ordered-puzzle") ||
            (isInteractable && puzzleType === "unordered-puzzle")
        ) {
            if (
                JSON.stringify(origAnimJson) === JSON.stringify(animCopy) &&
                JSON.stringify(images) ===
                    JSON.stringify(animCopy.blackboardData.jsonData.images)
            ) {
                setErrorText("Error: No changes made");
                setShowError(true);
                return;
            }
            for (let i = 0; i < images.length; i++) {
                if (images[i].imageSrc === "" || !images[i].imageSrc) {
                    setErrorText(
                        "Error: Not all images have been uploaded yet"
                    );
                    setShowError(true);
                    return;
                }
            }
            animCopy.blackboardData.jsonData.images = images;
        } else if (JSON.stringify(origAnimJson) === JSON.stringify(animCopy)) {
            setErrorText("Error: No changes made");
            setShowError(true);
            return;
        }
        if (
            (isInteractable && puzzleType === "numpad-puzzle") ||
            (isInteractable && puzzleType === "keyboard-puzzle")
        ) {
            if (animCopy.blackboardData.jsonData.password) {
                if (animCopy.blackboardData.jsonData.password === "") {
                    setErrorText("Error: Password not set");
                    setShowError(true);
                    return;
                }
            } else {
                setErrorText("Error: Password not set");
                setShowError(true);
                return;
            }
            animCopy.blackboardData.jsonData.images = images;
        }
        if (isInteractable && puzzleType === "visual-pane") {
            if (
                !animCopy.blackboardData?.jsonData?.image &&
                !animCopy.blackboardData?.jsonData?.imgArr
            ) {
                setErrorText("Error: No image selected");
                setShowError(true);
                return;
            }
        }
        if (isInteractable && puzzleType === "jigsaw-puzzle") {
            if (
                !animCopy.blackboardData?.jsonData?.images &&
                !animCopy.blackboardData?.jsonData?.b64string
            ) {
                setErrorText("Error: No image selected");
                setShowError(true);
                return;
            }
        }
        setAnimationsJson(animCopy);

        const savePuzzle = async () => {
            if (imagesList.length > 0) {
                await deletePuzzleImages(
                    { sceneId, objectId, imagesList },
                    handleError
                );
                setImagesList([]);
            }
            const animCopy = animationsJson;
            if (isInteractable && puzzleType === "visual-pane") {
                let response = null;
                const imagePrefix = process.env.REACT_APP_ADMIN_ASSET_PREFIX;
                if (origAnimJson.blackboardData?.jsonData?.imageSrc) {
                    response = await createPresignedLinkAndUploadS3(
                        {
                            file_type: origAnimJson.blackboardData?.jsonData?.imageSrc
                                .split(".")
                                .reverse()[0],
                            type: "image",
                            file_content:
                                animCopy.blackboardData.jsonData.imgArr,
                            s3Key: origAnimJson.blackboardData?.jsonData?.imageSrc.replace(
                                imagePrefix,
                                ""
                            ),
                        },
                        handleError
                    );
                } else {
                    response = await createPresignedLinkAndUploadS3(
                        {
                            file_type: animCopy.blackboardData.jsonData.type,
                            type: "image",
                            file_content:
                                animCopy.blackboardData.jsonData.imgArr,
                        },
                        handleError
                    );
                }

                delete animCopy.blackboardData.jsonData.type;
                delete animCopy.blackboardData.jsonData.imgArr;
                animCopy.blackboardData.jsonData.imageSrc =
                    imagePrefix + response.data.s3_key;
            }
            if (
                (isInteractable && puzzleType === "ordered-puzzle") ||
                (isInteractable && puzzleType === "unordered-puzzle")
            ) {
                for (let i = 0; i < images.length; i++) {
                    if (images[i].imgArr) {
                        let response = null;
                        let type = images[i].type;
                        const imagePrefix =
                            process.env.REACT_APP_ADMIN_ASSET_PREFIX;
                        if (!type) {
                            type = animCopy.blackboardData.jsonData.images[
                                i
                            ].imageSrc
                                .split(".")
                                .reverse()[0];
                        }

                        if (
                            origAnimJson.blackboardData?.componentType !==
                                "keypad" &&
                            origAnimJson.blackboardData?.componentType !==
                                "jigsaw-puzzle" &&
                            origAnimJson.blackboardData?.jsonData?.images &&
                            i <
                                origAnimJson.blackboardData.jsonData.images
                                    .length
                        ) {
                            response = await createPresignedLinkAndUploadS3(
                                {
                                    file_type: type,
                                    type: "image",
                                    file_content: images[i].imgArr,
                                    s3Key: origAnimJson.blackboardData.jsonData.images[
                                        i
                                    ].imageSrc.replace(imagePrefix, ""),
                                },
                                handleError
                            );
                        } else {
                            response = await createPresignedLinkAndUploadS3(
                                {
                                    file_type: type,
                                    type: "image",
                                    file_content: images[i].imgArr,
                                },
                                handleError
                            );
                        }

                        delete images[i].type;
                        delete images[i].imgArr;
                        images[i].imageSrc = imagePrefix + response.data.s3_key;
                    }
                }
                animCopy.blackboardData.jsonData.images = JSON.parse(
                    JSON.stringify(images)
                );
            }

            if (isInteractable && puzzleType === "text-pane") {
                const texts = animCopy.blackboardData.jsonData.data;
                for (let i = 0; i < texts.length; i++) {
                    if (texts[i].imgArr) {
                        let response = null;
                        let type = texts[i].type;
                        const imagePrefix =
                            process.env.REACT_APP_ADMIN_ASSET_PREFIX;
                        if (!type) {
                            type = animCopy.blackboardData.jsonData.texts[
                                i
                            ].imageSrc
                                .split(".")
                                .reverse()[0];
                        }

                        if (
                            origAnimJson.blackboardData?.jsonData?.data[i]
                                ?.imageSrc &&
                            i < origAnimJson.blackboardData.jsonData.data.length
                        ) {
                            response = await createPresignedLinkAndUploadS3(
                                {
                                    file_type: type,
                                    type: "image",
                                    file_content: texts[i].imgArr,
                                    s3Key: origAnimJson.blackboardData.jsonData.data[
                                        i
                                    ].imageSrc.replace(imagePrefix, ""),
                                },
                                handleError
                            );
                        } else {
                            response = await createPresignedLinkAndUploadS3(
                                {
                                    file_type: type,
                                    type: "image",
                                    file_content: texts[i].imgArr,
                                },
                                handleError
                            );
                        }

                        delete texts[i].type;
                        delete texts[i].imgArr;
                        texts[i].imageSrc = imagePrefix + response.data.s3_key;
                    }
                }
                animCopy.blackboardData.jsonData.data = JSON.parse(
                    JSON.stringify(texts)
                );
            }
            if (
                isInteractable &&
                puzzleType === "jigsaw-puzzle" &&
                animCopy.blackboardData.jsonData.b64string
            ) {
                const baseEndpoint = process.env.REACT_APP_ADMIN_BASE_ENDPOINT;
                const response = await httpPost(baseEndpoint + `jigsaw`, {
                    encoded_image: animCopy.blackboardData.jsonData.b64string,
                });
                delete animCopy.blackboardData.jsonData.b64string;
                animCopy.blackboardData.jsonData.images = response.data.data;
            }
            setAnimationsJson(JSON.parse(JSON.stringify(animCopy)));
            setOrigAnimJson(JSON.parse(JSON.stringify(animCopy)));
            await editPuzzle(
                { sceneId, objectId, isInteractable, animationsJson },
                handleError
            );
        };
        if (
            isInteractable &&
            puzzleType === "text-pane" &&
            animationsJson?.blackboardData?.jsonData?.data?.length === 0
        ) {
            setErrorText("Error: Need at least one text to save text-pane");
            setShowError(true);
            return;
        }
        await savePuzzle();
        setSuccessText(
            "Saved puzzle CRUD changes for object with id: " + objectId
        );
        setShowSuccess(true);
    };

    const toggleButton = () => {
        if (isInteractable) {
            setAnimationsJson({});
        } else {
            setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
        }
        setIsInteractable(!isInteractable);
    };

    const toggleButton2 = () => {
        const animCopy = _.cloneDeep(animationsJson);
        animCopy.blackboardData.jsonData.is_last_object = !isLastPuzzle;
        setAnimationsJson(animCopy);
        setIsLastPuzzle(!isLastPuzzle);
    };

    const addHeader = () => {
        setHeader("");
    };

    const deleteHeader = () => {
        setHeader(null);
    };

    const handleSuccessSnackbarClose = () => {
        setShowSuccess(false);
    };

    const handleErrorSnackbarClose = () => {
        setShowError(false);
    };

    const handleTextChange = (event) => {
        const newText = event.target.value;
        if (newText !== null) {
            setHeader(newText);
        }
    };

    const addCaption = () => {
        setCaption("");
    };

    const deleteCaption = () => {
        setCaption(null);
    };

    const handleCaptionChange = (event) => {
        const newText = event.target.value;
        if (newText !== null) {
            setCaption(newText);
        }
    };

    return (
        <div
            className={classes.container}
            style={{
                paddingLeft: "30px",
                paddingRight: "30px",
                paddingTop: "10px",
            }}
        >
            <h1>Update Interactive Type</h1>
            <div>
                <label htmlFor="subscribeNews">Interactable?</label>
                <Switch
                    checked={isInteractable}
                    onChange={() => {
                        toggleButton();
                    }}
                    inputProps={{
                        "aria-label": "controlled",
                        height: 40,
                    }}
                    classes={{
                        track: classes.switch_track,
                        switchBase: classes.switch_base,
                        colorPrimary: classes.switch_primary,
                        colorSecondary: Colours.MainRed5,
                    }}
                />
            </div>
            {!isInteractable || puzzleType === "" ? null : header === null ? (
                <div>
                    Add Header
                    <IconButton
                        className={classes.addButton}
                        aria-label="add"
                        onClick={addHeader}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            ) : (
                <div>
                    Header:
                    <TextField
                        value={header}
                        onChange={(e) => handleTextChange(e)}
                        required
                        variant="outlined"
                        placeholder="Enter header text"
                        multiline
                    />
                    <IconButton onClick={() => deleteHeader()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            {isInteractable ? (
                <div style={{ marginBottom: "20px" }}>
                    <b>Interaction Type *</b>
                </div>
            ) : null}
            {isInteractable ? (
                <div style={{ width: "300px" }}>
                    <Select
                        value={puzzleTypeList.filter(
                            (option) => option.value === puzzleType
                        )}
                        options={puzzleTypeList}
                        placeholder="Choose Interaction Type"
                        noResultsText="No puzzle types found"
                        searchable={true}
                        onChange={selectPuzzleType}
                    />
                </div>
            ) : null}
            {isInteractable &&
            (puzzleType === "jigsaw-puzzle" ||
                puzzleType === "ordered-puzzle" ||
                puzzleType === "keyboard-puzzle" ||
                puzzleType === "numpad-puzzle") ? (
                <div>
                    <label htmlFor="subscribeNews">Last Puzzle?</label>
                    <Switch
                        checked={isLastPuzzle}
                        onChange={() => {
                            toggleButton2();
                        }}
                        inputProps={{
                            "aria-label": "controlled",
                            height: 40,
                        }}
                        classes={{
                            track: classes.switch_track,
                            switchBase: classes.switch_base,
                            colorPrimary: classes.switch_primary,
                            colorSecondary: Colours.MainRed5,
                        }}
                    />
                </div>
            ) : null}
            {isInteractable && puzzleType === "text-pane" ? (
                <TextPaneView
                    saveTexts={saveTexts}
                    texts={
                        origAnimJson?.blackboardData?.jsonData?.data
                            ? origAnimJson?.blackboardData?.jsonData?.data
                            : []
                    }
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "visual-pane" ? (
                <VisualPaneView
                    saveImage={saveImage}
                    saveCaption={saveCaption}
                    caption={
                        origAnimJson?.blackboardData?.jsonData?.caption
                            ? origAnimJson?.blackboardData?.jsonData?.caption
                            : null
                    }
                    src={origAnimJson?.blackboardData?.jsonData?.imageSrc}
                />
            ) : null}
            {isInteractable && puzzleType === "jigsaw-puzzle" ? (
                <JigsawPuzzle
                    saveJigsawImages={saveJigsawImages}
                    images={
                        origAnimJson?.blackboardData?.jsonData?.images
                            ? origAnimJson?.blackboardData?.jsonData?.images
                            : null
                    }
                />
            ) : null}
            {isInteractable && puzzleType === "unordered-puzzle" ? (
                <UnorderedPuzzle
                    saveImageN={saveImageN}
                    saveImages={saveImages}
                    addImage={addImage}
                    deleteImage={deleteImage}
                    images={
                        origAnimJson?.blackboardData?.jsonData?.useTargets ===
                        false
                            ? JSON.parse(
                                  JSON.stringify(
                                      origAnimJson.blackboardData.jsonData
                                          .images
                                  )
                              )
                            : [{}, {}]
                    }
                    isUnordered={true}
                    imagesLen={
                        origAnimJson?.blackboardData?.jsonData?.useTargets ===
                        false
                            ? origAnimJson.blackboardData.jsonData.images.length
                            : 0
                    }
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "ordered-puzzle" ? (
                <UnorderedPuzzle
                    saveImageN={saveImageN}
                    saveImages={saveImages}
                    addImage={addImage}
                    deleteImage={deleteImage}
                    images={
                        origAnimJson?.blackboardData?.jsonData?.useTargets ===
                        true
                            ? origAnimJson.blackboardData.jsonData.images
                            : []
                    }
                    isUnordered={false}
                    imagesLen={
                        origAnimJson?.blackboardData?.jsonData?.useTargets ===
                        true
                            ? origAnimJson.blackboardData.jsonData.images.length
                            : 2
                    }
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "numpad-puzzle" ? (
                <KeypadPuzzle
                    savePass={savePass}
                    setErrorMsg={setErrorMsg}
                    errorMsg={
                        origAnimJson?.blackboardData?.jsonData?.errorMsg
                            ? origAnimJson.blackboardData.jsonData.errorMsg
                            : ""
                    }
                    pass={
                        origAnimJson?.blackboardData?.jsonData?.model !==
                        "numpad"
                            ? null
                            : origAnimJson?.blackboardData?.jsonData?.password
                            ? origAnimJson?.blackboardData?.jsonData?.password
                            : null
                    }
                    isNumpad={true}
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "keyboard-puzzle" ? (
                <KeypadPuzzle
                    savePass={savePass}
                    setErrorMsg={setErrorMsg}
                    errorMsg={
                        origAnimJson?.blackboardData?.jsonData?.errorMsg
                            ? origAnimJson.blackboardData.jsonData.errorMsg
                            : ""
                    }
                    pass={
                        origAnimJson?.blackboardData?.jsonData?.model !==
                        "basic"
                            ? null
                            : origAnimJson?.blackboardData?.jsonData?.password
                            ? origAnimJson?.blackboardData?.jsonData?.password
                            : null
                    }
                    isNumpad={false}
                    classes={classes}
                />
            ) : null}
            {!isInteractable ||
            puzzleType === "" ||
            puzzleType === "text-pane" ? null : caption === null ? (
                <div>
                    Add Caption
                    <IconButton
                        className={classes.addButton}
                        aria-label="add"
                        onClick={addCaption}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            ) : (
                <div>
                    <br></br>
                    Caption:
                    <TextField
                        value={caption}
                        onChange={(e) => handleCaptionChange(e)}
                        required
                        variant="outlined"
                        placeholder="Enter caption text"
                        multiline
                    />
                    <IconButton onClick={() => deleteCaption()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            <div>
                <Button
                    color="primary"
                    onClick={handleSave}
                    style={
                        puzzleType !== ""
                            ? {
                                  background: Colours.MainRed5,
                                  color: "white",
                                  float: "right",
                                  position: "fixed",
                                  bottom: 0,
                                  right: 0,
                                  margin: 20,
                              }
                            : {
                                  background: Colours.Grey5,
                                  color: "white",
                                  float: "right",
                                  position: "fixed",
                                  bottom: 0,
                                  right: 0,
                                  margin: 20,
                              }
                    }
                    disabled={puzzleType === ""}
                >
                    Set Puzzle
                </Button>
            </div>
            {showSuccess ? (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={showSuccess}
                    autoHideDuration={2000}
                    onClose={handleSuccessSnackbarClose}
                    style={{
                        position: "flex",
                        bottom: 25,
                        right: 25,
                        minWidth: "max-content",
                        height: "fit-content",
                    }}
                >
                    <SnackbarContent
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                        }}
                        message={<span>{successText}</span>}
                    />
                </Snackbar>
            ) : null}
            {showError ? (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={showError}
                    autoHideDuration={2000}
                    onClose={handleErrorSnackbarClose}
                    style={{
                        position: "flex",
                        bottom: 25,
                        right: 25,
                        minWidth: "max-content",
                        height: "fit-content",
                    }}
                >
                    <SnackbarContent
                        style={{
                            backgroundColor: "#EC4E55",
                            color: "white",
                        }}
                        message={<span>{errorText}</span>}
                    />
                </Snackbar>
            ) : null}
        </div>
    );
}
