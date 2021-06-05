import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import defaultImage from "../common/defaultImage.png";
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
    metadata: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "5.7%",
        marginRight: "5.7%",
        marginTop: -4,
        backgroundColor: "white",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
    },
    dataName: {
        marginLeft: 10,
        fontWeight: "bold",
    },
}));

export default function SceneCard({
    data,
    handleEditClick,
    handleDeleteClick,
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCardClick = () => {
        window.open(
            process.env.REACT_APP_ADMIN_BACKEND_URL + "/admin/scene/" + data.id
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
                    alt="Scene"
                />
            </Grid>
            <Grid
                container
                item
                xs={12}
                alignItems="center"
                className={classes.metadata}
            >
                <p className={classes.dataName}>{data.name}</p>
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
                    Open Inspector
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleEditClick(data.id);
                    }}
                >
                    Edit scene metadata
                </MenuItem>
                <MenuItem>Copy game link</MenuItem>
                <MenuItem>View stats</MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleDeleteClick(data.id);
                    }}
                >
                    Delete scene
                </MenuItem>
            </Menu>
        </Grid>
    );
}
