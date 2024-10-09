import { useReducer, useState } from "react";
import { Button, Container, Grid, Menu, MenuItem } from "@mui/material";
import separatorIcon from "../../../image/separator.svg";
import moreIcon from "../../../image/more-icon.svg";
import buttons from "../../../data/main-buttons-admin-roles.json";
import { useMutation, useQueryClient } from "react-query";
import { useFilterContext } from "../filter-context";
import { CreateAdminRoleForm } from "./create-admin-roles-form";
import { EditAdminRoleModal } from "./edit-role-modal";
import { ConfirmDeleteAdminRoles } from "./confirm-delete-roles-modal";
import { createRole } from "../../../api/role";
import { useLocation } from "react-router-dom";

export const MainButtons = ({
  sidebarOpen,
  toggleSidebar,
  selectionModel,
  setSelectionModel,
  user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMoreMenuOpen = !!anchorEl;
  const openMoreMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMoreMenu = () => setAnchorEl(null);
  const [openConfirmDeleteRoles, setOpenConfirmDeleteRoles] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [policiesToRemove, setPoliciesToRemove] = useState([]);
  const [policiesToAdd, setPoliciesToAdd] = useState([]);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPoliciesToAdd([]);
  };
  const [isEditModalOpen, toggleEditModal] = useReducer(
    (state) => !state,
    false
  );
  const removePoliciesFromRoles = (roleId) => {
    if (policiesToAdd.find((entry) => entry.id === roleId)) {
      setPoliciesToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== roleId)
      );
    } else {
      setPoliciesToRemove((prevPolicie) => [roleId, ...prevPolicie]);
    }
  };
  const addPoliciesToRoles = (policiesToAdd) => {
    // deduplicate repeated files
    setPoliciesToAdd((prevPolicies) => [policiesToAdd, ...prevPolicies]);
  };
  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
  const { mutateAsync, isLoading, error } = useMutation(createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      queryClient.invalidateQueries(["role"]);
      setPoliciesToAdd([]);
      setOpenDialog(false);
    },
  });
  const { filterState } = useFilterContext();
  const activeFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  );
  const filteredButtons = buttons.buttons.filter(({ show_for }) => {
    if (show_for === "MULTIPLE" && selectionModel.length > 1) {
      return true;
    }
    if (show_for === "SINGLE" && selectionModel.length === 1) {
      return true;
    }
    if (show_for === "NONE" && selectionModel.length === 0) {
      return true;
    }
    if (show_for === "ALL") {
      return true;
    }
    if (show_for === "SINGLE_REMOVE" && selectionModel.length === 1) {
      return true;
    }
    if (show_for === "MULTIPLE_REMOVE" && selectionModel.length > 1) {
      return true;
    }
    if (
      show_for === "SINGLE_OR_MULTIPLE" &&
      (selectionModel.length === 1 || selectionModel.length > 1)
    ) {
      return true;
    }
    if (
      show_for === "FILTERED" &&
      activeFilters.length > 0 &&
      selectionModel.length === 0
    ) {
      return true;
    }
    return false;
  });
  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.invalidateQueries("collections");
  };

  const unselectCheckbox = () => {
    setSelectionModel([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPoliciesArray = [
      ...policiesToAdd.filter(({ id }) => !policiesToRemove.includes(id)),
    ];
    const formData = new FormData(e.target);
    try {
      const payload = {
        policies: newPoliciesArray.map(({ id }) => id),
      };
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      await mutateAsync(payload);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const isVisible = "visible";
  const isOpen = "open";

  if (isLoading) return "Loading...";
  if (error) return "There was a problem creating role";

  const handleAction = (actionName) => {
    switch (actionName) {
      case "refresh":
        refreshData();
        break;
      case "delete":
        setOpenConfirmDeleteRoles(true);
        break;
      case "create":
        handleClickOpenDialog();
        break;
      case "view_details":
        toggleEditModal();
        break;
      case "filter":
        toggleSidebar();
        break;
      case "unselect":
        unselectCheckbox();
        break;
      default:
        throw new Error(`${actionName} is not implemented`);
    }
  };

  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{ maxWidth: "1201px" }}
    >
      <Grid container sx={{ margin: "44px auto" }}>
        {filteredButtons
          .slice(0, 6)
          .map(({ id, text, name, icon_url, action, separator }) => (
            <Grid item key={id}>
              <Button
                variant="text"
                onClick={() => handleAction(action)}
                sx={{
                  padding: "0 15px",
                  display:
                    (name === "filters" && sidebarOpen) ||
                    (name === "Download Collection" && !isCollection)
                      ? "none"
                      : "inline-flex",
                }}
              >
                <img
                  src={icon_url}
                  alt="button icon"
                  style={{ margin: "0 8px 0 0" }}
                />{" "}
                {text}
                {separator === true && (
                  <img
                    src={separatorIcon}
                    alt="separator"
                    style={{ position: "absolute", right: "0" }}
                  />
                )}
              </Button>
            </Grid>
          ))}
        {filteredButtons.length > 6 && (
          <>
            <Grid item>
              <Button
                aria-controls={isMoreMenuOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isMoreMenuOpen ? "true" : undefined}
                onClick={openMoreMenu}
                sx={{ padding: "0 15px" }}
              >
                <img src={moreIcon} alt="more icon" /> More
              </Button>
            </Grid>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={isMoreMenuOpen}
              onClose={closeMoreMenu}
              PaperProps={{
                sx: {
                  mt: "10px",
                  boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
                  borderRadius: "8px",
                },
              }}
            >
              {filteredButtons
                .slice(6)
                .map(({ id, text, icon_url, action }) => (
                  <MenuItem
                    onClick={() => handleAction(action)}
                    key={id}
                    sx={{ fontWeight: "700" }}
                  >
                    <img
                      src={icon_url}
                      alt="button icon"
                      style={{ margin: "0 10px 0 0" }}
                    />{" "}
                    {text}
                  </MenuItem>
                ))}
            </Menu>
          </>
        )}
      </Grid>

      <CreateAdminRoleForm
        handleSubmit={handleSubmit}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        isVisible={isVisible}
        isOpen={isOpen}
        policiesToAdd={policiesToAdd}
        policiesToRemove={policiesToRemove}
        removePoliciesFromRoles={removePoliciesFromRoles}
        addPoliciesToRoles={addPoliciesToRoles}
      />
      {selectionModel[0] !== undefined && (
        <EditAdminRoleModal
          isOpen={isEditModalOpen}
          onClose={toggleEditModal}
          user={user}
          id={selectionModel[0]}
        />
      )}
      <ConfirmDeleteAdminRoles
        open={openConfirmDeleteRoles}
        onClose={() => setOpenConfirmDeleteRoles(false)}
        selectionModel={selectionModel}
      />
    </Container>
  );
};
