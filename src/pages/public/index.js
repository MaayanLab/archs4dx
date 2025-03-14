import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import { NavBar } from "../../layout/navbar";
import { AvailableData } from "./components/available-data";
import { DataCollections } from "./components/collections-section";
import { StayConnected } from "./components/connected-section";
import { ContactInformation } from "./components/contact-info";
import { ContactUs } from "./components/contact-us";
import { Jumbotron } from "./components/jumbotron";

import { NewsSection } from "./components/news-section";
import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import React, { useState, useEffect } from 'react';
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import { CookieBanner } from "../../layout/cookie";

const drawerWidth = 344;

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

export const PublicPage = () => {

  const [hasUserId, setHasUserId] = useState(false);
  const [open, setOpen] = useState(false); // Assuming you have a state for the sidebar
  
  const toggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const response = await fetch('https://archs4.org/api/user/i');
        const data = await response.json();
        if (data && data.id) {
          setHasUserId(true);
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };
    
    checkUserId();
  }, []);

  return (
    <>
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta
          name="description"
          content="ARCHS4"
        />
      </Helmet>
      {hasUserId ? (
          <>
          <AppBar position="fixed" open={open}>
            <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
          </AppBar>
          
          </>
        ) : (
          <AppBar position="fixed" open={open}>
          <NavBar />
          </AppBar>
        )}
        <div style={{height: "90px"}} sx={{width: "200px", height: "360px"}}></div>
      <Jumbotron sx={{boxShadow: 'none'}}/>
      {/* <AvailableData /> */}
      {/*hasUserId && <DataCollections /> */}
      {/*<NewsSection /> */}
      {/*<ContactInformation />*/}
      {/*<ContactUs />*/}
      <StayConnected />
      <FooterSection />
      
    </>
  );
};
