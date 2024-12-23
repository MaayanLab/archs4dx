import React, { useCallback, useState, useEffect, useRef } from "react";

import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";

import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";


import { keyframes} from "@mui/system";
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';

import natcom from "../../image/naturecomm.png";
import { GeneCountSection } from "./components/genecounts";
import { NavBar } from "../../layout/navbar";

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

    const [open, setOpen] = useState(false); // Assuming you have a state for the sidebar
    const itemRefs = useRef([]); // Create ref array for each element
    const [email, setEmail] = useState('');
    const [hasUserId, setHasUserId] = useState(false);

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

    const scrollPage = (id) => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop-100,
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
                    <Grid item columns={12}>
                        <Typography
                            className="headerSubtitle"
                            
                            sx={{
                            fontSize: "15px",
                            lineHeight: "18px",
                            letterSpacing: "0px",
                            }}
                        >
                            This section contains all files created for the ARCHS4 website. The methods are described at  
                            <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank"> <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
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
                    <Grid item md={6}>
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
                    <Grid item  md={6}
                    sx={{
                    display: 'flex',
                    width: "100%"
                    }}>
                    <form
                        className="form-inline"
                        style={{ paddingTop: '2px', width: '100%' }}
                        onSubmit={(e) => {
                        e.preventDefault();
                        addEmail();
                        }}
                    >

                        <Paper
                        component="form"
                        sx={{ display: 'flex', alignItems: 'center', width: "100%"}}
                        >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <LoyaltyIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Email Address"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />

                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton color="primary" aria-label="directions" sx={{
                            fontSize: "14px",
                            color: "black",
                            p: '10px' 
                            }}
                            className="btn btn-info my-2 my-sm-0"
                            type="button"
                            onClick={addEmail}
                        >
                            Keep Me Updated
                        </IconButton>
                        </Paper>
                    </form>
                    </Grid>

                    <Grid item>
                    <LinkContainer>
                        <StyledLink onClick={(e) => scrollPage('exp_gene')}>Expression (gene level)</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('exp_trans')}>Expression (transcript level)</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('exp_tpm')}>TPM (transcript level)</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('exp_affy')}>Expression (Affymetrix arrays)</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('tsne_sample')}>t-SNE sample coordinates</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('tsne_gene')}>t-SNE gene coordinates</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('correlation_gene')}>Gene correlation</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('prismexp_pred')}>PrismExp predictions</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('jl_transform')}>JL transformed expression</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('kallisto_index')}>Kallisto index files</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('exp_geo')}>GEO expression</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('exp_recount')}>recount2 expression</StyledLink> | 
                        <StyledLink onClick={(e) => scrollPage('github_rep')}>GitHub repository</StyledLink>
                    </LinkContainer>
                    </Grid>

                </Grid>

                <div style={{marginTop: "50px"}} id="exp_gene">
                    <GeneCountSection></GeneCountSection>
                </div>

            </Paper>
        </Box>

        <FooterSection />
    </>
  )
}
