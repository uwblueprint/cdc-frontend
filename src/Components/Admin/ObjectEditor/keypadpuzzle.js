import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Button, IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";

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
    const [showNumpadPrompt, setNumpadPrompt] = useState(false);
    const [showKeyboardPrompt, setKeyboardPrompt] = useState(false);
    const [showSavePass, setSavePass] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const showPrompt = () => {
        if (props.isNumpad) {
            setNumpadPrompt(true);
        } else {
            setKeyboardPrompt(true);
        }
        setSavePass(true);
    };

    const deletePass = () => {
        props.savePass("");
        setPass("");
        if (props.isNumpad) {
            setNumpadPrompt(false);
        } else {
            setKeyboardPrompt(false);
        }
        setSavePass(false);
    };

    const savePass = () => {
        props.savePass(tempPass);
        setPass(tempPass);
    };

    const numpadOnChange = (e) => {
        const re = /^[0-9]{1,7}$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            setTempPass(e.target.value);
            setShowError(false);
            setSavePass(true);
        } else {
            setErrorText(
                "Error: Password must be at most 7 characters and only consist of numbers"
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

    return (
        <div>
            {pass === "" ? (
                <div>
                    Add Password
                    <IconButton
                        className={props.classes.addButton}
                        aria-label="add"
                        onClick={showPrompt}
                    >
                        <AddIcon />
                    </IconButton>
                    {props.isNumpad && showNumpadPrompt ? (
                        <TextField
                            inputProps={{
                                className: classes.input,
                                pattern: "[0-9]{1,7}",
                            }}
                            onChange={numpadOnChange}
                        />
                    ) : null}
                    {!props.isNumpad && showKeyboardPrompt ? (
                        <TextField
                            inputProps={{
                                className: classes.input,
                                pattern: "[0-9a-zA-Z]{1,16}",
                            }}
                            onChange={keyboardOnChange}
                        />
                    ) : null}
                    {showSavePass ? (
                        <Button color="primary" onClick={() => savePass()}>
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
            {showError ? <Alert severity="error">{errorText}</Alert> : null}
        </div>
    );
}
