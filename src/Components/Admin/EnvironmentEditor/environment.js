import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Navbar from "../navbar";
import EnvironmentBar from "./environmentBar";
import SceneCard from "./sceneCard";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
    container: {
        paddingTop: theme.spacing(12),
    },
    dragAndDropContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: "16px",
    },
    emptyButtonsContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "space-around",
    },
    buttonContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(4),
    },
    button: {
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: "#E2E5ED",
        borderRadius: "12px",
    },
}));

export default function EnvironmentEditor() {
    const classes = useStyles();
    const [scenes, setScenes] = useState([
        {
            id: "1",
            name: "Scene 1",
        },
        {
            id: "2",
            name: "Scene 2",
        },
        {
            id: "3",
            name: "Scene 3",
        },
        {
            id: "4",
            name: "Scene 4",
        },
        {
            id: "5",
            name: "Scene 5",
        },
    ]);

    const reorder = ({ scenes, startIndex, endIndex }) => {
        const result = Array.from(scenes);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder({
            scenes,
            startIndex: result.source.index,
            endIndex: result.destination.index,
        });
        setScenes(items);
    };

    return (
        <div>
            <Navbar home />
            <div className={classes.page}>
                <EnvironmentBar />
            </div>
            <div className={classes.container}>
                {scenes !== undefined && scenes.length !== 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            direction="horizontal"
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    className={classes.dragAndDropContainer}
                                    {...provided.droppableProps}
                                >
                                    {scenes.map(function (scene, index) {
                                        return (
                                            <div key={scene.id}>
                                                <SceneCard
                                                    scene={scene}
                                                    index={index}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : (
                    <div className={classes.emptyButtonsContainer}>
                        <div className={classes.buttonContainer}>
                            <Button
                                startIcon={<AddIcon />}
                                className={classes.button}
                            >
                                New Scene from Scratch
                            </Button>
                        </div>
                        <div className={classes.buttonContainer}>
                            <Button
                                startIcon={<AccountBalanceIcon />}
                                className={classes.button}
                            >
                                New Scene from Template
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
