import {
  Container,
  AppBar,
  Button,
  Typography,
  Modal,
  Box,
  Grid,
} from "@mui/material";
import * as React from "react";
import closeIcon from "../image/close-icon.svg";
import googleIcon from "../image/google-icon.svg";
import data from "../data/config.json";
import { Link, useNavigate } from "react-router-dom";
import { TermsConditionsModal } from "./terms-and-conditions";
import { styled } from "@mui/system";
import { keyframes } from '@mui/system';
import { GeneSearch } from "./genesearch";
import logo from "../image/archs4vector.svg";

const CustomStyles = styled('div')({ 
  '@media (max-width: 900px)': {
    '.hide-on-small': {
      display: 'none',
    },
  },
});

const loginModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "635px",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};

const MButton = styled(Button)(({ theme }) => ({
  transition: 'color 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#0F7F90', // Hover color
  }}))


const Toolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  "& .navbarLogo": {
    width: "360px",
  },
  [theme.breakpoints.down("sm")]: {
    margin: "auto 10px",
    "& .navbarLogo": {
      width: "280px",
    },
    "& .termsButton": {
      display: "none",
    },
  },
  [theme.breakpoints.up("sm")]: {
    margin: "auto 20px",
    "& .navbarLogo": {
      width: "320px",
    },
    "& .termsButton": {
      display: "none",
    },
  },
  [theme.breakpoints.up("md")]: {
    margin: "auto 30px",
    "& .navbarLogo": {
      width: "340px",
    },
  },
}));

export const NavBar = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openTerms, setOpenTerms] = React.useState(false);
  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

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

  const handleLoginRedirection = (url) => {
    if (process.env.NODE_ENV === "development") {
      navigate("/search");
    } else {
      window.location.replace(url);
    }
  };
  
  return (
    <Container maxWidth="false" disableGutters={true}>
      <AppBar
        position="relative"
        sx={{
          boxShadow: "none",
          position: "relative",
          background: "#EFF4F5",
          height: "93px",
        }}
      >
        <Toolbar>
        <Typography component="div" sx={{ marginLeft: "30px", width: "130px", flexGrow: 1 }}>
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

          ) : (
            <Button
              variant="contained"
              onClick={() => handleLoginRedirection(data.startpage.sso[0].url)}
            >
              Sign in
            </Button>
          )}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              background:
                "linear-gradient(97.08deg, rgba(243, 139, 151, 0.8) 20.01%, rgba(244, 144, 77, 0.8) 75.82%);",
            }}
          >
            <Box sx={loginModalStyle} className="loginModal">
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                flexWrap="nowrap"
              >
                <Grid item>
                  <Typography
                    id="modal-modal-title"
                    variant="body2"
                    sx={{ color: "#0F7F90" }}
                  >
                    Login with one of these options
                  </Typography>
                </Grid>
                <Grid item justifyContent="flex-end" marginRight="-10px">
                  <Button onClick={handleClose}>
                    <img src={closeIcon} alt="close icon" />
                  </Button>
                </Grid>
              </Grid>
              <Box margin="40px auto">
                {data.startpage.sso.map(({ service, icon_service, url }, i) => (
                  <Button
                    variant="outline"
                    key={i}
                    onClick={() => handleLoginRedirection(url)}
                  >
                    <Box marginRight="13px" marginTop="5px">
                      <img src={icon_service} alt="icon service" />
                    </Box>
                    Sign in with {service}
                  </Button>
                ))}
              </Box>
              <Typography id="modal-modal-description" variant="body4">
                Note: ARCHS4 uses OAuth for authentication purposes only.
                The application will not have access to your private data, and will
                not send you any e-mails.
              </Typography>
            </Box>
          </Modal>
        </Toolbar>
      </AppBar>
    </Container>
  );
};
