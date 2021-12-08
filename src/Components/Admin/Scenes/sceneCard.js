import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import defaultSceneImage from "../common/defaultSceneImage.jpeg";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Colours } from "../../../styles/Constants.ts";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles(() => ({
    card: {
        fontSize: 16,
    },
    cardImage: {
        width: "90%",
        height: "180px",
        maxWidth: 400,
        marginTop: 16,
        objectFit: "cover",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
    },
    selectedCardImage: {
        width: "90%",
        height: "180px",
        maxWidth: 400,
        marginTop: 16,
        objectFit: "cover",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        borderLeft: "solid",
        borderRight: "solid",
        borderTop: "solid",
        borderLeftWidth: "2px",
        borderRightWidth: "2px",
        borderTopWidth: "2px",
        borderLeftColor: Colours.MainRed5,
        borderRightColor: Colours.MainRed5,
        borderTopColor: Colours.MainRed5,
    },
    metadata: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 16,
        marginLeft: "6%",
        marginRight: "6%",
        marginTop: -4,
        backgroundColor: "white",
        height: 80,
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        border: "solid",
        borderWidth: "1px",
        borderColor: "#DEE2E6",
    },
    selectedMetadata: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 16,
        marginLeft: "6%",
        marginRight: "6%",
        marginTop: -4,
        backgroundColor: "white",
        height: 80,
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        borderLeft: "solid",
        borderRight: "solid",
        borderBottom: "solid",
        borderLeftWidth: "2px",
        borderRightWidth: "2px",
        borderBottomWidth: "2px",
        borderLeftColor: Colours.MainRed5,
        borderRightColor: Colours.MainRed5,
        borderBottomColor: Colours.MainRed5,
    },
    dataName: {
        lineHeight: "normal",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 10,
        fontWeight: "bold",
        maxWidth: "75%",
    },
    menuItem: {
        "&:hover": {
            background: Colours.MainRed1,
            color: Colours.MainRed8,
        },
        "&:onclick": {
            background: Colours.MainRed5,
            color: Colours.White,
        },
        fontSize: 15,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 8,
        paddingBottom: 8,
    },
    menuItemDelete: {
        "&:hover": {
            background: Colours.MainRed1,
            color: Colours.MainRed8,
        },
        "&:onclick": {
            background: Colours.MainRed5,
            color: Colours.White,
        },
        color: Colours.MainRed5,
        fontSize: 15,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 8,
        paddingBottom: 10,
    },
}));

export default function SceneCard({
    data,
    handleEditClick,
    handleDeleteClick,
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHighlighted, setIsHighlighted] = React.useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCardClick = () => {
        setIsHighlighted(true);
    };

    const handleClickAway = () => {
        setIsHighlighted(false);
    };

    const handleDoubleClick = () => {
        window.open(
            process.env.REACT_APP_ADMIN_BACKEND_URL + "/admin/scene/" + data.id
        );
    };

    const open = Boolean(anchorEl);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Grid
                container
                item
                xs={12}
                md={6}
                lg={4}
                spacing={1}
                alignItems="center"
                justify="flex-start"
                className={classes.card}
                onClick={handleCardClick}
                onDoubleClick={handleDoubleClick}
            >
                <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    justify="center"
                >
                    <img
                        className={
                            isHighlighted
                                ? classes.selectedCardImage
                                : classes.cardImage
                        }
                        src={
                            data.screenshot_url
                                ? data.screenshot_url
                                : defaultSceneImage
                        }
                        alt="Scene"
                    />
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    className={
                        isHighlighted
                            ? classes.selectedMetadata
                            : classes.metadata
                    }
                >
                    <p className={classes.dataName}>{data.name}</p>
                    <IconButton
                        onClick={handleMenuClick}
                        style={{ maxWidth: "20%" }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: 0,
                        horizontal: 150,
                    }}
                    MenuListProps={{ disablePadding: true }}
                    keepMounted
                    open={open}
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => {
                            setAnchorEl(null);
                            handleDoubleClick();
                        }}
                    >
                        Open Inspector
                    </MenuItem>
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => {
                            setAnchorEl(null);
                            handleEditClick(data.id);
                        }}
                        disabled
                    >
                        Edit Metadata
                    </MenuItem>
                    <MenuItem disabled className={classes.menuItem}>
                        Copy Game Link
                    </MenuItem>
                    <MenuItem disabled className={classes.menuItem}>
                        View Stats
                    </MenuItem>
                    <MenuItem
                        className={classes.menuItemDelete}
                        onClick={() => {
                            setAnchorEl(null);
                            handleDeleteClick(data.id);
                        }}
                        disabled
                    >
                        Delete Scene
                    </MenuItem>
                </Menu>
            </Grid>
        </ClickAwayListener>
    );
}
