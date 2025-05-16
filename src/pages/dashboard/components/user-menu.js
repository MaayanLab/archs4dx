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
import logo from "../../../image/archs4vector.svg";
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
import { styled } from "@mui/system";
import { useState } from "react";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faUnlock, faUpload, faFolderTree, faHistory } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { IconButton, Drawer, List, ListItem,ListItemIcon, ListItemText, Hidden } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';

import { GeneSearch } from "../../../layout/genesearch";

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

const MButton = styled(Button)(({ theme }) => ({
  transition: 'color 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#0F7F90',
  }}))

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        custom: 750,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const AnimatedButton = styled("button")`
    
  `;


export const UserMenu = ({ sidebarOpen, toggleSidebar, landingPage=false }) => {
  
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const navigate = useNavigate();
  
  const navDataView = () => {
    navigate('/data');
  };

  const navDownloads = () => {
    navigate('/download');
  };

  const navHelp = () => {
    navigate('/help');
  };

  const navGenePage = () => {
    navigate('/gene');
  };

  const navHome = () => {
    navigate('/');
  };

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
    <>
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
        {!landingPage && (
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
        )}
        {!sidebarOpen && (
          <>
            <Typography component="div" sx={{ marginLeft: "30px", width: "130px" }}>
              <Link to="/">
              <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                  width: {
                    xs: '160px',  // width for extra-small devices
                    sm: '180px',  // width for small devices
                    md: '200px',  // width for medium devices
                    lg: '220px',  // width for large devices
                    xl: '240px',  // width for extra-large devices
                  },
                  transition: 'width 0.3s ease-in-out', 
                }}
              />
              </Link>
            </Typography>
          </>
        )}
      </Box>
      
        <Hidden mdDown>
          <MButton variant="text" onClick={navHome} className="visualizeButton mbutton">
            Home
          </MButton>
          <MButton variant="text" onClick={navDataView} className="visualizeButton mbutton">
            Data Explorer
          </MButton>
          <MButton variant="text" onClick={navDownloads} className="downloadButton mbutton">
            Download
          </MButton>
          <MButton variant="text" onClick={navHelp} className="helpButton mbutton">
            Help
          </MButton>
          <GeneSearch/>
        </Hidden>

        {/* Drawer containing the menu items */}
        <Hidden mdUp>
        <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{color: "black", fontSize: "20px"}}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer} PaperProps={{
          sx: {
            color: "black",
          }}}>
          <List>
          <ListItem button onClick={navHome}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleOpenTerms}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
          <ListItem button onClick={navDataView}>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Visualize" />
          </ListItem>
          <ListItem button onClick={navDownloads}>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </ListItem>
          <ListItem button onClick={handleOpenTerms}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
          </List>
        </Drawer>
        </Hidden>

        
      {(roles.includes("uploader") || roles.includes("admin") || roles.length == 0) && (
      
<>
      <MButton
        variant="text"
        className="intraButton mbutton"
        id="basic-button"
        aria-controls={isMenuOpen ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? 'true' : undefined}
        onClick={handleClick}
        sx={{marginLeft: "10px"}}
      >
        <FontAwesomeIcon icon={isMenuOpen ? faCaretUp : faCaretDown} style={{ marginRight: '6px' }} />
        Access
      </MButton>


      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'row',  // Two-column layout
            width: '400px',         // Define sufficient width for two panels
            padding: 1,
          }
        }}
      >
        {/* Left Panel */}
        <Box sx={{paddingLeft: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
          Access and interact with ARCHS4 resources and pipeline.
        </Box>

        {/* Right Panel */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
        <MenuItem onClick={handleCloseMenu}>
            <Link to="/search" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <FontAwesomeIcon icon={faFolderTree} style={{ marginRight: '14px', color: "#1ebcbb" }} />
              Access Files
            </Link>
          </MenuItem>

          {roles.includes("uploader") && (
          <MenuItem onClick={handleCloseMenu}>
            <Link to="/myfiles" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <FontAwesomeIcon icon={faUpload} style={{ marginRight: '14px', color: "#1ebcbb" }} />
              Upload Files
            </Link>
          </MenuItem>
          )}

          {roles.includes("admin") && (
            <>
            <MenuItem onClick={handleCloseMenu}>
              <Link to="/logs" style={{ color: "darkred", fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faHistory} style={{ marginRight: '14px', color: "#1ebcbb" }} />
                System Logs
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <Link to="/admin/users" style={{ color: "darkred", fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faUnlock} style={{ marginRight: '14px', color: "#1ebcbb" }} />
                Admin Dashboard
              </Link>
            </MenuItem>
            </>
          )}

          {/*
          <AnimatedButton
                type="button"
                className="btn btn-info"
                onClick={() => window.location.href = 'subscription'}
                style={{
                    width: "100%", fontSize: "16px", height: "40px", backgroundColor: "#5bc0de", color: "white",
                    border: "1px solid transparent",
                    borderRadius: "5px", fontweight: "800",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#48a9c7"} // Hover color
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#5bc0de"}
                sx={{
                    backgroundColor: "#5bc0de"
                }}
            >Subscribe</AnimatedButton>
            */}
        </Box>
      </Menu>
      
    </>

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
                    <Grid item>Request Data Access</Grid>
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
              href="https://archs4.org/api/docs/"
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
              href="https://archs4.org/user_guide.pdf"
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
  
    </>
  );
};
