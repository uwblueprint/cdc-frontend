import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

export default function Home() {
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className="Home">
                <Typography component="h1" variant="h5">
                    Calgary Distress Centre
                </Typography>
            </div>
        </Container>
    );
}
