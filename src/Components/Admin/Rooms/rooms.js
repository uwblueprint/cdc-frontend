import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import RoomCard from "./roomcard.js";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function EscapeRooms() {
    const classes = useStyles();
    const rooms = [
        {
            id: 1,
            name: "Ahmed's Escape Room",
        },
        {
            id: 2,
            name: "Jay's Escape Room",
        },
        {
            id: 3,
            name: "Dhruvin's Escape Room",
        },
        {
            id: 4,
            name: "Amolik's Escape Room",
        },
        {
            id: 5,
            name: "Aaron's Escape Room",
        },
        {
            id: 6,
            name: "Vivian's Escape Room",
        },
        {
            id: 7,
            name: "Kevin's Escape Room",
        },
        {
            id: 8,
            name: "Kouthar's Escape Room",
        },
        {
            id: 9,
            name: "Jack's Escape Room",
        },
    ];

    return (
        <Container component={"main"} maxWidth="lg">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="h1" variant="h5">
                    Escape Rooms Page
                </Typography>
                <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    alignItems="center"
                    justify="flex-start"
                >
                    {rooms.map(function (room) {
                        return <RoomCard key={room.id} data={room} />;
                    })}
                </Grid>
            </div>
        </Container>
    );
}
