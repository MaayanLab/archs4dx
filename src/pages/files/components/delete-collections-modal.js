import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

import confirmIcon from "../../../image/confirm-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import "./delete-account.css";
import { styled } from "@mui/system";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "696px",
    backgroundColor: "#FAFAFA",
  },
}));

export const DeleteCollectionsModal = ({
  open,
  onClose,
  onConfirm,
  collectionsNameArray,
  collectionsToRemove,
}) => {
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
            Confirm Changes
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
            margin="0 40px 20px 40px"
          >
            The files belonged to this collection will be moved to your “My
            Files”.
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              color: " #0F7F90",
              margin: "0 auto 10px auto",
              padding: "0 25px",
              textAlign: "center",
            }}
          >
            Are you sure you want to continue and delete the collections?
          </DialogContentText>
          <DialogContentText
            sx={{
              margin: "auto 60px",
              padding: "24px",
              backgroundColor: "#fff",
              maxHeight: "340px",
              overflow: "auto",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              sx={{
                margin: "0 0 12px 0",
              }}
            >
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Internal Collections
              </Typography>
              <Typography>{collectionsToRemove?.length}</Typography>
            </Grid>

            {collectionsNameArray?.map(({ name }, i) => (
              <Typography
                key={i}
                variant="modalTitle"
                sx={{ display: "block", color: "#003541" }}
              >
                {name}
              </Typography>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "right", margin: "10px 40px 40px 0" }}
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
