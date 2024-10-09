import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import createIcon from "../../../image/create-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import { useState } from "react";
import { createCollection } from "../../../api/collection";
import { useMutation, useQueryClient } from "react-query";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "696px",
    backgroundColor: "#FAFAFA",
  },
}));

export const CreateBasicCollection = ({ selectionModel, onCreate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
      queryClient.invalidateQueries(["userCollections"]);
      setOpenDialog(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const payload = {};
      payload.description = "";
      payload.files = selectionModel;
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      await mutateAsync(payload);
      onCreate();
    } catch (e) {
      console.error(e);
      return;
    }
  };
  if (isLoading) return "Loading...";
  if (error) return "There was a problem creating collection";
  return (
    <Box>
      <Button
        onClick={handleClickOpenDialog}
        sx={{ margin: "10px auto 10px auto" }}
      >
        <img
          src={createIcon}
          alt="Create icon"
          style={{ marginRight: "8px" }}
        />{" "}
        Create Collection
      </Button>

      <CustomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        sx={{
          background:
            "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            id="alert-dialog-title"
            position="relative"
            sx={{ padding: "32px 0", textAlign: "center" }}
          >
            <Typography id="modal-modal-title" variant="subtitle3">
              Create New Collection
            </Typography>
            <Box position="absolute" right="0" top="10px">
              <Button onClick={handleCloseDialog}>
                <img src={closeIcon} alt="close icon" />
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ margin: "auto 40px" }}>
            <DialogContentText
              id="alert-dialog-description"
              fontSize="16px"
              fontWeight="500"
              color="#005163"
            >
              Collection Name
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              type="text"
              fullWidth
              required
            />
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "center", margin: "10px 0 40px 0" }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="secondary"
              sx={{
                fontWeight: "700",
                height: "53px",
                width: "auto",
                padding: "16px 32px",
                background:
                  "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              sx={{
                width: "auto",
                padding: "16px 32px",
                textTransform: "none",
                "&:hover": {
                  boxShadow: "0px 4px 9px rgba(119, 119, 119, 0.50)",
                },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </CustomDialog>
    </Box>
  );
};
