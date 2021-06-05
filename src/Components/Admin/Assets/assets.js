import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AssetCard from "./assetCard.js";

const useStyles = makeStyles((theme) => ({
    page: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function Assets({ assets }) {
    const classes = useStyles();

    return (
        <Container component={"main"} maxWidth="lg">
            <CssBaseline />
            <div className={classes.page}>
                <Typography component="div" variant="h5">
                    Assets Page
                </Typography>
                <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    alignItems="center"
                    justify="flex-start"
                >
                    {assets.map(function (assets) {
                        return (
                            <AssetCard
                                key={assets.id}
                                data={assets}
                                handleEditClick={() => {}}
                                handleDeleteClick={() => {}}
                            />
                        );
                    })}
                </Grid>
            </div>
        </Container>
    );
}
