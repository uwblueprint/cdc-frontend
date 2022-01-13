import React, { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginTop: theme.spacing(0.5),
        width: "20px",
        height: "20px",
        background: "#B9BECE",
        borderRadius: "100%",
        color: "white",
        float: "right",
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

    return (
        <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>Modify Conclusion Data</DialogTitle>
            <DialogContent>
                <p>{headerText}</p>
                <p>{paragraphText}</p>
                <p>{shareLink}</p>
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
