import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import closeIcon from "../../../image/close-icon.svg";
import { useMutation, useQueryClient } from "react-query";
import { createRole } from "../../../api/role";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "696px",
    height: "350px",
    backgroundColor: "#FAFAFA",
  },
}));

export const CreateAdminRoleForm = ({ openDialog, handleCloseDialog }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(createRole, {
    onSuccess: () => {
      handleCloseDialog();
      queryClient.invalidateQueries("roles");
    },
  });

  const handleCreateRoleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const payload = {};
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      await mutate(payload);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  if (isLoading) return "Loading...";
  if (error) return "There was a problem creating role";

  return (
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
      <form onSubmit={handleCreateRoleSubmit}>
        <DialogTitle
          id="alert-dialog-title"
          position="relative"
          sx={{
            height: "80px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="body2"
            sx={{
              margin: "25px 0",
              padding: "8px",
            }}
          >
            Create New Role
          </Typography>
          <Box position="absolute" right="0" top="10px">
            <Button onClick={handleCloseDialog}>
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ margin: "50px 40px 0 40px" }}>
          <DialogContentText
            id="alert-dialog-description"
            variant="modalTitle"
            sx={{ color: "#0F7F90" }}
          >
            Role Name
          </DialogContentText>
          <TextField
            required
            margin="dense"
            name="name"
            type="text"
            sx={{ width: "100%", background: "#FFF" }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            height: "100px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="secondary"
            sx={{
              fontWeight: "700",
              height: "50px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            sx={{
              margin: "24px",
              textTransform: "none",
            }}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
