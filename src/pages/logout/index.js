import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Grid, Avatar } from "@mui/material";
import blobContat from "../../image/blob-available-02.svg";
import blobContat2 from "../../image/blob-contact.svg";
import { styled } from "@mui/system";
import { FooterSection } from "../../layout/compactfooter";

const Container = styled("div")(({ theme }) => ({
    margin: "140px auto",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      margin: "40px auto",
      "& .blobContact": {
        display: "none",
      },
      "& .titleSection": {
        fontSize: "32px",
      },
      "& .boxCarousel": {
        margin: "20px auto",
      },
      "& .contactsAvatar": {
        width: 150,
        height: 150,
        margin: "0 auto -35px auto",
      },
    },
    [theme.breakpoints.up("md")]: {
      "& .gridItem": {
        display: "block",
      },
    },
  }));

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts
  }, [navigate]);
  
  return (
        <Container maxWidth="false" disableGutters={true}>
          <Box
            className="blobContact"
            sx={{
              position: "absolute",
              top: "-241px",
            }}
          >
            <img src={blobContat} alt="blob gradient" />
          </Box>
          <Box
            className="blobContact"
            sx={{
              position: "absolute",
              top: "-126px",
              zIndex: "2",
            }}
          >
            <img src={blobContat2} alt="blob gradient" />
          </Box>
    
          <Typography variant="subtitle1" className="titleSection">
            Logged out
          </Typography>
          <Box
            className="boxCarousel"
            sx={{
              maxWidth: "600px",
              margin: "20px auto",
            }}
          >
             <Typography variant="body2" className="info">
                The session expired and you are being redirected to the home page. 
            </Typography>
          </Box>
          <Box
          sx={{
            maxWidth: "840px",
            margin: "20px auto",
          }}>
            <FooterSection />
          </Box>
          
          </Container>
  );
};
