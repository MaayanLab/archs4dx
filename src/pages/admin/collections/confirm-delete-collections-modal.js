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
import { styled } from "@mui/system";
import { deleteCollection, getCollections } from "../../../api/collection";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "696px",
    backgroundColor: "#FAFAFA",
  },
}));

export const ConfirmDeleteAdminCollectionsModal = ({
  open,
  onClose,
  selectionModel,
}) => {
  const { data: collections } = useQuery(["collection"], () =>
    getCollections()
  );
  const selectedCollections = collections?.filter((collectionEntry) =>
    selectionModel?.includes(collectionEntry.id)
  );

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation(deleteCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
      onClose();
      navigate("/admin/collections");
    },
  });

  const handleDelete = () => {
    for (const collectionId of selectionModel) {
      mutate(collectionId);
    }
  };

  if (isLoading) return "Loading...";
  if (error) return "There was a problem deleting the collection...";

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
            Confirm and Delete
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
            Collections will be deleted. This action cannot be undone.
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
                Collections
              </Typography>
              <Typography>{selectionModel?.length}</Typography>
            </Grid>

            {selectedCollections?.map(({ name }, i) => (
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
          sx={{
            justifyContent: "right",
            margin: "10px 40px 40px 40px",
            borderTop: "1px solid #B0C9CB",
            padding: "16px 8px 8px 8px",
          }}
        >
          <Button onClick={onClose} sx={{ marginRight: "13px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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
