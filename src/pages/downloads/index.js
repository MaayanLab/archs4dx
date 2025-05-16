import React, { useCallback, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import MuiAppBar from "@mui/material/AppBar";
import { styled, keyframes as muiKeyframes } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import natcom from "../../image/naturecomm.png";
import { GeneCountSection } from "./components/genecounts";
import { NavBar } from "../../layout/navbar";
import { LetterSignup } from "../../layout/newslettersignup";

const drawerWidth = 344;

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

const animation = muiKeyframes`
  0% { transform: matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.4% { transform: matrix3d(0.658, 0, 0, 0, 0, 0.703, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.725, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { transform: matrix3d(0.83, 0, 0, 0, 0, 0.946, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.942, 0, 0, 0, 0, 1.084, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.21% { transform: matrix3d(0.971, 0, 0, 0, 0, 1.113, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.61% { transform: matrix3d(1.062, 0, 0, 0, 0, 1.166, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.07, 0, 0, 0, 0, 1.165, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.52% { transform: matrix3d(1.104, 0, 0, 0, 0, 1.12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.106, 0, 0, 0, 0, 1.094, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  21.32% { transform: matrix3d(1.098, 0, 0, 0, 0, 1.035, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.075, 0, 0, 0, 0, 0.98, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  25.23% { transform: matrix3d(1.067, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.03% { transform: matrix3d(1.031, 0, 0, 0, 0, 0.948, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.024, 0, 0, 0, 0, 0.949, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.99, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  36.74% { transform: matrix3d(0.986, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.98, 0, 0, 0, 0, 1.011, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  44.44% { transform: matrix3d(0.983, 0, 0, 0, 0, 1.016, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.996, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  59.86% { transform: matrix3d(1.003, 0, 0, 0, 0, 0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.004, 0, 0, 0, 0, 0.996, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.28% { transform: matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  90.69% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
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

// Define a styled component using MUI's styled function
const StyledLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  cursor: 'pointer',
  margin: '0 10px',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

const LinkContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

export const Downloads = () => {
  const [open, setOpen] = useState(false);
  const itemRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [hasUserId, setHasUserId] = useState(false);

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

  const scrollPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  const addEmail = () => {
    console.log(`Email submitted: ${email}`);
    setEmail('');
  };

  const toggle = () => {
    setOpen(!open);
  };

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
        {hasUserId ? (
          <AppBar position="fixed" open={open}>
            <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
          </AppBar>
        ) : (
          <AppBar position="fixed" open={open}>
            <NavBar />
          </AppBar>
        )}
        <div style={{ height: "90px" }}></div>
      </>

      <Box sx={{
        flex: '1 0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(congruent_pentagon2.png)',
        marginTop: "0px",
        boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
        minHeight: '80vh',
      }}>
        <Paper sx={{
          margin: "40px",
          padding: "40px"
        }}>
          <h2>ARCHS4 Downloads</h2>
          <br/>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                className="headerSubtitle"
                sx={{
                  fontSize: "15px",
                  lineHeight: "18px",
                  letterSpacing: "0px",
                }}
              >
                This section contains all files created for the ARCHS4 website. The methods are described at  
                <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank">
                  <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                  <img
                    src={natcom}
                    alt="natcom"
                    style={{ width: "100px", height: "auto" }}
                  />
                </a>. 
                For help in accessing the files refer to the Help section or contact us directly. 
                The database will be updated on a regular basis and old versions of the files will be accessible.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                className="headerSubtitle"
                sx={{
                  fontSize: "15px",
                  lineHeight: "18px",
                  letterSpacing: "0px",
                }}
              >
                If you would like to receive updates on the ARCHS4 data and stay informed
                about new data releases consider signing up for the newsletter.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', width: "100%" }}>
              
                <LetterSignup isGlowing={true} />

            </Grid>
            <Grid item xs={12}>
              <LinkContainer>
                <StyledLink onClick={() => scrollPage('exp_gene')}>Expression (gene level)</StyledLink> | 
                <StyledLink onClick={() => scrollPage('exp_trans')}>Expression (transcript level)</StyledLink> | 
                <StyledLink onClick={() => scrollPage('exp_tpm')}>TPM (transcript level)</StyledLink> | 
                <StyledLink onClick={() => scrollPage('exp_affy')}>Expression (Affymetrix arrays)</StyledLink> | 
                <StyledLink onClick={() => scrollPage('tsne_sample')}>t-SNE sample coordinates</StyledLink> | 
                <StyledLink onClick={() => scrollPage('tsne_gene')}>t-SNE gene coordinates</StyledLink> | 
                <StyledLink onClick={() => scrollPage('correlation_gene')}>Gene correlation</StyledLink> | 
                <StyledLink onClick={() => scrollPage('prismexp_pred')}>PrismExp predictions</StyledLink> | 
                <StyledLink onClick={() => scrollPage('jl_transform')}>JL transformed expression</StyledLink> | 
                <StyledLink onClick={() => scrollPage('kallisto_index')}>Kallisto index files</StyledLink> | 
                <StyledLink onClick={() => scrollPage('exp_geo')}>GEO expression</StyledLink> | 
                <StyledLink onClick={() => scrollPage('exp_recount')}>recount2 expression</StyledLink> | 
                <StyledLink onClick={() => scrollPage('github_rep')}>GitHub repository</StyledLink>
              </LinkContainer>
            </Grid>
          </Grid>
          <div style={{ marginTop: "50px" }} id="exp_gene">
            <GeneCountSection />
          </div>
        </Paper>
      </Box>
      <FooterSection />
    </>
  );
};