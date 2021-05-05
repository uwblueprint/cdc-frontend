import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import defaultImage from "./defaultImage.svg";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles(() => ({
    card: {
        fontSize: 16,
    },
    cardImage: {
        width: "90%",
        maxWidth: 400,
        marginTop: 16,
    },
}));

export default function ItemCard({
    data,
    cardType, // "environment", "scene", or "asset"
    handleEditClick,
    handleDeleteClick,
}) {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCardClick = () => {
        history.push(
            cardType === "environment"
                ? `/admin/environment/${data.id}`
                : `/admin/scene/${data.id}`
        );
    };

    const open = Boolean(anchorEl);

    return (
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
                onClick={handleCardClick}
            >
                <img
                    className={classes.cardImage}
                    src={data.image ? data.image : defaultImage}
                    alt={cardType === "environment" ? "Escape Room" : "Scene"}
                />
            </Grid>
            <Grid container item xs={12} alignItems="center" justify="center">
                <p>{data.name}</p>
                <IconButton onClick={handleMenuClick}>
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
                keepMounted
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleCardClick();
                    }}
                >
                    Edit {cardType === "environment" ? "room" : "scene"}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleEditClick(data.id);
                    }}
                >
                    Edit {cardType === "environment" ? "room" : "scene"}{" "}
                    metadata
                </MenuItem>
                <MenuItem>Copy game link</MenuItem>
                <MenuItem>View stats</MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleDeleteClick(data.id);
                    }}
                >
                    Delete {cardType === "environment" ? "room" : "scene"}
                </MenuItem>
            </Menu>
        </Grid>
    );
}
