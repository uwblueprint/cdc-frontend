import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";
import { DeleteForever } from "@material-ui/icons";

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
