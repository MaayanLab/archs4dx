
import { Zoo } from './components/zoo';

import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import { NavBar } from "../../layout/navbar";

import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import React, { useState, useEffect } from 'react';
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";



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


export const ZooPage = () => {

    const [open, setOpen] = useState(false);
    const [hasUserId, setHasUserId] = useState(false);

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

    return(
        <>
          <Helmet>
            <title>{data.general.project_title}</title>
            <link rel="icon" type="image/png" href={data.general.project_icon} />
            <meta
              name="description"
              content="ARCHS4"
            />
          </Helmet>

            <>
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
            </>

            <Box sx={{
            flex: '1 0 auto', // This means flex-grow: 1; flex-shrink: 0; flex-basis: auto;
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url(../congruent_pentagon2.png)',
            marginTop: "0px",
            boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
            minHeight: '80vh',
        }}>

            <Paper sx={{
                margin: "40px",
                padding: "40px"

            }}>
        
            <Zoo/>
            </Paper>
            </Box>

            <FooterSection />
        </>
    );
};