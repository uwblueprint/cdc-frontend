import React from "react";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { fileToByteArray } from "../../../lib/s3Utility";
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

export default function VisualPaneView() {
    const classes = useStyles();
    const [assetByteArray, setAssetByteArray] = React.useState(null);

    const handleUploadFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            fileToByteArray(file, setAssetByteArray);
            const temp = assetByteArray;
            alert(temp.length);
        }
    };

    return (
        <div>
            <Typography component="div" variant="h5" className={classes.text}>
                Upload Image
            </Typography>
            <input
                accept=".jpg,.jpeg,.png"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleUploadFileChange}
            />
            <label htmlFor="contained-button-file">
                <Button
                    className={classes.uploadButton}
                    variant="contained"
                    color="primary"
                    component="span"
                >
                    Upload
                </Button>
            </label>
        </div>
    );
}
