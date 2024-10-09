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
import { useMutation } from "react-query";
import { deleteUser } from "../../../api/user";
import deleteIcon from "../../../image/delete-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import "./delete-account.css";
import { useNavigate } from "react-router-dom";

export const DeleteAccount = ({ open, onClose, data }) => {
  let navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation(deleteUser, {
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = () => {
    mutate(data.id);
  };

  if (isLoading) return "Loading...";
  if (error) return "There was a problem deleting this account";

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
          Delete Account
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
          color="#005163"
          margin="0 40px 20px 40px"
        >
          Deleting your account you will{" "}
          <span className="textRed">
            lost access to the platform. All the files you have ownership will
            be deleted too.
          </span>{" "}
          This account could not be restored again.
        </DialogContentText>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            fontSize: "20px",
            fontWeight: "500",
            color: " #0F7F90",
            margin: "0 auto 10px auto",
            textAlign: "center",
          }}
        >
          Are you sure you want to delete this account?
        </DialogContentText>
        <DialogContentText
          sx={{ margin: "auto 60px", backgroundColor: "#fff" }}
        >
          <Box padding="24px">
            <Grid container justifyContent="space-between" margin="12px 0">
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Name:{" "}
              </Typography>

              <Typography>{data.first_name}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" margin="12px 0">
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Last Name:{" "}
              </Typography>

              <Typography>{data.last_name}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" margin="12px 0">
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Email:{" "}
              </Typography>

              <Typography>{data.email}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" margin="12px 0">
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Institution:{" "}
              </Typography>

              <Typography>{data.affiliation}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" margin="12px 0">
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Creation date:{" "}
              </Typography>
              <Typography>{data.creation_date}</Typography>
            </Grid>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "right", margin: "10px 40px 40px 0" }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            width: "auto",
            padding: "16px 32px",
            textTransform: "capitalize",
            background: "rgba(211, 47, 47, 1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            "&:hover": {
              background: "rgba(211, 47, 47, 1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            },
          }}
        >
          <img
            src={deleteIcon}
            alt="Resquest role icone"
            style={{ margin: "0 8px 0 0" }}
          />
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};
