import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles(() => ({
    sceneItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E2E5ED",
        padding: 16,
        userSelect: "none",
        margin: "0 16px 0 0",
        width: "400px",
        height: "300px",
    },
}));

export default function SceneCard({ scene, index }) {
    const classes = useStyles();
    return (
        <Draggable key={scene.id} index={index} draggableId={scene.id}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    className={classes.sceneItem}
                    style={provided.draggableProps.style}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {scene.name}
                </div>
            )}
        </Draggable>
    );
}
