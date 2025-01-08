import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";

import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";

import { useLocation } from 'react-router-dom';
import check from "../../image/checkmark.png";
import { keyframes, css } from "@mui/system";
import { PlanOverview } from "./components/planoverview";

const drawerWidth = 344;


const animation = keyframes`
0% { -webkit-transform: matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.4% { -webkit-transform: matrix3d(0.658, 0, 0, 0, 0, 0.703, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.658, 0, 0, 0, 0, 0.703, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { -webkit-transform: matrix3d(0.725, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.725, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { -webkit-transform: matrix3d(0.83, 0, 0, 0, 0, 0.946, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.83, 0, 0, 0, 0, 0.946, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { -webkit-transform: matrix3d(0.942, 0, 0, 0, 0, 1.084, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.942, 0, 0, 0, 0, 1.084, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.21% { -webkit-transform: matrix3d(0.971, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.971, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.61% { -webkit-transform: matrix3d(1.062, 0, 0, 0, 0, 1.166, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.062, 0, 0, 0, 0, 1.166, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { -webkit-transform: matrix3d(1.07, 0, 0, 0, 0, 1.165, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.07, 0, 0, 0, 0, 1.165, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.52% { -webkit-transform: matrix3d(1.104, 0, 0, 0, 0, 1.12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.104, 0, 0, 0, 0, 1.12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { -webkit-transform: matrix3d(1.106, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.106, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  21.32% { -webkit-transform: matrix3d(1.098, 0, 0, 0, 0, 1.035, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.098, 0, 0, 0, 0, 1.035, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { -webkit-transform: matrix3d(1.075, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.075, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  25.23% { -webkit-transform: matrix3d(1.067, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.067, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.03% { -webkit-transform: matrix3d(1.031, 0, 0, 0, 0, 0.948, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.031, 0, 0, 0, 0, 0.948, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { -webkit-transform: matrix3d(1.024, 0, 0, 0, 0, 0.949, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.024, 0, 0, 0, 0, 0.949, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { -webkit-transform: matrix3d(0.99, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.99, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  36.74% { -webkit-transform: matrix3d(0.986, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.986, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { -webkit-transform: matrix3d(0.98, 0, 0, 0, 0, 1.011, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.98, 0, 0, 0, 0, 1.011, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  44.44% { -webkit-transform: matrix3d(0.983, 0, 0, 0, 0, 1.016, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.983, 0, 0, 0, 0, 1.016, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { -webkit-transform: matrix3d(0.996, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.996, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  59.86% { -webkit-transform: matrix3d(1.003, 0, 0, 0, 0, 0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.003, 0, 0, 0, 0, 0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { -webkit-transform: matrix3d(1.004, 0, 0, 0, 0, 0.996, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.004, 0, 0, 0, 0, 0.996, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.28% { -webkit-transform: matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { -webkit-transform: matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  90.69% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
}
`;




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


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe("pk_test_51IGVo8KpFXEHYGhMksnSUWHM9M6IDZYcKECsS7s1v7jsXdQF1fAsgzEhkXzNQ0otQjJLdscclf1POBcqGeZOIOIG00stUWCm6z");

export const CheckoutForm = () => {
    const [sessionData, setSessionData] = useState(null);
    const [planId, setPlanId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const location = useLocation();

    const [hasUserId, setHasUserId] = useState(false);
    const [open, setOpen] = useState(false); // Assuming you have a state for the sidebar
    
    const toggle = () => {
      setOpen(!open);
    };
    
    const navigate = useNavigate();
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/logout');
      }, 60*1000*10);
      return () => clearTimeout(timer);
    }, [navigate]);
  
    useEffect(() => {
      const checkUserId = async () => {
        try {
          const response = await fetch('https://dev.archs4.org/api/user/i');
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

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    const plan_id_parameter = queryParams.get('pid');
    setPlanId(plan_id_parameter)

    if (!plan_id_parameter) {
        setLoading(false);
    }

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    

    fetch(`http://localhost:4242/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSessionData(data);
        }
      })
      .catch((e) => {
        setError('Error fetching session status');
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search]);

  if (sessionData) {
    return (
        <>
  <Helmet>
    <title>{data.general.project_title}</title>
    <link rel="icon" type="image/png" href={data.general.project_icon} />
    <meta name="description" content="ARCHS4" />
  </Helmet>
  <AppBar position="fixed" open={open}>
    <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
  </AppBar>

  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      
    }}
  >
    {/* This represents your main content area */}
    <Box
      sx={{
        flex: '1 0 auto', // This means flex-grow: 1; flex-shrink: 0; flex-basis: auto;
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(congruent_pentagon2.png)',
        marginTop: "64px", // Adjust this based on the AppBar height
        boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)'
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid
          item
          xs={12}
          sm={11}
          md={11}
          lg={9}
          xl={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Paper
            elevation={3}
            sx={{
                padding: '60px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                flexDirection: {
                xs: 'column',
                md: 'row',
                margin: "50px"
                },
            }}
            >
            <Box sx={{ 
                borderBottom: { xs: "2px solid lightgray", md: "none" }, // Bottom border for xs, none for sm and up
                borderRight: { md: "2px solid lightgray" }, // Right border for sm and up
                paddingRight: { md: "30px" },
                marginBottom: { xs: "30px", md: "0" }, // Ensure spacing at the bottom when stacked
                paddingBottom: { xs: "30px", md: "0" }, 
                }}>
                <h2><nobr>{sessionData.product_name}</nobr></h2>
                <br/><br/>
                {sessionData.product_description}
            </Box>

            <Box sx={{ paddingLeft: { sm: "30px" }, position: 'relative' }}>
                <div className="checkout-results">
                    <h2 style={{ color: "#00B08A" }}><nobr>Transaction Complete</nobr></h2>
                    <p><nobr>Date: {new Date(sessionData.date * 1000).toLocaleString()}</nobr></p>
                    <br />
                    <p><nobr>Customer: {sessionData.customer.name}</nobr></p>
                    <p><nobr>Email: {sessionData.customer.email}</nobr></p>
                    <p><nobr>Status: {sessionData.status}</nobr></p>
                    <p><nobr>Payment: {sessionData.payment}</nobr></p>
                    <p><nobr>Amount: ${(sessionData.amount / 100).toFixed(2)}</nobr></p>
                    
                    <Box
                        component="img"
                        src={check}
                        alt="success"
                        sx={{
                        width: "100px",
                        height: "auto",
                        position: "absolute",
                        bottom: "-40px",
                        right: "-40px",
                        animation: `${animation} 1000ms linear both`,
                        }}
                    />
                </div>
            </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>

    {/* Footer that stays at the bottom */}
    <FooterSection sx={{ flexShrink: 0 }} />
  </Box>
  </>
      );
  }

  if (planId){
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
            <>
            <AppBar position="fixed" open={open}>
              <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
            </AppBar>
            <div style={{height: "90px"}} sx={{width: "200px", height: "360px"}}></div>
            </>

        <div id="checkout" style={{margin: "50px", padding: "10px"}}>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
    
        <FooterSection />
    
        </>
      )
  }

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

        <>
        <AppBar position="fixed" open={open}>
          <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
        </AppBar>
        <div style={{height: "90px"}} sx={{width: "200px", height: "360px"}}></div>
        </>

      
    
        <PlanOverview/>

    <FooterSection />

    </>
  )
}
