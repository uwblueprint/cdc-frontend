import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
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
    const [pass, setPass] = useState(props.pass);
    const [errorMsg, setErrorMsg] = useState(props.errorMsg);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const numpadOnChange = (e) => {
        const re = /^[.0-9]{1,8}$/;
        if (re.test(e.target.value)) {
            props.savePass(e.target.value);
            setPass(e.target.value);
            setShowError(false);
        } else {
            setErrorText(
                "Error: Password must be at most 8 characters and only consist of numbers or a decimal"
            );
            setShowError(true);
        }
    };

    const keyboardOnChange = (e) => {
        const re = /^[0-9a-zA-Z]{1,16}$/;
        if (re.test(e.target.value)) {
            props.savePass(e.target.value);
            setPass(e.target.value);
            setShowError(false);
        } else {
            setErrorText(
                "Error: Password must be at most 16 characters and must be alphanumeric"
            );
            setShowError(true);
        }
    };

    const addPass = () => {
        if (props.isNumpad) {
            props.savePass("123");
            setPass("123");
        } else {
            props.savePass("abc123");
            setPass("abc123");
        }
    };

    const addErrorMsg = () => {
        setErrorMsg("");
    };

    const deleteErrorMsg = () => {
        setErrorMsg(null);
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
            <div>
                <br></br>
                {props.isNumpad ? "Numeric Password" : "Alphanumeric Password"}
                <br></br>
                {!props.isNumpad ? null : pass !== null ? (
                    <TextField
                        value={pass}
                        required
                        variant="outlined"
                        placeholder="Enter transition text"
                        multiline
                        inputProps={{
                            className: classes.input,
                            pattern: "[.0-9]{1,8}",
                        }}
                        onChange={numpadOnChange}
                    />
                ) : (
                    <div>
                        Add Password
                        <IconButton
                            className={classes.addButton}
                            aria-label="add"
                            onClick={addPass}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                )}
                {props.isNumpad ? null : pass !== null ? (
                    <TextField
                        value={pass}
                        required
                        variant="outlined"
                        placeholder="Enter transition text"
                        multiline
                        inputProps={{
                            className: classes.input,
                            pattern: "[0-9a-zA-Z]{1,16}",
                        }}
                        onChange={keyboardOnChange}
                    />
                ) : (
                    <div>
                        Add Password
                        <IconButton
                            className={classes.addButton}
                            aria-label="add"
                            onClick={addPass}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                )}
                <br></br>
            </div>
            {errorMsg === null ? (
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
