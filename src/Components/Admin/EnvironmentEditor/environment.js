import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useErrorHandler } from "react-error-boundary";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

import Navbar from "../navbar";
import EnvironmentBar from "./environmentBar";
import SceneCard from "./sceneCard";
import SceneModal from "./sceneModal";
import TemplateModal from "./templateModal";
import TransitionCard from "./transitionCard";
import TransitionModal from "./transitionModal";
import ConclusionModal from "./conclusionModal";
import HintsModal from "./hintsModal";
import DeleteModal from "../common/deleteModal";
import {
    getScenario,
    editScenario,
    deleteTransitionImages,
} from "../../../lib/scenarioEndpoints";
import {
    getScene,
    createScene,
    editScene,
    deleteScene,
    duplicateScene,
} from "../../../lib/sceneEndpoints";

import "../../../styles/index.css";
import { Colours } from "../../../styles/Constants.ts";
import { createPresignedLinkAndUploadS3 } from "../../../lib/s3Utility";

const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    width: 565,
    height: 342,

    // change border colour if dragging
    border: isDragging ? "#EC4E55 solid 5px" : "",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    border: isDraggingOver ? "black solid 5px" : "",
    display: "flex",
    padding: grid,
    overflow: "auto",
});

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
    },
    introContainer: {
        minWidth: 850,
        display: "flex",
    },
    container: {
        display: "flex",
        paddingTop: theme.spacing(12),
        marginLeft: "10px",
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
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    emptyRoomButtonContainer: {
        display: "flex",
        minWidth: "400px",
        justifyContent: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    button: {
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: Colours.Grey3,
        width: 300,
        height: 60,
    },
}));

export default function EnvironmentEditor({
    match: {
        params: { environmentId },
    },
}) {
    const classes = useStyles();
    const handleError = useErrorHandler();
    const [environment, setEnvironment] = useState({});
    const [envName, setEnvName] = useState("");
    const [conclusionData, setConclusionData] = useState({
        header_text: "",
        paragraph_text: "",
        share_link: "",
        external_link: "",
    });
    const [scenes, setScenes] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editHintsModalOpen, setEditHintsModalOpen] = useState(false);
    const [editSceneInfo, setEditSceneInfo] = useState({});
    const [editHintsInfo, setEditHintsInfo] = useState({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteSceneId, setDeleteSceneId] = React.useState(null);
    const [editTransitionInfo, setEditTransitionInfo] = useState([]);
    const [editTransitionModalOpen, setEditTransitionModalOpen] = useState(
        false
    );
    const [editConclusionModalOpen, setEditConclusionModalOpen] = useState(
        false
    );
    const [selectedTransitionId, setSelectedTransitionId] = useState(0);

    useEffect(() => {
        const getEnvironment = async () => {
            const data = await getScenario(environmentId, handleError);
            setEnvironment(data);
            setEnvName(data.name);
        };

        if (environmentId) {
            getEnvironment();
        }
    }, [environmentId, handleError]);

    useEffect(() => {
        const getSceneData = async () => {
            const data = await Promise.all(
                environment.scene_ids.map(async (id) =>
                    getScene(id, handleError)
                )
            );
            setScenes(data);
        };

        if (environment.scene_ids) {
            getSceneData();
        }
    }, [environment, handleError]);

    useEffect(() => {
        const getConclusionData = async () => {
            setConclusionData(environment.conclusion_data);
        };

        if (environment.conclusion_data) {
            getConclusionData();
        }
    }, [environment, handleError]);

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

        const response = await editScenario(
            {
                id: environment.id,
                name: environment.name,
                friendly_name: environment.friendly_name,
                description: environment.description,
                scene_ids: newSceneIds,
                is_published: environment.is_published,
                is_previewable: environment.is_previewable,
            },
            handleError
        );
        setEnvironment(response.data);
        setEnvName(response.data.name);
    };

    const onCreateButtonClick = () => {
        setCreateModalOpen(true);
    };

    const onCreateModalClose = () => {
        setCreateModalOpen(false);
    };

    const onCreateModalSubmit = async (name, background_id, description) => {
        setCreateModalOpen(false);
        const newScene = await createScene(
            name,
            background_id,
            description,
            handleError
        );
        createSceneAndUpdateScenario(newScene);
    };

    const onTemplateButtonClick = () => {
        setTemplateModalOpen(true);
    };

    const onTemplateModalClose = () => {
        setTemplateModalOpen(false);
    };

    const onTemplateModalSubmit = async (scene_id) => {
        setTemplateModalOpen(false);
        const newScene = await duplicateScene(scene_id, handleError);
        createSceneAndUpdateScenario(newScene);
    };

    const createSceneAndUpdateScenario = async (newScene) => {
        const newSceneData = [...scenes, newScene];
        setScenes(newSceneData);

        const newEnvData = environment;
        newEnvData.scene_ids = [...environment.scene_ids, newScene.id];
        newEnvData.transitions = [
            ...newEnvData.transitions,
            {
                data: [
                    {
                        text:
                            "You completed the room! Click done to go to the next one.",
                    },
                ],
                currPosition: 0,
            },
        ];

        const newEnv = await editScenario(newEnvData, handleError);
        setEnvironment(newEnv.data);
        setEnvName(newEnv.data.name);
    };

    const onEditButtonClick = (sceneId) => {
        const scene = scenes.find((scene) => scene.id === sceneId);
        setEditSceneInfo(scene);
        setEditModalOpen(true);
    };

    const onEditHintsButtonClick = (sceneId) => {
        const scene = scenes.find((scene) => scene.id === sceneId);
        setEditHintsInfo(scene);
        setEditHintsModalOpen(true);
    };

    const onTransitionEditClick = (sceneId) => {
        const sceneIndex = environment.scene_ids.indexOf(sceneId);
        const allTransitions = environment.transitions;
        const transitions = allTransitions[sceneIndex + 1];

        setSelectedTransitionId(sceneIndex + 1);
        setEditTransitionInfo(transitions.data);
        setEditTransitionModalOpen(true);
    };

    const onConclusionEditClick = () => {
        setEditConclusionModalOpen(true);
    };

    const onEditModalClose = () => {
        setEditModalOpen(false);
        setEditSceneInfo({});
    };

    const onEditHintsModalClose = () => {
        setEditHintsModalOpen(false);
        setEditHintsInfo({});
    };

    const onTransitionModalClose = () => {
        setEditTransitionModalOpen(false);
        setEditTransitionInfo([]);
    };

    const onConclusionModalClose = () => {
        setEditConclusionModalOpen(false);
    };

    const onEditModalSubmit = async (name, background_id, description) => {
        setEditModalOpen(false);
        const resp = await editScene(
            {
                id: editSceneInfo.id,
                name,
                description,
                object_ids: editSceneInfo.object_ids,
                position: editSceneInfo.position,
                scale: editSceneInfo.scale,
                rotation: editSceneInfo.rotation,
                background_id,
                camera_properties: editSceneInfo.camera_properties,
            },
            handleError
        );
        const replaceIndex = scenes.findIndex(
            (scene) => scene.id === editSceneInfo.id
        );
        const copiedScenes = [...scenes];
        copiedScenes[replaceIndex] = resp.data;
        setScenes(copiedScenes);
    };

    const onEditHintsModalSubmit = async (hints) => {
        setEditHintsModalOpen(false);
        const resp = await editScene(
            {
                id: editHintsInfo.id,
                name: editHintsInfo.name,
                description: editHintsInfo.description,
                object_ids: editHintsInfo.object_ids,
                position: editHintsInfo.position,
                scale: editHintsInfo.scale,
                rotation: editHintsInfo.rotation,
                background_id: editHintsInfo.background_id,
                hints,
                camera_properties: editHintsInfo.camera_properties,
            },
            handleError
        );
        const replaceIndex = scenes.findIndex(
            (scene) => scene.id === editHintsInfo.id
        );
        const copiedScenes = [...scenes];
        copiedScenes[replaceIndex] = resp.data;
        setScenes(copiedScenes);
    };

    const onTransitionModalSubmit = async (transitions, imagesToDelete) => {
        setEditTransitionModalOpen(false);

        const envData = environment;
        if (envData.transitions[selectedTransitionId].data !== transitions) {
            const transitionData = transitions.map((transition) => {
                return { text: transition.text };
            });
            for (let i = 0; i < transitions.length; i++) {
                if (
                    Object.prototype.hasOwnProperty.call(transitions[i], "link")
                ) {
                    transitionData[i].link = transitions[i].link;
                }

                if (
                    Object.prototype.hasOwnProperty.call(
                        transitions[i],
                        "previewUrl"
                    )
                ) {
                    const body = {
                        file_type: transitions[i].fileType,
                        type: "image",
                        file_content: transitions[i].file,
                        s3Key: "",
                    };

                    if (
                        Object.prototype.hasOwnProperty.call(
                            transitions[i],
                            "imageSrc"
                        ) &&
                        transitions[i].imageSrc !== ""
                    ) {
                        const oldS3Key = transitions[i].imageSrc.replace(
                            process.env.REACT_APP_ADMIN_ASSET_PREFIX,
                            ""
                        );
                        imagesToDelete.push(oldS3Key);
                    }
                    const responseData = await createPresignedLinkAndUploadS3(
                        body,
                        handleError
                    );
                    transitionData[i].imageSrc =
                        process.env.REACT_APP_ADMIN_ASSET_PREFIX +
                        responseData.data.s3_key;
                } else if (
                    Object.prototype.hasOwnProperty.call(
                        transitions[i],
                        "imageSrc"
                    )
                ) {
                    transitionData[i].imageSrc = transitions[i].imageSrc;
                }
            }

            if (imagesToDelete.length > 0) {
                await deleteTransitionImages(
                    {
                        scenarioId: environmentId,
                        imagesList: imagesToDelete,
                    },
                    handleError
                );
            }

            envData.transitions[selectedTransitionId].data = transitionData;
            const response = await editScenario(envData, handleError);
            setEnvironment(response.data);
            setEnvName(response.data.name);
        }
    };

    const onConclusionModalSubmit = async (
        new_header_text,
        new_paragraph_text,
        new_share_link,
        new_external_link
    ) => {
        setEditConclusionModalOpen(false);

        const envData = environment;
        const newConclusionData = {
            header_text: new_header_text,
            paragraph_text: new_paragraph_text,
            share_link: new_share_link,
            external_link: new_external_link,
        };
        envData.conclusion_data = newConclusionData;
        const response = await editScenario(envData, handleError);
        setEnvironment(response.data);
        setEnvName(response.data.name);
    };

    const onDeleteButtonClick = (sceneId) => {
        setDeleteSceneId(sceneId);
        setDeleteModalOpen(true);
    };

    const onDeleteModalCancel = () => {
        setDeleteSceneId(null);
        setDeleteModalOpen(false);
    };

    const onDeleteModalSubmit = async () => {
        await deleteScene(deleteSceneId, handleError);

        const modifiedScenes = scenes.filter(
            (scene) => scene.id !== deleteSceneId
        );

        setScenes(modifiedScenes);
        setDeleteSceneId(null);
        setDeleteModalOpen(false);

        const data = await getScenario(environmentId, handleError);
        setEnvironment(data);
        setEnvName(data.name);
    };

    return (
        <div>
            <div className={classes.page}>
                <Navbar home color="secondary" roomName={envName} />
                <EnvironmentBar
                    onCreateButtonClick={onCreateButtonClick}
                    onTemplateButtonClick={onTemplateButtonClick}
                    initialEnv={environment}
                    updateEnvName={setEnvName}
                />
            </div>
            <div className={classes.container}>
                {scenes !== undefined && scenes.length !== 0 ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "65px",
                            paddingRight: "65px",
                        }}
                    >
                        <div style={{ marginRight: 20 }}>
                            <TransitionCard
                                className={classes.introContainer}
                                scene={null}
                                handleEditClick={onTransitionEditClick}
                                isIntroduction
                            />
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId="droppable"
                                direction="horizontal"
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(
                                            snapshot.isDraggingOver
                                        )}
                                        {...provided.droppableProps}
                                    >
                                        {scenes.map(function (scene, index) {
                                            return (
                                                <Draggable
                                                    key={scene.id.toString()}
                                                    index={index}
                                                    draggableId={scene.id.toString()}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided
                                                                    .draggableProps
                                                                    .style
                                                            )}
                                                        >
                                                            <SceneCard
                                                                scene={scene}
                                                                handleEditClick={
                                                                    onEditButtonClick
                                                                }
                                                                handleEditHintsClick={
                                                                    onEditHintsButtonClick
                                                                }
                                                                handleDeleteClick={
                                                                    onDeleteButtonClick
                                                                }
                                                            />
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "inline-flex",
                                                                    position:
                                                                        "absolute",
                                                                    transform:
                                                                        "translate(0,50%)",
                                                                }}
                                                            >
                                                                <TransitionCard
                                                                    scene={
                                                                        scene
                                                                    }
                                                                    handleEditClick={
                                                                        onTransitionEditClick
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div
                                style={{
                                    marginRight: 20,
                                }}
                            >
                                <span className={classes.buttonContainer}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        className={classes.button}
                                        onClick={onCreateButtonClick}
                                    >
                                        <span style={{ textTransform: "none" }}>
                                            New Scene from Scratch
                                        </span>
                                    </Button>
                                </span>
                                <span className={classes.buttonContainer}>
                                    <Button
                                        startIcon={<AccountBalanceIcon />}
                                        className={classes.button}
                                        onClick={onTemplateButtonClick}
                                    >
                                        <span style={{ textTransform: "none" }}>
                                            New Scene from Template
                                        </span>
                                    </Button>
                                </span>
                            </div>
                            <TransitionCard
                                className={classes.introContainer}
                                scene={null}
                                handleEditClick={onConclusionEditClick}
                                isConclusion
                            />
                        </DragDropContext>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "65px",
                            paddingRight: "65px",
                            height: 332,
                        }}
                    >
                        <TransitionCard
                            className={classes.introContainer}
                            scene={null}
                            handleEditClick={onTransitionEditClick}
                            isIntroduction
                        />
                        <div>
                            <span className={classes.emptyRoomButtonContainer}>
                                <Button
                                    startIcon={<AddIcon />}
                                    className={classes.button}
                                    onClick={onCreateButtonClick}
                                >
                                    <span style={{ textTransform: "none" }}>
                                        New Scene from Scratch
                                    </span>
                                </Button>
                            </span>
                            <span className={classes.emptyRoomButtonContainer}>
                                <Button
                                    startIcon={<AccountBalanceIcon />}
                                    className={classes.button}
                                    onClick={onTemplateButtonClick}
                                >
                                    <span style={{ textTransform: "none" }}>
                                        New Scene from Template
                                    </span>
                                </Button>
                            </span>
                        </div>
                        <TransitionCard
                            className={classes.introContainer}
                            scene={null}
                            handleEditClick={onConclusionEditClick}
                            isConclusion
                        />
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
            <HintsModal
                originalHints={editHintsInfo.hints ? editHintsInfo.hints : []}
                modalOpen={editHintsModalOpen}
                handleModalClose={onEditHintsModalClose}
                handleSubmit={onEditHintsModalSubmit}
            />
            <TemplateModal
                modalOpen={templateModalOpen}
                handleModalClose={onTemplateModalClose}
                handleSubmit={onTemplateModalSubmit}
            />
            <TransitionModal
                originalTransitions={editTransitionInfo}
                modalOpen={editTransitionModalOpen}
                handleModalClose={onTransitionModalClose}
                handleSubmit={onTransitionModalSubmit}
            />
            <ConclusionModal
                conclusionData={conclusionData}
                modalOpen={editConclusionModalOpen}
                handleModalClose={onConclusionModalClose}
                handleSubmit={onConclusionModalSubmit}
            />
            <DeleteModal
                open={deleteModalOpen}
                title="Delete Scene and Transition"
                confirmMessage={
                    "Are you sure you want to delete this scene?\nDeleting the scene will also delete the following transition."
                }
                handleClose={onDeleteModalCancel}
                handleSubmit={onDeleteModalSubmit}
            />
        </div>
    );
}
