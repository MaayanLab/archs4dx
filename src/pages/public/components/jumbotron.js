import { Grid, Box, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import pipeline from "../../../image/pipeline.png";
import archs4py from "../../../image/archs4py.png";
import archs4r from "../../../image/archs4r.png";
import archs4zoo from "../../../image/archs4zoo.png";
import natcom from "../../../image/naturecomm.png";
import data from "../../../data/config.json";
import { styled, keyframes as muiKeyframes } from "@mui/system";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tooltip } from "@mui/material";

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import { BarChart } from '@mui/x-charts/BarChart';
import GaugeChart from 'react-gauge-chart';
import Skeleton from '@mui/material/Skeleton';

import { NewsFeed } from "./news-feed";
import { DonutCharts } from "./donut2";
import { PipelineStatusChart } from "./recentbarchart.js";
import { Sun } from "./RotatingSun";
import moon from "../../../image/moonsleeping.svg";
import tasktime from "../../../image/checklist.svg";
import './fade.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faMemory, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

import { LetterSignup } from "../../../layout/newslettersignup";

import Menu from '@mui/material/Menu';
import { useMediaQuery } from '@mui/material';

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

const MButton = styled(Button)(({ theme }) => ({
  transition: 'color 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#0F7F90',
  },
}));

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

const translations = {
  pending: 'Pending',
  success: 'Processed',
  failed: 'Failed',
};

function addLabels(series) {
  return series.map((item) => ({
    ...item,
    label: translations[item.dataKey],
    valueFormatter: (v) => (v ? `${v.toLocaleString()}` : '-'),
  }));
}

const AnimatedButton = styled("button")`
  animation: ${animation} 1000ms linear both;
`;

export const Jumbotron = () => {
  const [jobQueue, setJobQueue] = useState([]);
  const [logStats, setLogStats] = useState({ download: 0, download_custom: 0, genesearch: 0 });
  const [logTasks, setLogTasks] = useState({
    "pipeline/packaging_human_gene": { date: "2025-01-21 22:56:10.753990", entry: "complete" },
    "pipeline/packaging_human_transcript": { date: "2025-01-21 22:55:46.813525", entry: "complete" },
    "pipeline/packaging_mouse_gene": { date: "2025-01-21 22:56:01.305827", entry: "complete" },
    "pipeline/packaging_mouse_transcript": { date: "2025-01-21 22:55:54.521404", entry: "complete" },
    "pipeline/samplediscovery": { date: "2025-01-21 22:55:23.484645", entry: "234" },
  });
  const [pipelineOverview, setPipelineOverview] = useState({});
  const [pipelineStatus, setPipelineStatus] = useState([]);
  const itemRefs = useRef([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const callbackFunction = useCallback(entries => {
    entries.forEach(entry => {
      const target = entry.target;
      if (entry.isIntersecting) {
        target.classList.add('visible');
      }
    });
  }, []);

  const taskOrder = [
    'pipeline/samplediscovery',
    'pipeline/packaging_human_gene',
    'pipeline/packaging_human_transcript',
    'pipeline/packaging_mouse_gene',
    'pipeline/packaging_mouse_transcript',
  ];

  const taskDisplayMap = {
    'pipeline/samplediscovery': 'Sample Discovery',
    'pipeline/packaging_human_gene': 'Human Gene',
    'pipeline/packaging_human_transcript': 'Human Transcript',
    'pipeline/packaging_mouse_gene': 'Mouse Gene',
    'pipeline/packaging_mouse_transcript': 'Mouse Transcript',
  };

  useEffect(() => {
    const fetchJobQueueStats = async () => {
      try {
        const response = await fetch('https://archs4.org/api/pipeline/jobqueue');
        if (!response.ok) {
          throw new Error('Could not load job queue');
        }
        const data = await response.json();
        setJobQueue(data["jobs"]);
      } catch (error) {
        console.error('Error fetching job queue:', error);
      }
    };

    const fetchPipelineOverview = async () => {
      try {
        const response = await fetch('https://archs4.org/api/pipeline/overview');
        if (!response.ok) {
          throw new Error('Could not load overview');
        }
        const data = await response.json();
        setPipelineOverview(data["status"]);
      } catch (error) {
        console.error('Error fetching pipeline overview:', error);
      }
    };

    const fetchTaskLog = async () => {
      try {
        const response = await fetch('https://archs4.org/api/log/pipeline/tasks');
        if (!response.ok) {
          throw new Error('Could not load tasks');
        }
        const data = await response.json();
        setLogTasks(data["log"]);
      } catch (error) {
        console.error('Error fetching task log:', error);
      }
    };

    const fetchPipelineStats = async () => {
      try {
        const response = await fetch('https://archs4.org/api/pipeline/status');
        if (!response.ok) {
          throw new Error('Could not load pipeline status');
        }
        const data = await response.json();
        setPipelineStatus(data["status"]);
      } catch (error) {
        console.error('Error fetching pipeline status:', error);
      }
    };

    const fetchLogStats = async () => {
      try {
        const response = await fetch('https://archs4.org/api/log/categorycounts');
        if (!response.ok) {
          throw new Error('Could not load log stats');
        }
        const data = await response.json();
        setLogStats(data["counts"]);
      } catch (error) {
        console.error('Error fetching log stats:', error);
      }
    };

    fetchJobQueueStats();
    fetchPipelineStats();
    fetchLogStats();
    fetchTaskLog();
    fetchPipelineOverview();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, {
      threshold: 0.1,
    });

    itemRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [callbackFunction]);

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
          boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
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
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{ maxWidth: "900px", marginTop: "20px" }}
            className="jumbotronText"
          >
            <Typography
              variant="subtitle2"
              className="headerTitle"
              sx={{
                textAlign: "center",
                fontSize: "30px",
                lineHeight: "32px",
                letterSpacing: "0px",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              ARCHS4: Massive Mining of Publicly Available RNA-seq Data from Human and Mouse
            </Typography>

            <Box
              sx={{
                zIndex: "2",
                maxHeight: '320px',
                overflow: 'hidden',
              }}
            >
              <object
                data="pipeline.svg"
                type="image/svg+xml"
                id="fadeInObject"
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
              className="headerAbout"
              sx={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "20px",
                letterSpacing: "0.15px",
              }}
            >
              <AnimatedButton
                type="button"
                className="btn btn-info"
                onClick={() => window.location.href = 'data'}
                style={{
                  width: "300px",
                  fontSize: "16px",
                  height: "40px",
                  backgroundColor: "#5bc0de",
                  color: "white",
                  border: "1px solid transparent",
                  borderRadius: "5px",
                  fontWeight: "800",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                id="animation-target"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#48a9c7"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#5bc0de"}
                sx={{
                  backgroundColor: "#5bc0de",
                }}
              >
                Get Started
              </AnimatedButton>
            </Typography>

            <Grid container spacing={2} sx={{ marginY: '40px' }}>
              <Grid item xs={12} md={7}>
                <Typography variant="body1" component="div" sx={{ margin: { xs: "6px", sm: "10px" } }}>
                  <h2>About</h2>
                  All RNA-seq and ChIP-seq sample and signature search (ARCHS4) is a resource that provides access to gene and transcript counts uniformly processed from all human and mouse RNA-seq experiments from 
                  the <a href="https://www.ncbi.nlm.nih.gov/geo/" target="_blank">Gene Expression Omnibus (GEO)</a> and 
                  the <a href="https://www.ncbi.nlm.nih.gov/sra" target="_blank">Sequence Read Archive (SRA)</a>. The 
                  ARCHS4 website provides uniformly processed data for download and programmatic access in H5 format and as a 3-dimensional interactive viewer and search engine. Users can search and browse the data by metadata-enhanced annotations, and can submit their own gene sets for search. Subsets of selected samples can be downloaded as a tab-delimited text file that is ready for loading into the R programming environment. To generate the ARCHS4 resource, the <a href="https://pachterlab.github.io/kallisto/about" target="_blank">Kallisto aligner</a> is applied in an efficient parallelized cloud infrastructure. Human and mouse samples are aligned against GRCh38 and GRCm39 with Ensembl annotation (Ensembl 107). The ARCHS4 database now includes 35000 samples from additional species, such as C. elegans and Drosophila melanogaster. Expression data for genes and transcripts can be downloaded in H5 format from the <a href="https://archs4.org/zoo">ARCHS4 Zoo</a> download section.

                  <br/><br/>
                  The ARCHS4py Python package provides functions to facilitate data extraction from the H5 files. It also supports some convenience functions such as normalization and metadata search. The software can be installed using pip. Visit the GitHub page for full documentation at the <a href="https://github.com/MaayanLab/archs4py"> ARCHS4py GitHub page</a>.
                  
                  <br /><br />
                  Please acknowledge ARCHS4 in your publications by citing the following reference:<br />
                  Lachmann A, Torre D, Keenan AB, et al. Massive mining of publicly available RNA-seq data from human and mouse. Nature Communications 9. Article number: 1366 (2018), doi:10.1038/s41467-018-03751-6

                  <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank" style={{ marginLeft: "5px" }}> 
                    <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                    <img
                      src={natcom}
                      alt="natcom"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </a>
                </Typography>
              </Grid>

              <Grid item xs={12} md={5}>
                <h2 style={{ margin: { xs: "8px", sm: "10px" } }}>News</h2>
                <Paper elevation={3} sx={{ padding: '10px' }}>
                  <NewsFeed />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          container
          sx={{ 
            backgroundImage: 'url(congruent_pentagon2.png)', 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: "20px",
          }}
        >
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <GlowingPaper 
              key={0}
              ref={el => (itemRefs.current[0] = el)}
              className="fade-in"
              sx={{
                margin: { sm: "5px", md: "20px" },
                padding: "20px",
              }}
            >
              <LetterSignup />
            </GlowingPaper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper 
              key={2}
              ref={el => (itemRefs.current[2] = el)}
              className="fade-in"
              sx={{ 
                margin: { sm: "5px", md: "20px" }, 
                marginTop: "20px !important", 
                marginBottom: "20px !important", 
                padding: "20px",
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Box sx={{ overflow: "hidden" }}>
                <Box
                  component="a"
                  href="/zoo"
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
                  The ARCHS4 database now includes 35,000 samples from additional species, such as C. elegans
                  and D. melanogaster. Expression data for genes and transcripts can be downloaded in H5 format from the
                  <a href="/zoo"> ARCHS4 Zoo download section</a>.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper 
              key={3}
              ref={el => (itemRefs.current[3] = el)}
              className="fade-in"
              sx={{ 
                margin: { sm: "5px", md: "20px" }, 
                marginTop: "20px !important", 
                padding: "20px",
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Box sx={{ overflow: "hidden" }}>
                <Box
                  component="a"
                  href="https://github.com/MaayanLab/archs4r"
                  sx={{
                    float: "left",
                    marginRight: "10px",
                    marginBottom: "0px",
                    width: "140px",
                  }}
                >
                  <img
                    src={archs4r}
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
                  The ARCHS4 now comes with an official R package to facilitate extraction of data from
                  the H5 files. It also supports some convenience functions such as normalization and metadata
                  search. The software can be installed using pip.
                  Visit the GitHub page for full documentation at the <a href="https://github.com/MaayanLab/archs4r">ARCHS4r GitHub page</a>.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Paper 
              key={4}
              ref={el => (itemRefs.current[4] = el)}
              className="fade-in"
              sx={{ 
                margin: { sm: "5px", md: "20px" }, 
                marginTop: "20px !important", 
                padding: "20px",
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
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
                  the H5 files. It also supports some convenience functions such as normalization and metadata
                  search. The software can be installed using pip.
                  Visit the GitHub page for full documentation at the <a href="https://github.com/MaayanLab/archs4py">ARCHS4py GitHub page</a>.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Paper 
            key={5}
            ref={el => (itemRefs.current[5] = el)}
            className="fade-in"
            sx={{
              width: "100%",
              margin: { sm: "5px", md: "20px" },
              marginTop: "30px !important",
              minHeight: "460px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid 
              item 
              xs={12} 
              sx={{
                flex: "1 0 auto",
                padding: "0px",
              }}
            >
              <Grid container>
                <Grid 
                  item 
                  xs={12} 
                  sx={{
                    height: "400px",
                  }}
                >
                  <iframe 
                    src="/heatmap.html" 
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  ></iframe>
                </Grid>
              </Grid>

              <Typography 
                component="div"
                sx={{
                  textAlign: "center",
                  marginTop: "27px",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: "4px", sm: "8px" },
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span><b>Gene lookups</b> {logStats["genesearch"] + 9232056}</span>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>|</Box>
                <span><b>Bulk file downloads</b> {logStats["download"] + 11892}</span>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>|</Box>
                <span><b>Sample search downloads</b> {logStats["metadownload"] + 9344}</span>
              </Typography>
            </Grid>
          </Paper>

          <Grid 
            container 
            xs={12} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center',
              marginBottom: "40px",
              margin: { sm: "5px", md: "20px" },
            }}
          >
            <Grid 
              item 
              xs={12}
              md={8}
              lg={9}
            >
              <h2>Pipeline Activity</h2>
              {Array.isArray(jobQueue) && jobQueue.length > 0 ? (
                <BarChart
                  dataset={jobQueue}
                  series={addLabels([
                    { dataKey: 'success', stack: 'processed', size: "16px" },
                    { dataKey: 'failed', stack: 'processed' },
                    { dataKey: 'pending', stack: 'pending' },
                  ])}
                  xAxis={[{ scaleType: 'band', dataKey: 'year', label: "" }]}
                  slotProps={{
                    fontSize: 10,
                    legend: {
                      hidden: false,
                      direction: 'column',
                      position: isSmallScreen ? { vertical: 'middle', horizontal: 'right' } : { vertical: 'top', horizontal: 'right' },
                      padding: 0,
                    },
                  }}
                  height={300}
                  borderRadius={3}
                  yAxis={[{ 
                    label: 'Count', 
                    labelStyle: { 
                      transform: 'translateX(-70px) rotate(-90deg)', 
                      transformOrigin: 'left center',
                    },
                  }]}
                  margin={isSmallScreen 
                    ? { left: 50, right: 20, top: 30, bottom: 30 }
                    : { left: 100, right: 80, top: 50, bottom: 50 }}
                  sx={{ 
                    width: "60%", 
                    "& .MuiChartsAxis-tickLabel": { marginTop: "60px !important" }, 
                    "& .MuiChartsLegend-series text": {
                      fontSize: "1.0em !important",
                      marginBottom: "20px !important",
                    },
                  }}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ margin: "40px" }} />
              )}
            </Grid>

            <Grid 
              item 
              xs={12}
              md={4}
              lg={3}
            >
              <Grid 
                container 
                spacing={2} 
                sx={{ 
                  alignItems: { sm: 'stretch' },
                }}
              >
                <Grid 
                  item 
                  xs={12}
                  sm={6}
                  md={12}
                >
                  <Paper 
                    sx={{ 
                      display: "flex", 
                      padding: "10px", 
                      width: "100%", 
                      height: { sm: '100%' },
                    }}
                  >
                    <div style={{ width: '100px', height: '100px', marginLeft: "10px", marginRight: "10px" }}>
                      {pipelineStatus > 0 ? (
                        <Sun style={{ width: '80%', height: '80%' }} />
                      ) : (
                        <Tooltip title={"While I am waiting I might just as well take a nap."} arrow>
                          <img
                            style={{ width: '80%', height: '80%', marginTop: "10px" }}
                            src={moon}
                            alt="sleeping"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <Typography sx={{ marginLeft: "10px", textAlign: "left", verticalAlign: "center", marginLeft: "20px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        {pipelineStatus > 0 ? <b>Pipeline active</b> : <b>Pipeline sleeping</b>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <FontAwesomeIcon icon={faMicrochip} style={{ marginRight: "12px" }} />
                        <span style={{ marginRight: "26px" }}>vCPUs:</span> {Math.round(pipelineStatus / 1024)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faMemory} style={{ marginRight: "10px" }} />
                        <span style={{ marginRight: "6px" }}>vMemory:</span> {Math.round(pipelineStatus * 4 / 1024)} GB
                      </div>
                    </Typography>
                  </Paper>
                </Grid>

                <Grid 
                  item 
                  xs={12}
                  sm={6}
                  md={12}
                >
                  <Paper 
                    sx={{ 
                      display: "flex", 
                      padding: "10px", 
                      width: "100%", 
                      textAlign: "left",
                      height: { sm: '100%' },
                    }}
                  >
                    <GaugeChart 
                      id="gauge-chart2" 
                      nrOfLevels={20} 
                      percent={0.2}
                      textColor={"black"}
                      hideText={true}
                      style={{ width: "110px", marginLeft: "6px", marginRight: "25px" }} 
                    />
                    <Typography>
                      <b>Current Cost</b> <br />
                      avg $/fastq: ~$0.0052 
                    </Typography>
                  </Paper>
                </Grid>

                <Grid 
                  item 
                  xs={12}
                  md={12}
                >
                  <Paper sx={{ display: "flex", padding: "10px", width: "100%", textAlign: "left", zIndex: 0 }}>
                    <img
                      style={{ width: '70px', marginTop: "10px", marginLeft: "30px", marginRight: "40px" }}
                      src={tasktime}
                      alt="lasttask"
                    />
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        justifyContent: 'space-between',
                      }}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <MButton
                        variant="text"
                        className="intraButton mbutton"
                        id="basic-button"
                        aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={isMenuOpen ? faCaretUp : faCaretDown} style={{ marginRight: '6px' }} />
                        Task History
                      </MButton>
                    </Box>
                    
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleCloseMenu}
                      MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                      PaperProps={{
                        sx: {
                          display: 'flex',
                          flexDirection: 'row',
                          width: '380px',
                          padding: 2,
                          maxHeight: '80vh',
                        },
                      }}
                    >
                      <Box sx={{ paddingLeft: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: "-12px" }}>
                        <Typography variant="subtitle2" sx={{ fontSize: "22px" }} gutterBottom>
                          ARCHS4 Task History
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 2 }}>
                        {logTasks ? (
                          <>
                            <Box>
                              {taskOrder.map((taskKey) => {
                                const task = logTasks[taskKey];
                                if (!task) return null;
                                return (
                                  <Box key={taskKey} sx={{ mb: 1.5 }}>
                                    <Typography variant="body1">
                                      <strong>{taskDisplayMap[taskKey]}:</strong> {task.entry}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(task.date).toLocaleString()}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                            {pipelineOverview && (
                              <Box sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ fontSize: "22px" }}>
                                  Pipeline Overview
                                </Typography>
                                <Typography variant="body1"><strong>Waiting:</strong> {pipelineOverview.waiting}</Typography>
                                <Typography variant="body1"><strong>Submitted:</strong> {pipelineOverview.submitted}</Typography>
                                <Typography variant="body1"><strong>Completed:</strong> {pipelineOverview.completed}</Typography>
                                <Typography variant="body1"><strong>Failed:</strong> {pipelineOverview.failed}</Typography>
                              </Box>
                            )}
                          </>
                        ) : (
                          <Typography color="text.secondary">Loading task history...</Typography>
                        )}
                      </Box>
                      <PipelineStatusChart />
                    </Menu>
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