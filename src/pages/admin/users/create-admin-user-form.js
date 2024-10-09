import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import closeIcon from "../../../image/close-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { useQuery } from "react-query";
import { useState } from "react";
import deleteIcon from "../../../image/delete-red-icon.svg";
import { getRole } from "../../../api/role";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "576px",
    height: "100vh",
    maxHeight: "100vh",
    position: "absolute",
    right: "0",
    margin: "0",
    backgroundColor: "#FAFAFA",
  },
}));

export const CreateAdminUserForm = ({
  handleSubmit,
  openDialog,
  handleCloseDialog,
  rolesToAdd,
  removeRolesFromUsers,
  addRolesToUsers,
}) => {
  const [selectedRolesToAdd, setSelectedRolesToAdd] = useState(null);

  const handleAddRoles = () => {
    addRolesToUsers({
      id: selectedRolesToAdd.id,
      name: selectedRolesToAdd.label,
    });
    setSelectedRolesToAdd(null);
  };

  const { data: allRoles = [] } = useQuery(["roles"], () => getRole());

  const stagedRoles = [...rolesToAdd];
  const stagedRolesIds = stagedRoles.map(({ id }) => id);
  const filteredAllInternalRoles = allRoles?.roles?.filter(
    ({ id }) => !stagedRolesIds.includes(id)
  );

  const rolesOptions =
    filteredAllInternalRoles?.map((entry) => ({
      label: entry.name ? entry.name : "Missing name",
      id: entry.id,
    })) ?? [];

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
      <form onSubmit={handleSubmit}>
        <DialogTitle
          id="alert-dialog-title"
          position="relative"
          sx={{
            height: "80px",
            background:
              "linear-gradient(75.61deg, rgba(244, 144, 77, 0.4) 3.76%, rgba(243, 139, 151, 0.4) 51.01%, rgba(15, 127, 144, 0.4) 98.26%)",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="body2"
            sx={{
              padding: "8px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            Create New User
          </Typography>
          <Box position="absolute" right="0" top="10px">
            <Button onClick={handleCloseDialog}>
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ height: "calc(100vh - 180px)" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              First Name
            </DialogContentText>
            <TextField
              required
              margin="dense"
              id="first_name"
              name="first_name"
              type="text"
            />
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Last Name
            </DialogContentText>
            <TextField
              required
              margin="dense"
              id="last_name"
              name="last_name"
              type="text"
            />
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Email
            </DialogContentText>
            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              type="text"
            />
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Affiliation
            </DialogContentText>
            <TextField
              margin="dense"
              id="affiliation"
              name="affiliation"
              type="text"
            />
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              ORCID iD
            </DialogContentText>
            <TextField
              margin="dense"
              id="orcid_id"
              name="orcid_id"
              type="text"
            />
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              margin: "24px 0",
            }}
          >
            <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
              Roles:{" "}
            </Typography>
            <Typography>{stagedRoles?.length}</Typography>
            {stagedRoles.map(({ id, name }, i) => (
              <Grid
                key={i}
                sx={{
                  width: "100%",
                  margin: "10px 5px",
                  display: "flex",
                }}
              >
                <Typography sx={{ margin: "4px 0" }}>
                  {name ? name : "Missing name"}
                </Typography>
                <Button
                  onClick={() => removeRolesFromUsers(id)}
                  sx={{
                    padding: "0",
                    minWidth: "35px",
                  }}
                >
                  <img src={deleteIcon} alt="delete icon" />
                </Button>
              </Grid>
            ))}
            <Grid container sx={{ margin: "15px auto" }}>
              <Autocomplete
                disablePortal
                value={selectedRolesToAdd}
                onChange={(_e, selectedOption) =>
                  setSelectedRolesToAdd(selectedOption)
                }
                options={rolesOptions}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                onClick={handleAddRoles}
                disabled={selectedRolesToAdd === null}
                type="button"
                sx={{
                  outline: "4px solid rgba(176, 201, 203, 1)",
                  padding: "6px 14px 6px 10px",
                  height: "38px",
                }}
              >
                <img
                  src={saveIcon}
                  alt="close icon"
                  style={{ margin: "0 9px 0 0" }}
                />
                Add Role
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            height: "100px",
            justifyContent: "left",
            borderTop: "1px solid #B0C9CB ",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              fontWeight: "700",
              height: "53px",
              width: "auto",
              padding: "16px 32px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              outline: "4px solid rgba(176, 201, 203, 1)",
              margin: "24px",
            }}
          >
            <img
              src={saveIcon}
              alt="close icon"
              style={{ margin: "0 9px 0 0" }}
            />
            Save
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
