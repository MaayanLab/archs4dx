import {
  Toolbar,
  Typography,
  Avatar,
  Button,
  Modal,
  Box,
  Grid,
} from "@mui/material";
import * as React from "react";
import { useReducer } from "react";
import logo from "../../../image/logo.png";
import exitIcon from "../../../image/exit-icon.svg";
import profileIcon from "../../../image/profile-icon.svg";
import conditionsIcon from "../../../image/conditions-icon.svg";
import requestIcon from "../../../image/request-icon.svg";
import apiIcon from "../../../image/applications-icon.svg";
import helpIcon from "../../../image/help-icon.svg";
import rightArrow from "../../../image/right-arrow.svg";
import leftArrow from "../../../image/left-arrow.svg";
import { Link, useLocation } from "react-router-dom";
import "./user-menu.css";
import { TermsConditionsModal } from "../../../layout/terms-and-conditions";
import { RequestRole } from "./request-role";
import { EditModal } from "../../../common/edit-modal";
import { EditProfileForm } from "./edit-profile-form";
import { useQuery } from "react-query";
import { getLoggedUser } from "../../../api/user";
import { deepOrange } from '@mui/material/colors';

const style = {
  position: "absolute",
  top: "97px",
  right: "38px",
  width: "600px",
  height: "294px",
  bgcolor: "#FFF",
  border: "0px",
  padding: "40px",
  borderRadius: "4px",
  boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
};

export const UserMenu = ({ sidebarOpen, toggleSidebar }) => {

  const {
    data: user,
    isLoading,
    error,
  } = useQuery(["user/getLoggedUser"], () => getLoggedUser());

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openTerms, setOpenTerms] = React.useState(false);
  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

  const [isEditModalOpen, toggleEditModal] = useReducer(
    (state) => !state,
    false
  );
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  
  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";
  const roles = user.roles.map((entry) => entry.name);

  return (
    <Toolbar
      sx={{
        position: "relative",
        margin: "auto 40px auto 0",
        paddingRight: "0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Box
          variant="text"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 2, width: "45px", marginLeft: "-24px" }}
        >
          {sidebarOpen ? (
            <Button
              variant="text"
              sx={{
                background: "#FFF",
                height: "93px",
                borderRadius: " 0px 4px 4px 0px",
                minWidth: "45px",
              }}
            >
              <img src={leftArrow} alt="arrow icon" />
            </Button>
          ) : (
            <Button
              variant="text"
              sx={{
                background:
                  "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%);",
                height: "93px",
                borderRadius: " 0px 4px 4px 0px",
                minWidth: "45px",
              }}
            >
              <img src={rightArrow} alt="arrow icon" />
            </Button>
          )}
        </Box>
        {!sidebarOpen && (
          <Typography component="div" sx={{ marginLeft: "99px" }}>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </Typography>
        )}
      </Box>
      <Link className="userLink" to="/">
        Home
      </Link>
      <Link
        to="/search"
        className={
          splitLocation[1] === "search" ? "userLinkActive" : "userLink"
        }
      >
        Search
      </Link>

      {(roles.includes("uploader") || roles.includes("admin")) && (
        <Link
          to="/myfiles"
          className={
            splitLocation[1] === "myfiles" ? "userLinkActive" : "userLink"
          }
        >
          My files
        </Link>
      )}
      {roles.includes("admin") && (
        <Link
          to="/admin/users"
          className={
            splitLocation[1] === "admin" ? "userLinkActive" : "userLink"
          }
        >
          Admin
        </Link>
      )}
      <Button onClick={handleOpen}>
      <Avatar sx={{ bgcolor: deepOrange[500] }}>
      {`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()}
      </Avatar>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="userModal"
      >
        <Box sx={style}>
          <Box
            id="modal-modal-title"
            sx={{
              display: "flex",
              paddingBottom: "12px",
              borderBottom: "1px solid #b0c9cb",
            }}
          >
            <Box sx={{ flexShrink: 1 }}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()}
            </Avatar>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              {" "}
              <Typography variant="modalTitle">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="modalSubtitle">{user.email}</Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <a
                className="modalLinks"
                href="/api/user/logout"
                rel="noreferrer"
              >
                <Grid container>
                    <Grid item sx={{ marginRight: "8px" }}>
                      <img src={exitIcon} alt="Exit icon" />
                    </Grid>
                    <Grid item>Logout</Grid>
                  </Grid>
              </a>
            </Box>
          </Box>

          <Box
            id="modal-modal-description"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              margin: "36px auto",
            }}
          >
            <Button
              className="modalLinks"
              xs={7}
              onClick={toggleEditModal}
              sx={{ padding: "0 15px", margin: "0 0 10px 0" }}
            >
              <Grid container>
                <Grid item sx={{ marginRight: "12px" }}>
                  <img src={profileIcon} alt="profile icon" />
                </Grid>
                <Grid item>View Profile</Grid>
              </Grid>
            </Button>
            <Button
              className="modalLinks"
              xs={7}
              onClick={handleOpenTerms}
              sx={{ padding: "0 15px", margin: "0 0 10px 0" }}
            >
              <Grid container>
                <Grid item sx={{ marginRight: "12px" }}>
                  {" "}
                  <img src={conditionsIcon} alt="Terms and conditions icon" />
                </Grid>
                <Grid item>Terms and Conditions</Grid>
              </Grid>
            </Button>
            <TermsConditionsModal
              isOpen={openTerms}
              onClose={handleCloseTerms}
            />

            {!user.roles.includes("uploader") &&
              !user.roles.includes("admin") && (
                <Button
                  className="modalLinks"
                  onClick={handleClickOpenDialog}
                  sx={{ padding: "0 15px" }}
                >
                  <Grid container>
                    <Grid item sx={{ marginRight: "12px" }}>
                      {" "}
                      <img src={requestIcon} alt="Request icon" />
                    </Grid>
                    <Grid item>Request Contributor Role</Grid>
                  </Grid>
                </Button>
              )}
            {user.roles.includes("uploader") &&
              !user.roles.includes("admin") && (
                <Button
                  className="modalLinks"
                  onClick={handleClickOpenDialog}
                  sx={{ padding: "0 15px" }}
                >
                  <Grid container>
                    <Grid item sx={{ marginRight: "12px" }}>
                      {" "}
                      <img src={requestIcon} alt="Request icon" />
                    </Grid>
                    <Grid item>Request Admin Role</Grid>
                  </Grid>
                </Button>
              )}
            <a
              className="modalLinks"
              href="https://ihdh.io/api/docs/"
              target="_blank"
              rel="noreferrer"
            >
              <Grid container>
                <Grid item sx={{ marginRight: "12px" }}>
                  {" "}
                  <img src={apiIcon} alt="applications icon" />
                </Grid>
                <Grid item>Applications (API)</Grid>
              </Grid>
            </a>
            <a
              className="modalLinks"
              href="https://ihdh.io/user_guide.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Grid container>
                <Grid item sx={{ marginRight: "12px" }}>
                  {" "}
                  <img src={helpIcon} alt="help icon" />
                </Grid>
                <Grid item>Documentation</Grid>
              </Grid>
            </a>
          </Box>
          <EditModal
            isOpen={isEditModalOpen}
            onClose={toggleEditModal}
            title={"Edit Profile"}
            data={user}
          >
            <EditProfileForm data={user} />
          </EditModal>
          <RequestRole open={openDialog} onClose={handleCloseDialog} />
        </Box>
      </Modal>
    </Toolbar>
  );
};
