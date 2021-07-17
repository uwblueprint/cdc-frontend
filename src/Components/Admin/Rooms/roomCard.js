import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import defaultImage from "../common/defaultImage.png";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Divider } from "@material-ui/core";
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
        marginLeft: "6.2%",
        marginRight: "5.7%",
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
        marginLeft: "5.7%",
        marginRight: "5.7%",
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
        marginTop: 10,
        marginBottom: 10,
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
    },
}));

export default function RoomCard({ data, handleEditClick, handleDeleteClick }) {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHighlighted, setIsHighlighted] = React.useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    let timer = 0;
    let delay = 200;
    let prevent = false;

    const doCardDoubleClickAction = () => {
        history.push(`/admin/environment/${data.id}`);
    };

    const doCardClickAction = () => {
        setIsHighlighted(true);
        console.log("Click action");
    };

    const handleCardClick = () => {
        timer = setTimeout(function () {
            if (!prevent) {
                doCardClickAction();
            }
            prevent = false;
        }, delay);
    };

    const handleDoubleCardClick = () => {
        clearTimeout(timer);
        prevent = true;
        doCardDoubleClickAction();
    };

    const handleClickAway = () => {
        setIsHighlighted(false);
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
            >
                <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    justify="center"
                    onClick={doCardClickAction}
                    onDoubleClick={doCardDoubleClickAction}
                >
                    <img
                        className={
                            isHighlighted
                                ? classes.selectedCardImage
                                : classes.cardImage
                        }
                        src={data.image ? data.image : defaultImage}
                        alt="Escape Room"
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
                        vertical: "top",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    MenuListProps={{ disablePadding: true }}
                    keepMounted
                    open={open}
                    onClose={handleMenuClose}
                >
                    <MenuItem disabled className={classes.menuItem}>
                        Share & Publish
                    </MenuItem>
                    <MenuItem disabled className={classes.menuItem}>
                        View Game Stats
                    </MenuItem>
                    <Divider light />
                    <MenuItem disabled className={classes.menuItem}>
                        Copy Editor Link
                    </MenuItem>
                    <MenuItem disabled className={classes.menuItem}>
                        Duplicate
                    </MenuItem>
                    <MenuItem
                        className={classes.menuItem}
                        onClick={() => {
                            setAnchorEl(null);
                            handleEditClick(data.id);
                        }}
                    >
                        Rename
                    </MenuItem>
                    <MenuItem
                        className={classes.menuItemDelete}
                        onClick={() => {
                            setAnchorEl(null);
                            handleDeleteClick(data.id);
                        }}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            </Grid>
        </ClickAwayListener>
    );
}
