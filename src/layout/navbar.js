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

const Toolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  "& .navbarLogo": {
    width: "216px",
  },
  [theme.breakpoints.down("md")]: {
    margin: "auto 20px",
    "& .navbarLogo": {
      width: "140px",
    },
    "& .termsButton": {
      display: "none",
    },
  },
  [theme.breakpoints.up("md")]: {
    margin: "auto 160px",
    "& .navbarLogo": {
      width: "216px",
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img
                src={data.general.project_logo}
                alt="logo"
                className="navbarLogo"
              />
            </Link>
          </Typography>
          <Button
            variant="text"
            onClick={handleOpenTerms}
            className="termsButton"
          >
            Terms and Conditions
          </Button>
          <TermsConditionsModal isOpen={openTerms} onClose={handleCloseTerms} />
          {data.startpage.sso.length > 1 ? (
            <Button variant="primary" onClick={handleOpen}>
              Log In
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => handleLoginRedirection(data.startpage.sso[0].url)}
            >
              {" "}
              <img
                src={googleIcon}
                alt="Service"
                style={{ width: "24px", height: "24px", marginRight: "11px" }}
              />{" "}
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
                    Login with one of this options
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
                Note: IHDH uses Google for authentication purposes
                only. The application will not have access to your private data,
                and will not send you any e-mails.
              </Typography>
            </Box>
          </Modal>
        </Toolbar>
      </AppBar>
    </Container>
  );
};
