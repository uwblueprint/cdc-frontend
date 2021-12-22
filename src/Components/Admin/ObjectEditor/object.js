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

import {
    getPuzzle,
    editPuzzle,
    deletePuzzleImages,
} from "../../../lib/puzzleEndpoints";
import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";
import JigsawPuzzle from "./jigsawpuzzle";
import { httpPost } from "../../../lib/dataAccess";
import MuiAlert from "@material-ui/lab/Alert";
import _ from "lodash";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    const [header, setHeader] = useState("");
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
        if (showSuccess) {
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
        if (showError) {
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
    }, [
        sceneId,
        objectId,
        isInteractable,
        origAnimJson,
        showSuccess,
        showError,
        handleError,
    ]);

    const selectPuzzleType = (obj) => {
        if (obj) {
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
            } else if (
                obj.value === "numpad-puzzle" &&
                origAnimJson.blackboardData?.componentType === "keypad" &&
                origAnimJson.blackboardData?.jsonData?.model === "numpad"
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
            } else if (
                obj.value === "keyboard-puzzle" &&
                origAnimJson.blackboardData?.componentType === "keypad" &&
                origAnimJson.blackboardData?.jsonData?.model === "basic"
            ) {
                setAnimationsJson(JSON.parse(JSON.stringify(origAnimJson)));
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
                    animCopy.blackboardData.jsonData.scaleBy = 10;
                } else if (obj.value === "unordered-puzzle") {
                    animCopy.blackboardData.componentType = "ordered-puzzle";
                    animCopy.blackboardData.jsonData.useTargets = false;
                    animCopy.blackboardData.jsonData.randomizePos = true;
                    animCopy.blackboardData.draggable = true;
                } else if (obj.value === "ordered-puzzle") {
                    animCopy.blackboardData.jsonData.useTargets = true;
                    animCopy.blackboardData.jsonData.randomizePos = true;
                    animCopy.blackboardData.draggable = true;
                    animCopy.blackboardData.jsonData.scaleBy = 3;
                } else if (obj.value === "numpad-puzzle") {
                    animCopy.blackboardData.componentType = "keypad";
                    animCopy.blackboardData.jsonData.model = "numpad";
                    animCopy.blackboardData.jsonData.is_last_object = true;
                    animCopy.blackboardData.jsonData.password = "";
                } else if (obj.value === "keyboard-puzzle") {
                    animCopy.blackboardData.componentType = "keypad";
                    animCopy.blackboardData.jsonData.model = "basic";
                    animCopy.blackboardData.jsonData.is_last_object = true;
                    animCopy.blackboardData.jsonData.password = "";
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
        animCopy.blackboardData.jsonData.caption = caption;
        setAnimationsJson(animCopy);
    };

    const saveImage = (caption, imgArr, type) => {
        const animCopy = animationsJson;
        animCopy.blackboardData.jsonData.caption = caption;
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
        const imagesCopy = images;
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

    const handleSave = () => {
        const animCopy = animationsJson;
        if (isInteractable && header !== "") {
            animCopy.blackboardData.blackboardText = header;
        } else {
            if (animCopy.blackboardData?.blackboardText) {
                delete animCopy.blackboardData.blackboardText;
            }
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
        setAnimationsJson(animCopy);

        const savePuzzle = async () => {
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
            if (isInteractable && puzzleType === "jigsaw-puzzle") {
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
            if (imagesList.length > 0) {
                await deletePuzzleImages(
                    { sceneId, objectId, imagesList },
                    handleError
                );
                setImagesList([]);
            }
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
        savePuzzle();
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

    const addHeader = () => {
        const newText = {
            text: prompt("Enter the text for the header: "),
        };

        if (newText.text) {
            if (newText.text.length <= 100) {
                setHeader(newText.text);
            } else {
                setErrorText(
                    "Error: Maximum header text length is 100 characters"
                );
                setShowError(true);
            }
        }
    };

    const deleteHeader = () => {
        setHeader("");
    };

    return (
        <div
            className={classes.container}
            style={{ paddingLeft: "30px", paddingRight: "30px" }}
        >
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
            {isInteractable ? (
                header === "" ? (
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
                        Header: {header}
                        <IconButton onClick={() => deleteHeader()}>
                            <DeleteForever />
                        </IconButton>
                    </div>
                )
            ) : null}
            {isInteractable ? (
                <div style={{ marginBottom: "20px" }}>
                    <b>Interaction Type</b>
                </div>
            ) : null}
            {isInteractable ? (
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
            ) : null}
            {isInteractable && puzzleType === "text-pane" ? (
                <TextPaneView
                    saveTexts={saveTexts}
                    texts={animationsJson.blackboardData.jsonData.data}
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "visual-pane" ? (
                <VisualPaneView
                    saveImage={saveImage}
                    saveCaption={saveCaption}
                    caption={
                        animationsJson.blackboardData.jsonData.caption
                            ? animationsJson.blackboardData.jsonData.caption
                            : ""
                    }
                    src={animationsJson.blackboardData.jsonData.imageSrc}
                />
            ) : null}
            {isInteractable && puzzleType === "jigsaw-puzzle" ? (
                <JigsawPuzzle
                    saveJigsawImages={saveJigsawImages}
                    images={animationsJson.blackboardData.jsonData.images}
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
                    images={
                        origAnimJson?.blackboardData?.jsonData?.useTargets ===
                        true
                            ? origAnimJson.blackboardData.jsonData.images
                            : []
                    }
                    isUnordered={false}
                    imagesLen={5}
                />
            ) : null}
            {isInteractable && puzzleType === "numpad-puzzle" ? (
                <KeypadPuzzle
                    savePass={savePass}
                    pass={
                        origAnimJson?.blackboardData?.componentType !==
                        "numpad-puzzle"
                            ? ""
                            : origAnimJson?.blackboardData?.jsonData?.password
                            ? origAnimJson?.blackboardData?.jsonData?.password
                            : ""
                    }
                    isNumpad={true}
                    classes={classes}
                />
            ) : null}
            {isInteractable && puzzleType === "keyboard-puzzle" ? (
                <KeypadPuzzle
                    savePass={savePass}
                    pass={
                        origAnimJson?.blackboardData?.componentType !==
                        "keyboard-puzzle"
                            ? ""
                            : origAnimJson?.blackboardData?.jsonData?.password
                            ? origAnimJson?.blackboardData?.jsonData?.password
                            : ""
                    }
                    isNumpad={false}
                    classes={classes}
                />
            ) : null}
            {!isInteractable || puzzleType !== "" ? (
                <div>
                    <Button
                        color="primary"
                        onClick={handleSave}
                        style={{
                            background: Colours.MainRed5,
                            color: "white",
                            float: "right",
                            position: "fixed",
                            bottom: 0,
                            right: 0,
                            margin: 20,
                        }}
                    >
                        Set Puzzle
                    </Button>
                </div>
            ) : null}
            {showSuccess ? (
                <Alert severity="success">{successText}</Alert>
            ) : null}
            {showError ? <Alert severity="error">{errorText}</Alert> : null}
        </div>
    );
}
