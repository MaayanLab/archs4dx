import {
  Container,
  AppBar,
  Button,
  Typography,
  Modal,
  Box,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";

// Placeholder imports (replace with your actual assets/data)
import closeIcon from "../image/close-icon.svg";
import logo from "../image/archs4vector.svg";
import data from "../data/config.json";
import { GeneSearch } from "./genesearch"; // Assuming this is a custom component

const loginModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};

const Toolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  height: "93px",
  width: "100%",
  maxWidth: "3200px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    padding: "0 15px",
  },
  [theme.breakpoints.down(400)]: {
    flexDirection: "column",
    alignItems: "flex-start",
    height: "auto",
    padding: "10px 15px",
  },
}));

const NavItems = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  flexWrap: "nowrap",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  color: "#0F7F90",
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const MButton = styled(Button)(({ theme }) => ({
  transition: "color 0.3s ease, background-color 0.3s ease",
  whiteSpace: "nowrap",
  "&:hover": {
    color: "#fff",
    backgroundColor: "#0F7F90",
  },
}));

const LogoWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: 0,
  [theme.breakpoints.down(400)]: {
    marginBottom: "10px",
  },
}));

const RightContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  [theme.breakpoints.down(400)]: {
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const drawerWidth = 240;

// Main content container styling
const MainContent = styled("div")(({ theme }) => ({
  padding: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "20px",
  },
}));

// Section styling
const Section = styled("div")(({ theme }) => ({
  marginBottom: "20px",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "calc(50% - 10px)", // Half width minus gap
  },
}));

export const NavBar = () => {
  const [open, setOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { label: "Home", action: () => navigate("/") },
    { label: "Data Explorer", action: () => navigate("/data") },
    { label: "Download", action: () => navigate("/download") },
    { label: "Help", action: () => navigate("/help") },
  ];

  const handleLoginRedirection = (url) => {
    if (process.env.NODE_ENV === "development") {
      navigate("/search");
    } else {
      window.location.replace(url);
    }
  };

  // Effect to close drawer when screen size increases beyond md breakpoint
  React.useEffect(() => {
    const handleResize = () => {
      const mdBreakpoint = theme.breakpoints.values.md;
      if (window.innerWidth >= mdBreakpoint && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileOpen, theme.breakpoints.values.md]);

  const drawer = (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      <GeneSearch isMobile={true}/>
      <br/>
      <List sx={{ textAlign: "right", m: 0, p: 0 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              item.action();
              setMobileOpen(false);
            }}
            sx={{ py: 1 }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2 }}>
      <br/>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: "2",
            padding: "10px 15px",
            fontSize: "13px",
            backgroundColor: "#5bc0de",
            "&:hover": {
              backgroundColor: "#48a9c7",
            },
            whiteSpace: "nowrap",
            ml: 0,
            pl: 1,
            pr: 1,
          }}
          onClick={() => handleLoginRedirection(data.startpage.sso[0].url)}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="false" disableGutters={true}>
      <AppBar
        position="relative"
        sx={{
          boxShadow: "none",
          background: "#EFF4F5",
          height: "93px",
        }}
      >
        <Toolbar>
          <LogoWrapper>
            <Link to="/">
              <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                  width: {
                    xs: "160px",
                    sm: "180px",
                    md: "200px",
                    lg: "220px",
                  },
                  height: "auto",
                }}
              />
            </Link>
          </LogoWrapper>

          <RightContainer>
            <NavItems>
              {navItems.map((item) => (
                <MButton
                  key={item.label}
                  variant="text"
                  onClick={item.action}
                >
                  {item.label}
                </MButton>
              ))}
              <GeneSearch isMobile={false} sx={{ whiteSpace: "nowrap" }} />
              <Button
                variant="contained"
                onClick={() => handleLoginRedirection(data.startpage.sso[0].url)}
                sx={{ ml: 1,mr: 0, whiteSpace: "nowrap" }} // Changed ml from 2 to 1
              >
                Sign in
              </Button>
            </NavItems>
            <MobileMenuButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ fontSize: "2rem" }}
            >
              <MenuIcon sx={{ fontSize: "inherit" }} />
            </MobileMenuButton>
          </RightContainer>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            background: "#EFF4F5",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          background:
            "linear-gradient(97.08deg, rgba(243, 139, 151, 0.8) 20.01%, rgba(244, 144, 77, 0.8) 75.82%)",
        }}
      >
        <Box sx={{ ...loginModalStyle, width: { xs: "90%", sm: "635px" } }}>
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
            Note: ARCHS4 uses OAuth for authentication purposes only. The
            application will not have access to your private data, and will not
            send you any e-mails.
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

// Main App component with About and News sections
const App = () => {
  return (
    <div>
      <NavBar />
      <MainContent>
        <Section>
          <Typography variant="h5">About</Typography>
          <Typography variant="body1">
            This is the About section. It provides information about the
            application or organization.
          </Typography>
        </Section>
        <Section>
          <Typography variant="h5">News</Typography>
          <Typography variant="body1">
            This is the News section. It contains updates and recent events.
          </Typography>
        </Section>
      </MainContent>
    </div>
  );
};

export default App;