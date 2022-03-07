import React, { useState } from "react";
import { Button, IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(() => ({
    input: {
        "&:invalid": {
            border: "red solid 2px",
        },
    },
}));

export default function KeypadPuzzle(props) {
    const classes = useStyles();
    const [tempPass, setTempPass] = useState(props.pass);
    const [pass, setPass] = useState(props.pass);
    const [errorMsg, setErrorMsg] = useState(props.errorMsg);
    const [showSavePass, setSavePass] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const deletePass = () => {
        props.savePass("");
        setPass("");
        setSavePass(false);
    };

    const savePass = () => {
        props.savePass(tempPass);
        setPass(tempPass);
    };

    const numpadOnChange = (e) => {
        const re = /^[.0-9]{1,8}$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            setTempPass(e.target.value);
            setShowError(false);
            setSavePass(true);
        } else {
            setErrorText(
                "Error: Password must be at most 8 characters and only consist of numbers or a decimal"
            );
            setShowError(true);
            setSavePass(false);
        }
    };

    const keyboardOnChange = (e) => {
        const re = /^[0-9a-zA-Z]{1,16}$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            setTempPass(e.target.value);
            setShowError(false);
            setSavePass(true);
        } else {
            setErrorText(
                "Error: Password must be at most 16 characters and must be alphanumeric"
            );
            setShowError(true);
            setSavePass(false);
        }
    };

    const addErrorMsg = () => {
        const newText = {
            text: prompt("Enter the text for the error message: "),
        };

        if (newText.text) {
            setErrorMsg(newText.text);
            props.setErrorMsg(newText.text);
        }
    };

    const deleteErrorMsg = () => {
        setErrorMsg("");
        props.setErrorMsg("");
    };

    const handleTextChange = (event) => {
        const newText = event.target.value;
        if (newText !== null) {
            setErrorMsg(newText);
            props.setErrorMsg(newText);
        }
    };

    return (
        <div>
            {pass === "" ? (
                <div>
                    <br></br>
                    {props.isNumpad
                        ? "Numeric Password"
                        : "Alphanumeric Password"}
                    <br></br>
                    {props.isNumpad ? (
                        <TextField
                            inputProps={{
                                className: classes.input,
                                pattern: "[.0-9]{1,8}",
                            }}
                            onChange={numpadOnChange}
                        />
                    ) : null}
                    {!props.isNumpad ? (
                        <TextField
                            inputProps={{
                                className: classes.input,
                                pattern: "[0-9a-zA-Z]{1,16}",
                            }}
                            onChange={keyboardOnChange}
                        />
                    ) : null}
                    <br></br>
                    {showSavePass ? (
                        <Button
                            color="primary"
                            onClick={() => savePass()}
                            disabled={tempPass === ""}
                        >
                            Save Password
                        </Button>
                    ) : null}
                </div>
            ) : (
                <div>
                    Password: {pass}
                    <IconButton onClick={() => deletePass()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            {errorMsg === "" ? (
                <div>
                    Add Error Message
                    <IconButton
                        className={classes.addButton}
                        aria-label="add"
                        onClick={addErrorMsg}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            ) : (
                <div>
                    <br></br>
                    Error Message:
                    <TextField
                        value={errorMsg}
                        onChange={(e) => handleTextChange(e)}
                        required
                        variant="outlined"
                        placeholder="Enter transition text"
                        multiline
                    />
                    <IconButton onClick={() => deleteErrorMsg()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
            {showError ? <Alert severity="error">{errorText}</Alert> : null}
        </div>
    );
}
