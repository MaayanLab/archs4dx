import { Grid, Box, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import pipeline from "../../../image/pipeline.png";
import archs4py from "../../../image/archs4py.png";
import archs4zoo from "../../../image/archs4zoo.png";
import natcom from "../../../image/naturecomm.png";
import data from "../../../data/config.json";
import { fontSize, styled } from "@mui/system";
import React, { useState } from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import { BarChart } from '@mui/x-charts/BarChart';
import GaugeChart from 'react-gauge-chart'

import { NewsFeed } from "./news-feed";
import { DonutCharts } from "./donut2";
import { addLabels, balanceSheet } from './netflixBalanceSheet';
import { keyframes } from "@mui/system";
import {Sun} from "./RotatingSun"


const Container = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#FAFAFA",
  [theme.breakpoints.up("sm")]: {
    "& .jumbotronText": {
      maxWidth: "100%",
      width: "94%",
      margin: "0px auto",
    },
    "& .gridContainer": {
      minHeight: "550px",
    },
    "& .gridItem": {
      display: "none",
    },
    "& .headerTitle": {
      fontSize: "30px",
    },
    "& .headerSubtitle": {
      fontSize: "16px",
    },
    "& .headerAbout": {
      fontSize: "16px",
    },
  },
}));

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


export const Jumbotron = () => {
  const [email, setEmail] = useState('');

  const addEmail = () => {
    console.log(`Email submitted: ${email}`);
    setEmail('');
  };

  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{
        position: "relative",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Grid
        container
        sx={{
          marginTop: "0",
          height: "100%",
          display: "flex",
          minHeight: "460px",
          alignContent: "center",
          boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)' // Inset shadow at the bottom
        }}
      >

        <Grid
          item
          xs={0}
          lg={0}
          sx={{
            minHeight: "460px",
            position: "relative",
          }}
          className="gridItem"
        >
        </Grid>

        <Grid
          item
          xs={12}
          lg={12}
          sx={{
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        >
          <Box
            sx={{ maxWidth: "900px", marginTop: "20px" }}
            className="jumbotronText"
          >
            <Typography variant="subtitle2" className="headerTitle"
              sx={{
                textAlign: "center",
                fontSize: " 30px",
                lineHeight: "32px",
                letterSpacing: "0px",
                marginBottom: "20px",
                marginTop: "30px"
              }}
            >
              ARCHS4: Massive Mining of Publicly Available RNA-seq Data from Human and Mouse
            </Typography>

            <Box
              sx={{
                zIndex: "2",
                maxHeight: '320px', // Set explicit height as needed
                overflow: 'hidden', // Prevents overflow when resizing
              }}
            >

              <object data="pipeline.svg" type="image/svg+xml" id="fadeInObject"
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '300px',
                  opacity: 1,
                  transition: 'opacity 2s ease-in-out',
                }}
              ></object>
            </Box>

            <Typography
              className="headerSubtitle"
              sx={{
                textAlign: "center",
                fontSize: " 24px",
                lineHeight: "32px",
                letterSpacing: "0px",
                marginBottom: "20px",
              }}
            >
              Machine learning ready RNA-seq data from publically available gene expression repositories.
            </Typography>

            <Typography
              className="headerAbout"
              sx={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "20px",
                letterSpacing: " 0.15px",
              }}
            >


              <AnimatedButton
                type="button"
                className="btn btn-info"
                onClick={() => window.location.href = 'data.html'}
                style={{
                  width: "300px", fontSize: "16px", height: "40px", backgroundColor: "#5bc0de", color: "white",
                  border: "1px solid transparent",
                  borderRadius: "5px", fontweight: "800",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
                id="animation-target"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#48a9c7"} // Hover color
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#5bc0de"}
                sx={{
                  backgroundColor: "#5bc0de"
                }}
              >
                Get Started
              </AnimatedButton>

            </Typography>

              <Grid Container xs={12} sx={{ display: "flex", marginY: "40px", alignItems: 'stretch'}}>
                <Grid item xs={6} sm={7} lg={7} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography  variant="body1" component="div">
                  <h2>About</h2>
                  All RNA-seq and ChIP-seq sample and signature search (ARCHS4) (https://maayanlab.cloud/archs4/) is a resource that provides access to gene and transcript counts uniformly processed from all human and mouse RNA-seq experiments from the
                  <a href="https://www.ncbi.nlm.nih.gov/geo/" target="_blank"> Gene Expression Omnibus (GEO) </a>
                  and the
                  <a href="https://www.ncbi.nlm.nih.gov/sra" target="_blank"> Sequence Read Archive (SRA) </a>
                  . The ARCHS4 website provides the uniformly processed data for download and programmatic access in H5 format, and as a 3-dimensional interactive viewer and search engine. Users can search and browse the data by metadata enhanced annotations, and can submit their own gene sets for search. Subsets of selected samples can be downloaded as a tab delimited text file that is ready for loading into the R programming environment. To generate the ARCHS4 resource, the kallisto aligner is applied in an efficient parallelized cloud infrastructure. Human and mouse samples are aligned against GRCh38 and GRCm39 with Ensembl annotation (Ensembl 107).
                  <br /><br />
                  Please acknowledge ARCHS4 in your publications by citing the following reference:<br />
                  Lachmann A, Torre D, Keenan AB, Jagodnik KM, Lee HJ, Wang L, Silverstein MC, Ma’ayan A. Massive mining of publicly available RNA-seq data from human and mouse. Nature Communications 9. Article number: 1366 (2018), doi:10.1038/s41467-018-03751-6

                  <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank"> <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>

                    <img
                      src={natcom}
                      alt="natcom"
                      style={{ width: "100px", height: "auto" }}
                    />

                  </a>
                  </Typography>
                </Grid>
                <Grid  item xs={6} sm={5} md={5} sx={{ marginLeft: "14px",  flex: 1, display: 'flex', flexDirection: 'column' }}><h2>News</h2>
                  <Grid component={Paper} elevation={3} sx={{ marginTop: "0px", flexDirection: 'column' }}>
                    <NewsFeed />
                  </Grid>
                </Grid>
              </Grid>

          </Box>
        </Grid>


        <Grid containter sx={{ backgroundImage: 'url(congruent_pentagon2.png)', display: 'flex',
                                flexWrap: 'wrap', // Allow wrapping on smaller screens
                                justifyContent: 'space-between',
                                padding: "20px"
                                }}>

          <Grid item lg={4} md={6} sm={12}>
            <Paper sx={{ margin: "20px", padding: "20px",
              transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition
              '&:hover': {
                transform: 'translateY(-5px)', // Lift effect
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', // Shadow for depth
              },
            }}>
              <Grid container>
                <Grid item className="rightsLogo">
                  <Typography
                    className="headerSubtitle"
                    sx={{
                      fontSize: "15px",
                      lineHeight: "18px",
                      letterSpacing: "0px",
                      marginBottom: "20px",
                    }}
                  >
                    If you would like to receive updates on the ARCHS4 data and stay informed
                    about new data releases consider signing up for the newsletter.
                  </Typography>
                </Grid>
                <Grid item sx={{
                  display: 'flex',
                  width: "100%"
                }}>
                  <form
                    className="form-inline my-2 my-lg-0"
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
              </Grid>
            </Paper>
          </Grid>

          <Grid item lg={4} md={6} sm={12}>
            

          <Paper sx={{ margin: "20px", padding: "20px",
            transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition
            '&:hover': {
              transform: 'translateY(-5px)', // Lift effect
              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', // Shadow for depth
            },
          }}>
            <Box sx={{ overflow: "hidden" }}>
              <Box
                component="a"
                href="https://github.com/MaayanLab/archs4py"
                sx={{
                  float: "left",
                  marginRight: "10px",
                  marginBottom: "0px",
                  width: "140px",
                }}
              >
                <img
                  src={archs4py}
                  alt="logo"
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
              <Typography
                className="headerSubtitle"
                sx={{
                  fontSize: "15px",
                  lineHeight: "18px",
                  letterSpacing: "0px",
                }}
              >
                The ARCHS4 now comes with an official Python package to facilitate extraction of data from
                the H5 files. It also supports some convenience functions such as normalization and meta data
                search. The software can be installed using pip.
                Visit the GitHub page for full documentation at the <a href="https://github.com/MaayanLab/archs4py">ARCHS4py GitHub page</a>.
              </Typography>
            </Box>
          </Paper>


          </Grid>

          <Grid item lg={4} md={6} sm={12}>
            

          <Paper sx={{ margin: "20px", padding: "20px",
            transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition
            '&:hover': {
              transform: 'translateY(-5px)', // Lift effect
              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', // Shadow for depth
            },

          }}>
            <Box sx={{ overflow: "hidden" }}>
              <Box
                component="a"
                href="/archs4zoo"
                sx={{
                  float: "left",
                  marginRight: "10px",
                  marginBottom: "0px",
                  width: "140px",
                }}
              >
                <img
                  src={archs4zoo}
                  alt="logo"
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
              <Typography
                className="headerSubtitle"
                sx={{
                  fontSize: "15px",
                  lineHeight: "18px",
                  letterSpacing: "0px",
                }}
              >
              The ARCHS4 database now includes 35000 samples from additional species, such as C. elegans
                and Drosophila melanogaster. Expression data for genes and transcripts can be downloaded in H5 format from the
                <a href="/archs4zoo"> ARCHS4 Zoo download section</a>.
              
              </Typography>
            </Box>
          </Paper>

          </Grid>

        <Paper sx={{
            height: "460px",
            width: "100%",
            margin: "20px"}}>
          <Grid item xs={12} sx={{
            height: "400px",
            padding: "20px"
          }}>
            <Grid container>
              <Grid item xs={12} sx={{
                backgroundColor: "green",
                height: "400px",
              }}>
                <iframe src="/heatmap.html" style={{
                  width: "100%",
                  height: "100%",
                  border: "none"
                }}></iframe>
              </Grid>
            </Grid>

          </Grid>
              <Typography sx={{textAlign: "center", marginTop: "27px"}}>
              Gene lookups 8,536,936 | Bulk file downloads 11,619 | Sample search downloads 8,146
              </Typography>

          </Paper>
        
        

          <Grid item xs={12} sx={{
            textAlign: "center",
            marginBottom: "50px",
            marginTop: "50px"
          }}>
            <DonutCharts xs={12}></DonutCharts>
          </Grid>

          <Grid container xs={12} sx={{
            display: 'flex', // Use flexbox layout
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            textAlign: 'center',
            marginBottom: "40px"
             // Ensure the container has enough height to center vertically, adjust as needed
          }}>
            
            <Grid item sm={12} md={8} lg={9}>
              <h2>Pipeline activity</h2>
              <BarChart
                dataset={balanceSheet}
                series={addLabels([
                  { dataKey: 'success', stack: 'processed', size: "16px" },
                  { dataKey: 'failed', stack: 'processed' },
                  { dataKey: 'pending', stack: 'pending' },
                ])}
                xAxis={[{ scaleType: 'band', dataKey: 'year', label: ""}]}
                slotProps={{ fontSize: 24, legend: { hidden: false, style: { fontSize: '14px' }  } }}
                
                height={300}
                borderRadius={3}
                yAxis={[{label: 'Count'}]}
                sx={{width: "100%","& .MuiChartsAxis-tickLabel": {marginTop: "-20px !important"}, "& .MuiChartsLegend-series text": {fontSize: "1.6em !important" }, }}
              />
            </Grid>
            <Grid item sm={12} md={4} lg={3}>
            <Grid container spacing={4}>
              <Grid item xs={6}  sm={6} md={12}  lg={12} sx={{verticalAlign: "center"}}>
                <Paper sx={{display: "flex", padding: "10px", width: "100%"}}>
                <div style={{ width: '100px', height: '100px', marginLeft: "10px", marginRight: "10px"}}>
                  <Sun  style={{ width: '80%', height: '80%' }} />
                </div>     
                <Typography sx={{marginLeft: "10px", textAlign: "left", verticalAlign: "center", marginLeft: "20px"}}>
                  <b>Pipeline active</b>
                  <br/>
                  vCPUs: 12
                  <br/>
                  vMemory: 64
                </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={6}  md={12} lg={12} sx={{display: "flex", width: "100%", height: "100%"}}>
                <Paper sx={{display: "flex", padding: "10px", width: "100%" , textAlign: "left"}}>
                <GaugeChart id="gauge-chart2" 
                  nrOfLevels={20} 
                  percent={0.2}
                  textColor={"black"}
                  hideText={"true"}
                  sx={{width: "50px", marginLeft: "-20px"}}
                  style={{width: "160px", marginLeft: "-20px", marginRight: "0px"}} 
                />
                <Typography>
                  <b>Current Cost</b> <br/>
                  avg $/fastq: ~$0.0052 
                </Typography>
                </Paper>
              </Grid>
            </Grid>
            </Grid>
          </Grid>
        </Grid>
        </Grid>

    </Container>
  );
};
