import { Box, Button, Modal, Typography } from "@mui/material";
import closeIcon from "../../../image/close-icon.svg";
import copyIcon from "../../../image/copy-link-icon.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  bgcolor: "#FAFAFA",
  transform: "translate(-50%, -50%)",
  width: "696px",
  boxShadow: 24,
  p: 4,
};

export const CopyLinkCollectionModal = ({ isOpen, onClose, collectionId }) => {
  const url = `${window.location.hostname}/collection/${collectionId}`;
  const onCopyCollectionLink = async () => {
    navigator.clipboard.writeText(url);
    onClose();
  };
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="TermsModal"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="subtitle4"
          sx={{
            display: "block",
            textAlign: "center",
            position: "relative",
            color: "#003541",
            padding: "0 25px",
          }}
        >
          <Button
            sx={{ position: "absolute", right: "-24px", top: "-18px" }}
            onClick={() => {
              onClose(true);
            }}
          >
            <img src={closeIcon} alt="close icon" />
          </Button>
          Collection Link
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#0F7F90", margin: "25px auto" }}
        >
          {url}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "40px auto",
          }}
        >
          <Button
            onClick={() => onCopyCollectionLink()}
            variant="primary"
            sx={{
              width: "auto",
              padding: "16px 32px",
              textTransform: "none",
            }}
          >
            <img
              src={copyIcon}
              alt="Resquest role icone"
              style={{ margin: "0 8px 0 0" }}
            />
            Copy Collection Link
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
