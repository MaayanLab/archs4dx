import { styled } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { SidebarContent } from "./components/sidebar-content";
import { UserMenu } from "../dashboard/components/user-menu";
import data from "../../data/config.json";
import { MainHeader } from "./components/main-header";
import { MainTable } from "./components/main-table";
import { MainKeyTable } from "./components/apikey/main-table";
import { FilterContextProvider } from "./filter-context";
import { Helmet } from "react-helmet-async";
import { getLoggedUser } from "../../api/user";
import { useQuery } from "react-query";
import { FileUploadContextProvider, useFileUploadContext } from "./file-upload-context";
import UploadProgressAccordion from "./components/upload-progress-accordion";
import { FooterSection } from "../../layout/compactfooter";

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from "../../image/archs4vector.svg";

import {
  Grid,
  Typography,
} from "@mui/material";

const drawerWidth = 344;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  boxShadow: "none",
  background: "#EFF4F5",
  height: "93px",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const MyFiles = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { uploadComplete } = useFileUploadContext(); // is defined in file-upload-context

  const toggle = () => setOpen((state) => !state);
  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(["user/getLoggedUser"], () => getLoggedUser());

  if (isLoading) return "Loading...";
  if (error) {
    setTimeout(() => navigate("/logout"), 0); // Redirect after a tick to avoid React state update warnings
    // Alternatively, you can show an error message or a button to retry or logout.
    return "There was a problem loading this page";
  }

  return (
    <>
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta
          name="description"
          content="dataXways"
        />
      </Helmet>
      <FilterContextProvider>
        <FileUploadContextProvider>
          <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" open={open}>
              <UserMenu sidebarOpen={open} toggleSidebar={toggle} />
            </AppBar>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  boxShadow: "12px 0px 24px rgba(0, 81, 99, 0.08)",
                  borderRight: "0px",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader>
                <a href="/" style={{margin: "30px auto" }}>
                  <img
                    style={{ width: "180px" }}
                    src={logo}
                    alt="project logo"
                    
                  />
                </a>
              </DrawerHeader>
              <SidebarContent toggleSidebar={toggle} user={user} />
            </Drawer>
            <Main open={open}>
              <DrawerHeader />
              <MainHeader user={user}/>
              <MainTable
                sidebarOpen={open}
                toggleSidebar={toggle}
                user={user}
                uploadCompleted={uploadComplete}
              />
               <Grid
                container
                sx={{ justifyContent: "flex-start", alignItems: "center" }}
              >
              
              </Grid>
              <MainKeyTable
                sidebarOpen={open}
                toggleSidebar={toggle}
                user={user}
                uploadCompleted={uploadComplete}
              />
              <FooterSection />
            </Main>
            
            <UploadProgressAccordion />
          </Box>
        </FileUploadContextProvider>
      </FilterContextProvider>
    </>
  );
};
