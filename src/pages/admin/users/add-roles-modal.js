import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import confirmIcon from "../../../image/confirm-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import { styled } from "@mui/system";
import { useQuery, useQueryClient } from "react-query";
import { getUser, updateUser } from "../../../api/user";
import checkIcon from "../../../image/check-black-icon.svg";
import createIcon from "../../../image/create-orange-icon.svg";
import { useEffect, useMemo, useState } from "react";
import { getRole } from "../../../api/role";
import { CreateAdminRoleForm } from "./create-admin-roles-form";
import { useNavigate } from "react-router-dom";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "926px",
    backgroundColor: "#FAFAFA",
  },
}));

const ListChipItem = styled("li")(({ theme }) => ({
  margin: "5px 2px",
  listStyle: "none",
  display: "inline-flex",
  "& div": {
    background: "#EFF4F5",
    color: "rgba(0, 81, 99, 1)",
    fontSize: "13px",
    fontWeight: "400",
    "& svg": {
      fill: "rgba(176, 201, 203, 1)",
    },
  },
}));

export const AddRolesModal = ({ open, onClose, ids = [] }) => {
  // form state is an array that keeps the state of each selected user form
  const [formState, setFormState] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const { data: allUsers } = useQuery(["users"], () => getUser(), {
    enabled: open,
  });

  const filteredUsers = useMemo(() => {
    if (open && ids.length > 0 && allUsers?.users) {
      return allUsers.users.filter((user) => ids.includes(user?.id));
    }
    return [];
  }, [open, ids, allUsers]);

  const { data: allRoles = { roles: [] } } = useQuery(["roles"], () =>
    getRole()
  );

  // if filteredUsers changes, recalculate initial state
  useEffect(() => {
    // the form state is an array of roles, matches filtered users
    setFormState(
      filteredUsers.map(({ roles = [], name, id, email }) => ({
        autoCompleteValue: null,
        // map the role object to an array of role ids
        roles: roles.map(({ id }) => id),
        name,
        id,
        email,
      }))
    );
  }, [filteredUsers]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const { id, roles } of formState) {
        await updateUser({ id, overwrite: true, roles });
      }
      queryClient.invalidateQueries(["users"]);
      onClose();
      navigate("/admin/users");
    } catch (e) {
      console.log(e);
    }
  };

  // set the autocomplete value for each autocomplete
  const handleSelectAutocompleteValue = (_e, selectedOption, i) => {
    setFormState((prevState) =>
      prevState.map((entry, j) =>
        i === j ? { ...entry, autoCompleteValue: selectedOption } : entry
      )
    );
  };

  // map allRoles to autoComplete options
  const rolesOptions =
    allRoles?.roles?.map((entry) => ({
      label: entry?.name ?? "Missing name",
      id: entry?.id,
    })) ?? [];

  const handleAddRole = (id) => {
    // when the user presses add role, take the autcomplete value and add it to the array of roles of the given user
    // reset the autocomplete value to null
    setFormState((prevState) =>
      prevState.map((entry, i) =>
        id === i
          ? {
              ...entry,
              autoCompleteValue: null,
              roles: [...entry.roles, entry.autoCompleteValue.id],
            }
          : entry
      )
    );
  };

  // when the user clicks remove role, filter the role id from the array of roles
  const handleDeleteRole = (index, roleId) => {
    setFormState((prevState) =>
      prevState.map((entry, i) =>
        i === index
          ? {
              ...entry,
              roles: entry.roles.filter((id) => id !== roleId),
            }
          : entry
      )
    );
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="926px"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          id="alert-dialog-title"
          position="relative"
          textAlign="center"
          sx={{ padding: "40px 0 10px 0" }}
        >
          <Typography id="modal-modal-title" variant="subtitle3">
            Select Roles
          </Typography>
          <Box position="absolute" right="0" top="10px">
            <Button onClick={onClose}>
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: "0" }}>
          <DialogContentText
            id="alert-dialog-description"
            fontSize="16px"
            fontWeight="500"
            textAlign="center"
            color="#003541"
            margin="20px 40px 5px 40px"
          >
            Select the roles that you would like to add these users:
          </DialogContentText>
          <Box sx={{ margin: "0 60px" }}>
            {formState?.map((user, i) => (
              <Box
                key={user.id}
                sx={{
                  padding: "35px",
                  background: "#FFF",
                  borderBottom: "2px solid #0000001f",
                }}
              >
                <Grid container justifyContent="space-between">
                  <Grid item xs={6}>
                    {" "}
                    <Typography variant="body1" sx={{ display: "flex" }}>
                      <img
                        src={checkIcon}
                        alt="check icon"
                        style={{ marginRight: "5px" }}
                      />{" "}
                      {user.name}
                    </Typography>
                    <Typography
                      sx={{
                        background:
                          "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        textDecoration: "none",
                        width: "fit-content",
                        marginLeft: "24px",
                      }}
                    >
                      {user.email}
                    </Typography>
                    <Box sx={{ marginLeft: "15px" }}>
                      {" "}
                      {user.roles.map((id, j) => (
                        <ListChipItem key={j}>
                          <Chip
                            label={
                              allRoles.roles.find((entry) => entry.id === id)
                                .name
                            }
                            onDelete={() => handleDeleteRole(i, id)}
                          />
                        </ListChipItem>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ justifyContent: "flex-end" }}>
                    <Grid container sx={{ margin: "5px auto" }}>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={7}>
                        {" "}
                        <Autocomplete
                          disablePortal
                          value={user.autoCompleteValue}
                          onChange={(_e, newValue) =>
                            handleSelectAutocompleteValue(_e, newValue, i)
                          }
                          options={rolesOptions.filter(
                            ({ id }) => !user.roles.includes(id)
                          )}
                          sx={{ width: 182 }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          onClick={() => handleAddRole(i)}
                          disabled={user.autoCompleteValue === null}
                          type="button"
                          sx={{
                            outline: "4px solid rgba(176, 201, 203, 1)",
                            padding: "6px 10px",
                            margin: "0",
                            height: "38px",
                          }}
                        >
                          Add Role
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
          <Box
            sx={{ background: "#FFF", margin: "26px 60px", display: "flex" }}
          >
            <Button
              onClick={handleClickOpenDialog}
              sx={{ margin: "20px auto" }}
            >
              <img
                src={createIcon}
                alt="create icon"
                style={{ margin: "0 5px 0 0" }}
              />{" "}
              Create New Role
            </Button>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "right",
            margin: "10px 40px",
            padding: "20px",
            borderTop: "1px solid #B0C9CB",
          }}
        >
          <Button
            onClick={() => {
              onClose();
              handleCloseDialog();
            }}
            sx={{ marginRight: "13px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
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
      </form>
      <CreateAdminRoleForm
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </CustomDialog>
  );
};
