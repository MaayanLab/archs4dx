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
import { useParams } from 'react-router-dom';
import { GeneInfo } from "./components/geneinfo";
import { PrismExp } from "./components/prismexp";

import prismexp from "../../image/prismexp.png";
import { Dendrogram } from "./components/dendrogram";
import { DendrogramAtlas } from "./components/dendrogramatlas";
import { GeneCorrelation } from "./components/genecorrelation";

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


export const GenePage = () => {

    const [open, setOpen] = useState(false);
    const { geneName } = useParams();
    const [hasUserId, setHasUserId] = useState(false);
    

    const writeLog = async () => {
      try {
        const response = await fetch('https://archs4.org/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "category": "genesearch", "entry": geneName }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error writing log:', error);
      }
    };


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
      writeLog();
      checkUserId();
    }, []);

    return (
        <>
          <Helmet>
            <title>{data.general.project_title}</title>
            <link rel="icon" type="image/png" href={data.general.project_icon} />
            
            <meta name="description" content={`Gene page for ${geneName}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="ARCHS4 gene page" />
            <meta name="twitter:description" content="ARCHS4 gene pages provide gene annotations, a comprehensive tissue expression atlas, and tissue specific gene correlations." />
            <meta name="twitter:image" content="https://yourwebsite.com/path-to-your-subpage-image.jpg" />

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
                marginBottom: "0px", 
                padding: "40px"

            }}>
            <GeneInfo geneName={geneName}/>
            </Paper>

            <Paper sx={{
                margin: "40px",
                marginBottom: "0px", 
                padding: "40px"

            }}>
            <GeneCorrelation geneName={geneName}/>
            </Paper>

            <Paper sx={{
                margin: "40px",
                marginBottom: "0px", 
                padding: "20px",

            }}>
                <Grid container sx={{justifyContent: "center"}}>
                    <Grid item lg={12} xl={6} sx={{textAlign: "center", marginBottom: "20px"}}>
                        <h2 id="tissueexpression">Tissue expression</h2>
                        <DendrogramAtlas gene={geneName} species="human" type="tissue"/>
                    </Grid>

                    <Grid item lg={12} xl={6} sx={{textAlign: "center"}}>
                        <h2 id="celllineexpression">Cell line expression</h2>
                        <DendrogramAtlas gene={geneName} species="human" type="cellline"/>
                    </Grid>
                
                </Grid>
            </Paper>

            <Paper sx={{
                margin: "40px",
                padding: "40px",

            }}>

            <div style={{marginBottom: "30px", display: 'flex',}}>
                <div>
                    <Box
                        component="img"
                        src={prismexp}
                        alt="prismexp"
                        sx={{
                        width: {
                            xs: '100px',
                            marginRight: '30px'
                        },
                        transition: 'width 0.3s ease-in-out', 
                        }}
                    />
                </div>
                
                <div>
                    <h2>PrismExp gene annotation predictions</h2>
                    The gene annotations below have been generated using PrismExp. PrismExp uses unbiased high throughput gene coexpression information from multiple cellular contexts to build a gene annotation prediction model. More information about the method can be found at <a href="https://maayanlab.cloud/prismexp/g/SOX2" target="_blank">https://maayanlab.cloud/prismexp</a>.
                </div>
            </div>
            <PrismExp geneSymbol={geneName}/>
            </Paper>

            

            </Box>
            
          <FooterSection />
        </>
      );
}