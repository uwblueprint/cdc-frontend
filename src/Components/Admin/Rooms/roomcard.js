import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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

export default function RoomCard({ key, data }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
            key={key}
        >
            <Grid container item xs={12} alignItems="center" justify="center">
                <img
                    className={classes.cardImage}
                    src={data.image ? data.image : defaultImage}
                    alt="Escape Room"
                />
            </Grid>
            <Grid
                container
                item
                xs={12}
                alignItems="space-between"
                justify="center"
            >
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
                    }}
                >
                    Edit room metadata
                </MenuItem>
                <MenuItem>Copy game link</MenuItem>
                <MenuItem>View stats</MenuItem>
                <MenuItem>Delete room</MenuItem>
            </Menu>
        </Grid>
    );
}
