import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SceneCard from "./sceneCard.js";
import { Colours } from "../../../styles/Constants.ts";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: "-65px",
    },
    title: {
        marginTop: theme.spacing(4),
        marginLeft: "-45px",
    },
}));

export default function Scenes({ scenes }) {
    const classes = useStyles();

    return (
        <Container component={"main"} maxWidth="lg">
            <CssBaseline />
            <Typography
                component="div"
                variant="h4"
                className={classes.title}
                style={{ color: Colours.Grey9 }}
            >
                Scenes Page
            </Typography>
            <div className={classes.page}>
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
                            <SceneCard
                                key={room.id}
                                data={room}
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
