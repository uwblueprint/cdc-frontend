import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Navbar from "../navbar";
import EnvironmentBar from "./environmentBar";
import SceneCard from "./sceneCard";
import SceneModal from "./sceneModal";
import { getScenario, editScenario } from "../../../lib/scenarioEndpoints";
import { getScene, createScene, editScene } from "../../../lib/sceneEndpoints";

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

export default function EnvironmentEditor({
    match: {
        params: { environmentId },
    },
}) {
    const classes = useStyles();
    const [environment, setEnvironment] = useState({});
    const [scenes, setScenes] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editSceneInfo, setEditSceneInfo] = useState({});

    useEffect(() => {
        const getEnvironment = async () => {
            const data = await getScenario(environmentId);
            setEnvironment(data);
        };

        if (environmentId) {
            getEnvironment();
        }
    }, [environmentId]);

    useEffect(() => {
        const getSceneData = async () => {
            const data = await Promise.all(
                environment.scene_ids.map(async (id) => getScene(id))
            );
            setScenes(data);
        };

        if (environment.scene_ids) {
            getSceneData();
        }
    }, [environment]);

    const reorder = ({ scenes, startIndex, endIndex }) => {
        const result = Array.from(scenes);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder({
            scenes,
            startIndex: result.source.index,
            endIndex: result.destination.index,
        });
        setScenes(items);

        const newSceneIds = items.map((scene) => scene.id);
        const response = await editScenario({
            id: environment.id,
            name: environment.name,
            friendly_name: environment.friendly_name,
            description: environment.description,
            scene_ids: newSceneIds,
            is_published: environment.is_published,
            is_previewable: environment.is_previewable,
        });
        setEnvironment(response.data);
    };

    const onCreateButtonClick = () => {
        setCreateModalOpen(true);
    };

    const onCreateModalClose = () => {
        setCreateModalOpen(false);
    };

    const onCreateModalSubmit = async (name, background_id) => {
        setCreateModalOpen(false);

        const newScene = await createScene(name, background_id);
        const newSceneData = [...scenes, newScene];
        setScenes(newSceneData);

        const newEnvData = environment;
        newEnvData.scene_ids = [...environment.scene_ids, newScene.id];
        const newEnv = await editScenario(newEnvData);
        setEnvironment(newEnv.data);
    };

    const onEditButtonClick = (sceneId) => {
        const scene = scenes.find((scene) => scene.id === sceneId);
        setEditSceneInfo(scene);
        setEditModalOpen(true);
    };

    const onEditModalClose = () => {
        setEditModalOpen(false);
        setEditSceneInfo({});
    };

    const onEditModalSubmit = async (name, background_id) => {
        setEditModalOpen(false);
        const resp = await editScene({
            id: editSceneInfo.id,
            name,
            description: editSceneInfo.description,
            object_ids: editSceneInfo.object_ids,
            position: editSceneInfo.position,
            scale: editSceneInfo.scale,
            rotation: editSceneInfo.rotation,
            background_id,
            camera_properties: editSceneInfo.camera_properties,
        });
        const replaceIndex = scenes.findIndex(
            (scene) => scene.id === editSceneInfo.id
        );
        const copiedScenes = [...scenes];
        copiedScenes[replaceIndex] = resp.data;
        setScenes(copiedScenes);
    };

    return (
        <div>
            <Navbar home />
            <div className={classes.page}>
                <EnvironmentBar onCreateButtonClick={onCreateButtonClick} />
            </div>
            <div className={classes.container}>
                {scenes !== undefined && scenes.length !== 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            direction="horizontal"
                        >
                            {(provided) => (
                                <div>
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
                                                        handleEditClick={
                                                            onEditButtonClick
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {provided.placeholder}
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
                                onClick={onCreateButtonClick}
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

            <SceneModal
                modalOpen={createModalOpen}
                handleModalClose={onCreateModalClose}
                handleSubmit={onCreateModalSubmit}
            />
            <SceneModal
                scene={editSceneInfo}
                modalOpen={editModalOpen}
                handleModalClose={onEditModalClose}
                handleSubmit={onEditModalSubmit}
                isEdit
            />
        </div>
    );
}
