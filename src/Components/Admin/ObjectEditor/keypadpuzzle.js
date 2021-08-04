import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";

export default function KeypadPuzzle(props) {
    const [pass, setPass] = useState(props.pass);

    const addPass = () => {
        const newPass = prompt("Enter the text for the puzzle: ");

        if (newPass) {
            props.savePass(newPass);
            setPass(newPass);
        }
    };

    const deletePass = () => {
        props.savePass("");
        setPass("");
    };

    return (
        <div>
            {pass === "" ? (
                <div>
                    Add Password
                    <IconButton
                        className={props.classes.addButton}
                        aria-label="add"
                        onClick={addPass}
                    >
                        <AddIcon />
                    </IconButton>
                    <TextField
                        id="standard-number"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            ) : (
                <div>
                    Password: {pass}
                    <IconButton onClick={() => deletePass()}>
                        <DeleteForever />
                    </IconButton>
                </div>
            )}
        </div>
    );
}
