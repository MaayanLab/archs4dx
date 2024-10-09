import { Box, Button, Grid, OutlinedInput, Typography } from "@mui/material";
import "./edit-profile-form.css";
import { useState } from "react";
import requestIcon from "../../../image/request-orange.svg";
import deleteIcon from "../../../image/delete-icon.svg";
import { RequestRole } from "./request-role";
import { DeleteAccount } from "./delete-account";

export const EditProfileForm = ({ isEdit, data, isLoading, error }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDeleteAccount] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenDeleteAccount = () => {
    setOpenDeleteAccount(true);
  };

  const handleCloseDeleteAccount = () => {
    setOpenDeleteAccount(false);
  };

  return (
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      {error && "there was an error updating the user"}
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="first_name"
            defaultValue={data.first_name}
            disabled={isLoading}
          />
        ) : (
          <Typography>{data.first_name}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Last Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="last_name"
            defaultValue={data.last_name}
            disabled={isLoading}
          />
        ) : (
          <Typography>{data.last_name}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Email:{" "}
        </Typography>
        <Typography>{data.email}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Institution:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="affiliation"
            defaultValue={data.affiliation}
            disabled={isLoading}
          />
        ) : (
          <Typography>{data.affiliation}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Creation date:{" "}
        </Typography>
        <Typography>{data.creation_date}</Typography>
      </Grid>
      <Button
        onClick={handleClickOpenDialog}
        variant="secondary"
        sx={{
          width: "90%",
          outline: "0px",
          borderRadius: "0px",
          padding: "20px",
          fontSize: "15px",
          fontWeight: "700",
          textTransform: "capitalize",
          margin: "24px auto 12px auto",
          display: "flex",
        }}
      >
        <img
          src={requestIcon}
          alt="Resquest role icone"
          style={{ margin: "0 8px 0 0" }}
        />
        Request Contributor Role
      </Button>
      <Button
        onClick={handleClickOpenDeleteAccount}
        variant="secondary"
        sx={{
          display: "flex",
          width: "90%",
          outline: "0px",
          borderRadius: "0px",
          padding: "20px",
          fontSize: "15px",
          fontWeight: "700",
          textTransform: "capitalize",
          margin: "12px auto",
          color: "rgba(211, 47, 47, 1)",
        }}
      >
        <img
          src={deleteIcon}
          alt="Resquest role icone"
          style={{ margin: "0 8px 0 0" }}
        />
        Delete Account
      </Button>
      <RequestRole open={openDialog} onClose={handleCloseDialog} />
      <DeleteAccount
        open={openDelete}
        onClose={handleCloseDeleteAccount}
        data={data}
      />
    </Box>
  );
};
