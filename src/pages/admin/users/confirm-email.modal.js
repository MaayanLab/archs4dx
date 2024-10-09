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
import confirmIcon from "../../../image/confirm-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import { styled } from "@mui/system";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "696px",
    backgroundColor: "#FAFAFA",
  },
}));

export const ConfirmEmailModal = ({ open, onClose, onConfirm, email }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      width="696px"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <>
        <DialogTitle
          id="alert-dialog-title"
          position="relative"
          textAlign="center"
          sx={{ padding: "40px 0" }}
        >
          <Typography id="modal-modal-title" variant="subtitle3">
            Confirm your new address email
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
            fontSize="16px"
            fontWeight="500"
            textAlign="center"
            color="#003541"
            margin="0 40px 5px 40px"
          >
            Your previous email address will be deleted. Check your new email
            address twice. In case it’s wrong you will lost access with oauth.
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              color: " #0F7F90",
              margin: "25px auto 10px auto",
              padding: "0 25px",
              textAlign: "center",
            }}
          >
            {email}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "right",
            margin: "10px 40px",
            padding: "20px",
            borderTop: "1px solid #B0C9CB",
          }}
        >
          <Button onClick={onClose} sx={{ marginRight: "13px" }}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm()}
            variant="contained"
            sx={{
              width: "auto",
              padding: "16px 32px",
              textTransform: "capitalize",
              background:
                "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
              outline: "4px solid #B0C9CB",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textFillColor: "transparent",
              },
            }}
          >
            <img
              src={confirmIcon}
              alt="Resquest role icone"
              style={{ margin: "0 8px 0 0" }}
            />
            Yes, confirm
          </Button>
        </DialogActions>
      </>
    </CustomDialog>
  );
};
