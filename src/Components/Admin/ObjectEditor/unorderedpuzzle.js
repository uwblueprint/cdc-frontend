import React, { useEffect } from "react";
import Select from "react-select";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
    fileToByteArray,
    createPresignedLinkAndUploadS3,
} from "../../../lib/s3Utility";
import { makeStyles } from "@material-ui/core/styles";

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
        const handleUploadImageSubmit = async (
            name,
            file_type,
            object_type,
            imageByteArray
        ) => {
            const response = await createPresignedLinkAndUploadS3(
                {
                    file_type: file_type,
                    type: "image",
                    file_content: imageByteArray,
                },
                handleError
            );

            const imagePrefix = process.env.REACT_APP_ADMIN_ASSET_PREFIX;
            const imagesCopy = images;
            imagesCopy[curIndex].imageSrc = imagePrefix + response.data.s3_key;
            setImages(imagesCopy);
            props.saveImageN(curIndex, imagePrefix + response.data.s3_key);
        };

        const uploadImage = async () => {
            await handleUploadImageSubmit(name, type, "image", imageByteArray);
            setUploaded(true);
            setImageByteArray(null);
        };

        if (imageByteArray !== null) {
            uploadImage();
        }

        const populateImages = async () => {
            let newImages = [];
            newImages = images;
            while (imagesLen > newImages.length) {
                const tempImage = { xTarget: 0, yTarget: 0, imageSrc: "" };
                newImages.push(tempImage);
            }
            while (imagesLen < newImages.length) {
                newImages.pop();
            }
            setImages(newImages);
            setImagesLen(0);
            setUploaded(false);
        };

        if (imagesLen !== 0) {
            populateImages();
        }
    }, [
        name,
        type,
        imageByteArray,
        images,
        curIndex,
        imagesLen,
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
            setImagesLen(images.length);
        }
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
                    </div>
                );
            })}
        </div>
    );
}
