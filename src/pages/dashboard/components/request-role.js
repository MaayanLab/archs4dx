import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import closeIcon from "../../../image/close-icon.svg";
import data from "../../../data/config.json";

export const RequestRole = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        position="relative"
        textAlign="center"
        sx={{ padding: "40px 0" }}
      >
        <Typography id="modal-modal-title" variant="subtitle3">
          Request Data Access
        </Typography>
        <Box position="absolute" right="0" top="10px">
          <Button onClick={onClose}>
            <img src={closeIcon} alt="close icon" />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          variant="body4"
          textAlign="center"
          color="#005163"
          margin="0 20px 40px 20px"
        >
          {data.request_data.instructions}
        </DialogContentText>
        <DialogContentText
          id="alert-dialog-description"
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#005163",
            textAlign: "center",
          }}
        >
          Contact E-mail:
        </DialogContentText>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            fontSize: "24px",
            fontWeight: "400",
            color: " #0F7F90",
            margin: "0 auto 10px auto",
            textAlign: "center",
          }}
        >
          {data.request_data.contact.email}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", marginBottom: "40px" }}>
        <Button
          variant="primary"
          sx={{
            width: "auto",
            padding: "16px 32px",
            textTransform: "capitalize",
          }}
          onClick={() =>
            navigator.clipboard.writeText(data.request_data.contact.email)
          }
        >
          Copy email addres
        </Button>
      </DialogActions>
    </Dialog>
  );
};
