import React, { useEffect } from "react";
import Select from "react-select";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { fileToByteArray } from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    textField: {
        width: "400px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
    },
    formControl: {
        width: "12vw",
    },
    dialog: {
        margin: theme.spacing(1),
    },
    input: {
        display: "none",
    },
}));

export default function UnorderedPuzzle(props) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [name, setName] = React.useState(null);
    const [type, setType] = React.useState(null);
    const [imageByteArray, setImageByteArray] = React.useState(null);
    const [uploaded, setUploaded] = React.useState(false);
    const [images, setImages] = React.useState(props.images);
    const [curIndex, setCurIndex] = React.useState(0);
    const [imagesLen, setImagesLen] = React.useState(props.imagesLen);
    const isUnordered = props.isUnordered;

    const imagesLengthList = [
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
    ];

    const selectPuzzleImages = (obj) => {
        if (obj) {
            setImagesLen(obj.value);
        }
    };

    useEffect(() => {
        const handleUploadImageSubmit = async (imageByteArray) => {
            const blob = new Blob([imageByteArray], { type: type });
            const imagesCopy = images;
            imagesCopy[curIndex].imageSrc = URL.createObjectURL(blob);
            setImages(JSON.parse(JSON.stringify(imagesCopy)));
            props.saveImageN(curIndex, imageByteArray, type);
        };

        const uploadImage = async () => {
            await handleUploadImageSubmit(imageByteArray);
            setUploaded(true);
            setImageByteArray(null);
        };

        if (imageByteArray !== null) {
            uploadImage();
        }

        const populateImages = async () => {
            let newImages = [];
            newImages = images;
            let xTarg = 0;
            if (!isUnordered) {
                xTarg = -2.5;
            }
            while (imagesLen > newImages.length) {
                const tempImage = { xTarget: xTarg, yTarget: 0, imageSrc: "" };
                newImages.push(tempImage);
                if (!isUnordered) {
                    xTarg += 1.25;
                }
            }
            while (imagesLen < newImages.length) {
                newImages.pop();
            }
            props.saveImages(newImages);
            setImages(newImages);
            setImagesLen(0);
            setUploaded(false);
        };

        if (imagesLen !== 0) {
            populateImages();
        }
    }, [
        type,
        imageByteArray,
        images,
        curIndex,
        imagesLen,
        isUnordered,
        props,
        handleError,
    ]);

    const handleUploadFileChange = async (event, index) => {
        if (event.target.files && event.target.files[0]) {
            setCurIndex(index);
            const file = event.target.files[0];
            await fileToByteArray(file, setImageByteArray);
            setName(file.name);
            setType(file.type.replace("image/", ""));
        }
    };

    const reorder = (startIndex, endIndex) => {
        const result = images;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const reorderImages = (sourceIndex, destinationIndex) => {
        if (
            sourceIndex == null ||
            destinationIndex == null ||
            sourceIndex === destinationIndex
        ) {
            return;
        }

        const reorderedList = reorder(sourceIndex, destinationIndex);
        const temp = reorderedList[sourceIndex].xTarget;
        reorderedList[sourceIndex].xTarget =
            reorderedList[destinationIndex].xTarget;
        reorderedList[destinationIndex].xTarget = temp;
        props.saveImages([...reorderedList]);
        setImages([...reorderedList]);
    };

    const onMoveUpClick = (index) => {
        reorderImages(index, Math.max(0, index - 1));
    };

    const onMoveDownClick = (index) => {
        reorderImages(index, Math.min(images.length - 1, index + 1));
    };

    return (
        <div>
            {isUnordered ? (
                <Select
                    value={imagesLengthList.filter(
                        (option) => option.value === images?.length
                    )}
                    options={imagesLengthList}
                    placeholder="Select number of images..."
                    searchable={false}
                    onChange={selectPuzzleImages}
                />
            ) : null}
            {images.map((item, index) => {
                return (
                    <div key={index}>
                        <Typography
                            component="div"
                            variant="h5"
                            className={classes.text}
                        >
                            Upload Image #{index + 1}
                        </Typography>
                        {item.imageSrc ? (
                            <div>
                                <Typography
                                    component="div"
                                    variant="h6"
                                    className={classes.text}
                                >
                                    Image Preview:
                                </Typography>
                                <img
                                    src={item.imageSrc}
                                    height={250}
                                    max-width={1000}
                                    object-fit={"contain"}
                                ></img>
                            </div>
                        ) : null}
                        <input
                            accept=".jpg,.jpeg,.png"
                            className={classes.input}
                            id={"contained-button-file" + index}
                            type="file"
                            onChange={(e) => handleUploadFileChange(e, index)}
                        />
                        <label htmlFor={"contained-button-file" + index}>
                            <Button
                                className={classes.uploadButton}
                                variant="contained"
                                color="primary"
                                component="span"
                            >
                                Upload
                            </Button>
                        </label>
                        {uploaded && index === curIndex ? (
                            <div>{name} successfully uploaded</div>
                        ) : null}
                        {!isUnordered ? (
                            <div>
                                <IconButton
                                    onClick={() => onMoveUpClick(index)}
                                >
                                    <KeyboardArrowUp />
                                </IconButton>
                                <IconButton
                                    onClick={() => onMoveDownClick(index)}
                                >
                                    <KeyboardArrowDown />
                                </IconButton>
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
