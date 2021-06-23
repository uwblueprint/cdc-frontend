import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles(() => ({
    transitionItem: {
        display: "inline-flex",
        flexDirection: "column",
        backgroundColor: "#E2E5ED",
        padding: 16,
        userSelect: "none",
        margin: "0 25px 0 0",
        verticalAlign: "center",
        width: "150px",
        height: "150px",
    },
    transitionTopRow: {
        display: "flex",
        width: "100%",
        height: "100px",
        justifyContent: "center",
        marginTop: 65,
    },
    transitionBottomRow: {
        alignSelf: "flex-end",
    },
}));

export default function TransitionCard({
    scene,
    handleEditClick,
    isIntroduction,
    isConclusion,
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.transitionItem}>
            <div className={classes.transitionTopRow}>
                {isIntroduction
                    ? "Introduction"
                    : isConclusion
                    ? "Conclusion"
                    : "Transition"}
            </div>
            <div className={classes.transitionBottomRow}>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
            </div>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                keepMounted
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        isIntroduction
                            ? handleEditClick(-1)
                            : handleEditClick(scene.id);
                    }}
                >
                    Edit Transitions
                </MenuItem>
            </Menu>
        </div>
    );
}
