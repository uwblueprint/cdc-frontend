import React, { useEffect } from "react";
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
            handleUploadImageSubmit(name, type, "image", imageByteArray);
            setUploaded(true);
            setImageByteArray(null);
        };

        if (imageByteArray !== null) {
            uploadImage();
        }
    }, [name, type, imageByteArray, images, curIndex, props, handleError]);

    const handleUploadFileChange = async (event, index) => {
        if (event.target.files && event.target.files[0]) {
            setCurIndex(index);
            const file = event.target.files[0];
            await fileToByteArray(file, setImageByteArray);
            setName(file.name);
            setType(file.type.replace("image/", ""));
        }
    };

    // const uploadImageHtml = (index) => {
    //     return (
    //         <div>
    //             <Typography
    //                 component="div"
    //                 variant="h5"
    //                 className={classes.text}
    //             >
    //                 Upload Image #{index + 1}, Cur is {curIndex}
    //             </Typography>
    //             {images[index].imageSrc ? (
    //                 <div>
    //                     <Typography
    //                         component="div"
    //                         variant="h7"
    //                         className={classes.text}
    //                     >
    //                         Image Preview:
    //                     </Typography>
    //                     <img
    //                         src={images[index].imageSrc}
    //                         height={250}
    //                         max-width={1000}
    //                         object-fit={"contain"}
    //                     ></img>
    //                 </div>
    //             ) : null}
    //             <input
    //                 accept=".jpg,.jpeg,.png"
    //                 className={classes.input}
    //                 id="contained-button-file"
    //                 type="file"
    //                 onChange={(e) => handleUploadFileChange(e, index)}
    //             />
    //             <label htmlFor="contained-button-file">
    //                 <Button
    //                     className={classes.uploadButton}
    //                     variant="contained"
    //                     color="primary"
    //                     component="span"
    //                 >
    //                     Upload
    //                 </Button>
    //             </label>
    //             {uploaded ? <div>{name} successfully uploaded</div> : null}
    //         </div>
    //     );
    // };

    return (
        <div>
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
