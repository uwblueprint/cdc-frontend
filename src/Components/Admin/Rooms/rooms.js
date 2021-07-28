import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Colours } from "../../../styles/Constants.ts";

import RoomCard from "./roomCard.js";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(1),
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        justifyContent: "left",
        alignContent: "left",
        marginLeft: "-65px",
    },
    title: {
        marginTop: theme.spacing(4),
        marginLeft: "-45px",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignContent: "left",
    },
}));

export default function EscapeRooms({
    environments,
    handleEditRoomClick,
    handleDeleteRoomClick,
}) {
    const classes = useStyles();
    const [
        preprocessedEnvironment,
        setPreprocessedEnvironment,
    ] = React.useState([]);

    useEffect(() => {
        let environmentGrid = [];
        const cardsPerRow = 3;

        for (let i = 0; i < environments.length; i += cardsPerRow) {
            environmentGrid.push(environments.slice(i, i + cardsPerRow));
        }

        setPreprocessedEnvironment(environmentGrid);
        console.log(environmentGrid);
    }, [environments]);

    return (
        <Container component={"main"} maxWidth="lg">
            <CssBaseline />
            <Typography
                component="div"
                variant="h4"
                className={classes.title}
                style={{ color: Colours.Grey9 }}
            >
                Your escape rooms
            </Typography>

            <div className={classes.page}>
                {preprocessedEnvironment.map(function (row) {
                    return (
                        <div className={classes.row}>
                            {row.map(function (room) {
                                return (
                                    <RoomCard
                                        key={room.id}
                                        data={room}
                                        handleEditClick={handleEditRoomClick}
                                        handleDeleteClick={
                                            handleDeleteRoomClick
                                        }
                                        style={{ float: "left" }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </Container>
    );
}
