import {
  Autocomplete,
  Box,
  Button,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import "./edit-user-form.css";
import { useState } from "react";
import { useQuery } from "react-query";
import deleteIcon from "../../../image/delete-red-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { getRole } from "../../../api/role";

export const EditUserForm = ({
  isEdit,
  user,
  rolesToAdd,
  rolesToRemove,
  removeRolesFromUsers,
  addRolesToUsers,
  userFiles,
  userCollections,
}) => {
  const [selectedRolesToAdd, setSelectedRolesToAdd] = useState(null);
  const [emailValue, setEmailValue] = useState(user.email || "");
  const [hasChanged, setHasChanged] = useState(false);
  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
    setHasChanged(true);
  };
  const handleAddPolicies = () => {
    addRolesToUsers({
      id: selectedRolesToAdd.id,
      name: selectedRolesToAdd.label,
    });
    setSelectedRolesToAdd(null);
  };

  const { data: allRoles = [] } = useQuery(["roles"], () => getRole());

  const filteredRoles =
    user?.roles?.filter(({ id }) => !rolesToRemove.includes(id)) ?? [];
  const stagedRoles = [...filteredRoles, ...rolesToAdd];
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
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ID:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {user.id ? user.id : ""}
        </Typography>
      </Grid>

      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          First Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="first_name"
            defaultValue={user.first_name ? user.first_name : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {user.first_name ? user.first_name : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Last Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="last_name"
            defaultValue={user.last_name ? user.last_name : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {user.last_name ? user.last_name : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Email:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="email"
            defaultValue={emailValue}
            onChange={handleEmailChange}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {user.email || ""}
          </Typography>
        )}
      </Grid>
      {hasChanged && isEdit && (
        <Typography sx={{ color: "#D32F2F" }}>
          *Your previous email address will be deleted. Check your new email
          address twice. In case it’s wrong you will lost access with oauth.
        </Typography>
      )}
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Affiliation:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="affiliation"
            defaultValue={user.affiliation ? user.affiliation : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {user.affiliation ? user.affiliation : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ORCID iD:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="orcid_id"
            defaultValue={user.orcid_id ? user.orcid_id : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {user.orcid_id ? user.orcid_id : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Creation Date:{" "}
        </Typography>
        <Typography sx={{ overflowWrap: "break-word" }}>
          {" "}
          {user.creation_date ? user.creation_date : ""}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          UUID:{" "}
        </Typography>
        <Typography sx={{ overflowWrap: "break-word" }}>
          {" "}
          {user.uuid ? user.uuid : ""}
        </Typography>
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
          <Box
            key={i}
            sx={{
              display: "block",
              width: "100%",
              margin: "10px 5px",
              position: "relative",
            }}
          >
            <Typography>
              {name ? name : "Missing name"}{" "}
              {isEdit && (
                <Button
                  onClick={() => removeRolesFromUsers(id)}
                  sx={{
                    padding: "0",
                    minWidth: "35px",
                  }}
                >
                  <img src={deleteIcon} alt="delete icon" />
                </Button>
              )}
            </Typography>
          </Box>
        ))}
        {isEdit && (
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
              onClick={handleAddPolicies}
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
        )}
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          margin: "24px 0",
        }}
      >
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Collections:{" "}
        </Typography>
        <Typography>
          {(Array.isArray(userCollections?.collections) &&
            userCollections?.collections.length) ||
            (userCollections?.name && "1") ||
            "0"}
        </Typography>
        {Array.isArray(userCollections?.collections) ? (
          userCollections?.collections?.slice(0, 10).map(({ name }, i) => (
            <Box
              key={i}
              sx={{
                display: "block",
                width: "100%",
                margin: "10px 5px",
                position: "relative",
              }}
            >
              <Typography>{name ? name : "Missing name"} </Typography>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: "block",
              width: "100%",
              margin: "10px 5px",
              position: "relative",
            }}
          >
            <Typography>
              {userCollections?.name ? userCollections?.name : ""}{" "}
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          margin: "24px 0",
        }}
      >
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Files:{" "}
        </Typography>
        <Typography>{userFiles?.total}</Typography>
        {userFiles?.files?.slice(0, 50).map(({ name }, i) => (
          <Box
            key={i}
            sx={{
              display: "block",
              width: "100%",
              margin: "10px 5px",
              position: "relative",
            }}
          >
            <Typography>{name ? name : "Missing name"} </Typography>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
