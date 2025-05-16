import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import { styled, keyframes as muiKeyframes } from "@mui/system";
import loveletter from '../image/loveletter.png';

// Keyframes for the glowing animation
const glowingAnimation = muiKeyframes`
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
`;

// Styled Paper component with glow effect
const GlowingPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 0,
  borderRadius: '6px',
  border: '2px solid black',
  background: '#ffffff',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
    backgroundSize: '400%',
    zIndex: -1,
    filter: 'blur(5px)',
    width: 'calc(100% + 4px)',
    height: 'calc(100% + 4px)',
    animation: `${glowingAnimation} 20s linear infinite`,
    transition: 'opacity 0.3s ease-in-out',
    borderRadius: '6px',
  },
  '&:after': {
    zIndex: -1,
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#ffffff',
    left: '0',
    top: '0',
    borderRadius: '6px',
  },
}));

export const LetterSignup = ({ isGlowing }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const addEmail = async () => {
    const payload = { email };
    const url = 'https://archs4.org/api/mailchimp/subscribe';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEmail('');
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Box>
      <Grid item md={12}>
        <Typography
          className="headerSubtitle"
          sx={{
            fontSize: "15px",
            lineHeight: "18px",
            letterSpacing: "0px",
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isSubscribed && (
            <img 
              src={loveletter} 
              alt="Love letter" 
              style={{ 
                marginRight: '10px',
                height: '40px',
              }} 
            />
          )}
          {isSubscribed 
            ? "Thank you for signing up to the ARCHS4 newsletter!"
            : "If you would like to receive updates on the ARCHS4 data and stay informed about new data releases consider signing up for the newsletter."
          }
        </Typography>
      </Grid>
      {!isSubscribed && (
        <Grid 
          item 
          md={12}
          sx={{
            paddingTop: "20px",
            display: 'flex',
            width: "100%",
          }}
        >
          {isGlowing ? (
            <GlowingPaper
              sx={{ display: 'flex', alignItems: 'center', width: "100%" }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="menu">
                <LoyaltyIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
                inputProps={{ 'aria-label': 'email address' }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton 
                color="primary" 
                aria-label="submit email" 
                sx={{
                  fontSize: "14px",
                  color: "black",
                  p: '10px',
                }}
                className="btn btn-info my-2 my-sm-0"
                onClick={addEmail}
              >
                Keep Me Updated
              </IconButton>
            </GlowingPaper>
          ) : (
            <Paper
              sx={{ display: 'flex', alignItems: 'center', width: "100%" }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="menu">
                <LoyaltyIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
                inputProps={{ 'aria-label': 'email address' }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton 
                color="primary" 
                aria-label="submit email" 
                sx={{
                  fontSize: "14px",
                  color: "black",
                  p: '10px',
                }}
                className="btn btn-info my-2 my-sm-0"
                onClick={addEmail}
              >
                Keep Me Updated
              </IconButton>
            </Paper>
          )}
        </Grid>
      )}
    </Box>
  );
};