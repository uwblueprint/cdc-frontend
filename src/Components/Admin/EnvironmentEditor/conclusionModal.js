import React, { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

const useStyles = makeStyles(() => ({
    textField: {
        width: "500px",
    },
}));

export default function ConclusionModal({
    conclusionData,
    modalOpen,
    handleModalClose,
    handleSubmit,
}) {
    const classes = useStyles();
    const [headerText, setHeaderText] = useState(conclusionData.header_text);
    const [paragraphText, setParagraphText] = useState(
        conclusionData.paragraph_text
    );
    const [shareLink, setShareLink] = useState(conclusionData.share_link);
    const originalConclusionData = _.cloneDeep(conclusionData);

    const handleHeaderTextChange = (event) => {
        const response = event.target.value;
        setHeaderText(response);
    };

    const handleParagraphTextChange = (event) => {
        const response = event.target.value;
        setParagraphText(response);
    };

    const handleShareLinkChange = (event) => {
        const response = event.target.value;
        setShareLink(response);
    };

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>Modify Conclusion Data</DialogTitle>
            <DialogContent>
                <div style={{ paddingBottom: 15 }}>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                        }}
                    >
                        Header Text
                    </Typography>
                    <TextField
                        value={headerText}
                        className={classes.textField}
                        onChange={handleHeaderTextChange}
                        required
                        variant="outlined"
                        multiline
                        inputProps={{
                            style: {
                                padding: "0px 10px",
                            },
                        }}
                        placeholder="header-text"
                    />
                </div>
                <div style={{ paddingBottom: 15 }}>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                        }}
                    >
                        Paragraph Text
                    </Typography>
                    <TextField
                        value={paragraphText}
                        className={classes.textField}
                        onChange={handleParagraphTextChange}
                        required
                        variant="outlined"
                        multiline
                        inputProps={{
                            style: {
                                padding: "0px 10px",
                            },
                        }}
                        placeholder="header-text"
                    />
                </div>
                <div style={{ paddingBottom: 15 }}>
                    <Typography
                        style={{
                            fontSize: 20,
                            lineHeight: "27px",
                        }}
                    >
                        Share Link
                    </Typography>
                    <TextField
                        value={shareLink}
                        className={classes.textField}
                        onChange={handleShareLinkChange}
                        required
                        variant="outlined"
                        multiline
                        inputProps={{
                            style: {
                                padding: "0px 10px",
                            },
                        }}
                        placeholder="header-text"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setHeaderText(originalConclusionData.header_text);
                        setParagraphText(originalConclusionData.paragraph_text);
                        setShareLink(originalConclusionData.share_link);
                        handleModalClose();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={() =>
                        handleSubmit(headerText, paragraphText, shareLink)
                    }
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
