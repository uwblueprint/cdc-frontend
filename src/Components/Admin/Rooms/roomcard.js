import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    card: {
        fontSize: 16,
    },
}));

export default function RoomCard({ key, data }) {
    const classes = useStyles();

    return (
        <div className={classes.card} key={key}>
            {data.name}
        </div>
    );
}
