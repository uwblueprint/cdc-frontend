import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import defaultImage from "./defaultImage.svg";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
    card: {
        fontSize: 16,
    },
    cardImage: {
        width: "90%",
        maxWidth: 400,
        marginTop: 16,
    },
}));

export default function RoomCard({ key, data }) {
    const classes = useStyles();

    return (
        <Grid
            container
            item
            xs={12}
            md={6}
            lg={4}
            spacing={1}
            alignItems="center"
            justify="flex-start"
            className={classes.card}
            key={key}
        >
            <Grid container item xs={12} alignItems="center" justify="center">
                <img
                    className={classes.cardImage}
                    src={data.image ? data.image : defaultImage}
                    alt="Escape Room"
                />
            </Grid>
            <Grid container item xs={12} alignItems="center" justify="center">
                <p>{data.name}</p>
            </Grid>
        </Grid>
    );
}
