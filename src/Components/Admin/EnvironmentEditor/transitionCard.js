import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TransitionCardImage from "../../Images/transition_card.png";
import IntroductionCardImage from "../../Images/introduction_card.png";
import ConclusionCardImage from "../../Images/conclusion_card.png";

const useStyles = makeStyles(() => ({
    transitionItem: {
        marginTop: "10px",
        flexDirection: "column",
        padding: 16,
        userSelect: "none",
        width: "175px",
        height: "120px",
        borderRadius: 20,
        backgroundImage: `url(${TransitionCardImage})`,
        backgroundSize: 205,
        cursor: "pointer",
    },
    transitionContainer: {
        display: "inline-flex",
        height: 332,
    },
    introductionItem: {
        margin: "auto",
        flexDirection: "column",
        padding: 16,
        userSelect: "none",
        width: "175px",
        height: "120px",
        borderRadius: 20,
        backgroundImage: `url(${IntroductionCardImage})`,
        backgroundSize: 205,
        cursor: "pointer",
    },
    conclusionItem: {
        margin: "auto",
        flexDirection: "column",
        padding: 16,
        userSelect: "none",
        width: "175px",
        height: "120px",
        borderRadius: 20,
        backgroundImage: `url(${ConclusionCardImage})`,
        backgroundSize: 205,
        cursor: "pointer",
    },
}));

export default function TransitionCard({
    scene,
    handleEditClick,
    isIntroduction,
    isConclusion,
}) {
    const classes = useStyles();

    return (
        <div
            className={
                isIntroduction
                    ? classes.introductionItem
                    : isConclusion
                    ? classes.conclusionItem
                    : classes.transitionItem
            }
            onClick={() => {
                isIntroduction
                    ? handleEditClick(-1)
                    : !isConclusion
                    ? handleEditClick(scene.id)
                    : handleEditClick();
            }}
        />
    );
}
