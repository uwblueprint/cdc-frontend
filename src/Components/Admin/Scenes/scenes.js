import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemCard from "../common/itemCard.js";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function Scenes({ scenes }) {
    const classes = useStyles();

    return (
        <Container component={"main"} maxWidth="lg">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="h1" variant="h5">
                    Scenes Page
                </Typography>
                <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    alignItems="center"
                    justify="flex-start"
                >
                    {scenes.map(function (room) {
                        return (
                            <ItemCard
                                key={room.id}
                                data={room}
                                cardType="scene"
                                handleEditClick={() => {}}
                                handleDeleteClick={() => {}}
                            />
                        );
                    })}
                </Grid>
            </div>
        </Container>
    );
}