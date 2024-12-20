import React, { useState } from "react";
import { Typography, Paper, Grid, Box, Switch, useMediaQuery } from "@mui/material";
import data from "../../../data/config.json";
import { keyframes, styled } from "@mui/system";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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




const AnimatedButton = styled("button")`
  animation: ${animation} 1000ms linear both;
`;


const planLabels = ["Essentials", "Plus", "Enterprise"];
const planPriceMonthly = [19.99, 49.99, 499.99];
const planPriceYearly = [15.99, 42.99, 399.99];

const Container = styled("div")(({ theme }) => ({
  overflow: "hidden",
  padding: "100px 0 20px 0",
  [theme.breakpoints.down("lg")]: {
    padding: "20px 0",
    "& .titleSection": {
      fontSize: "32px",
    },
  },
  [theme.breakpoints.up("md")]: {},
}));

export const PlanOverview = () => {
  const smallScreens = useMediaQuery("(max-width: 1024px)");
  const [isMonthly, setIsMonthly] = useState(true);
  const [animate, setAnimate] = useState(false);

  const toggleBilling = () => {
    setAnimate(true); // Trigger animation immediately
    setTimeout(() => {
      setIsMonthly(prev => !prev);
      setAnimate(false); // Reset for fade-in
    }, 100); // Slight delay to allow immediate disappearance
  };

  const slides = planLabels.map((label, i) => {
    const monthlyPrice = planPriceMonthly[i];
    const yearlyPrice = planPriceYearly[i];

    return (
      <Grid
        item
        key={i}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "280px",
            height: "400px",
            margin: "10px",
            padding: "16px",
            marginBottom: "60px",
            marginTop: "60px",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2>ARCHS4 {label}</h2>
          <Box className="price" sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: "22px" }}>{isMonthly ? "Billed monthly" : "Billed yearly"}</Typography>
            <Box sx={{ fontSize: '32px', fontWeight: 'bold',
                                transition: 'opacity 0.3s ease-in, transform 0.4s ease-in 0.05s',
                                opacity: animate ? 0 : 1, // Immediate change to 0
                                transform: animate ? 'translateX(20px)' : 'translateX(0)',
                                transitionDelay: animate ? '0s' : '0.0s', // Ensure no delay when hiding
                                visibility: animate ? 'hidden' : 'visible', // Instantly hide the element when opacity is 0
            }}>
              ${isMonthly ? monthlyPrice : yearlyPrice}
               /month
            </Box>
            <Typography variant="caption" sx={{ color: 'grey.600' }}>
              {`$${(isMonthly ? monthlyPrice * 12 : yearlyPrice*12).toFixed(2)}/year`}
            </Typography>
          </Box>
          <Box sx={{height: "100%", width: "100%", paddingLeft: "10px", marginTop: "14px", borderTop: "1px solid lightgrey"}}>
          <br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} /> 10GB max file size <br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  50GB online storage<br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  File persistance<br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  100 alignment processes<br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  10k API calls per month
          </Box>
          <Box>
            <AnimatedButton
                type="button"
                className="btn btn-info"
                onClick={() => window.location.href = 'subscription?pid=123'}
                style={{
                    width: "240px", fontSize: "16px", height: "40px", backgroundColor: "#5bc0de", color: "white",
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
        </Box>
        </Paper>
      </Grid>
    );
  });

  // Add a free plan card
  slides.unshift(
    <Grid
      item
      key="free"
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "280px",
          height: "400px",
          margin: "10px",
          padding: "16px",
          marginBottom: "60px",
          marginTop: "60px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2>ARCHS4 Basics</h2>
        <Box className="price" sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: "22px !important" }}>Try it for free</Typography>
          <Box sx={{
                fontSize: '32px',
                fontWeight: 'bold',
                transition: 'opacity 1.6s ease-in, transform 1.6s ease-in 1.5s',
                opacity: animate ? 0 : 1, // Immediate change to 0
                transform: animate ? 'translateX(60px)' : 'translateX(0)',
                transitionDelay: animate ? '0s' : '0.0s', // Ensure no delay when hiding
                visibility: animate ? 'hidden' : 'visible', // Instantly hide the element when opacity is 0
                color: "green"
              }}>
            $0/month
          </Box>
          <Typography variant="caption" sx={{ color: 'grey.600' }}>
            $0/year
          </Typography>
        </Box>
        <Box sx={{height: "100%", width: "100%", marginTop: "14px", paddingTop: "20px", borderTop: "1px solid lightgrey"}}>
            <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} /> 5GB max file size <br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  20GB online storage<br/>
          <FontAwesomeIcon icon={faCheck} style={{ color: 'blue', fontSize: '16px' }} />  20 alignment processes<br/>
          
        </Box>
        <Box>
        <AnimatedButton
        inactive
                type="button"
                className="btn btn-info"
                style={{
                    width: "240px", fontSize: "16px", height: "40px", backgroundColor: "lightgrey", color: "white",
                    border: "1px solid transparent",
                    borderRadius: "5px", fontweight: "800",
                    transition: "background-color 0.3s ease"
                }}
                
                sx={{
                    backgroundColor: "grey"
                }}
            >Subscribe</AnimatedButton>
            </Box>
      </Paper>
    </Grid>
  );

  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{
        backgroundImage: 'url(congruent_pentagon2.png)',
        boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
      }}
    >
      <Typography variant="subtitle1" className="titleSection">
        ARCHS4 subscription plans
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" mb={0}>
        <Typography variant="body1">Monthly</Typography>
        <Switch checked={!isMonthly} onChange={toggleBilling} />
        <Typography variant="body1">Yearly</Typography>
      </Box>

      <Box>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          {slides}
        </Grid>
      </Box>
    </Container>
  );
};