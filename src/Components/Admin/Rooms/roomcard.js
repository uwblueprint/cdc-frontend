import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import defaultImage from "./defaultImage.svg";

const useStyles = makeStyles(() => ({
    card: {
        fontSize: 16,
    },
}));

export default function RoomCard({ key, data }) {
    const classes = useStyles();

    return (
        <div className={classes.card} key={key}>
            <img
                src={data.image ? data.image : defaultImage}
                alt="Escape Room"
            />
            <p>{data.name}</p>
        </div>
    );
}
