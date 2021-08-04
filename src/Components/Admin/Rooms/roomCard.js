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

export default function RoomCard({ data, handleEditClick, handleDeleteClick }) {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHighlighted, setIsHighlighted] = React.useState(false);
    const imageHash = Date.now();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDoubleClick = () => {
        history.push(`/admin/environment/${data.id}`);
    };

    const handleCardClick = () => {
        setIsHighlighted(true);
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
                justify="center"
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
                        key={data.id}
                        className={
                            isHighlighted
                                ? classes.selectedCardImage
                                : classes.cardImage
                        }
                        src={
                            data.display_image_url
                                ? process.env.REACT_APP_ADMIN_ASSET_PREFIX +
                                  data.display_image_url +
                                  "?" +
                                  imageHash
                                : defaultImage
                        }
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
                        vertical: "center",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: -70,
                        horizontal: 150,
                    }}
                    MenuListProps={{ disablePadding: true }}
                    keepMounted
                    open={open}
                    onClose={handleMenuClose}
                    className={classes.menu}
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
