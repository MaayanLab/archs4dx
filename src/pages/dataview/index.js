import React, { useCallback, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography, Button } from "@mui/material";
import { ScatterPlot } from './components/scatterplot';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CellList } from "./components/celllists";
import { CellLineList } from "./components/celllinelist";
import "./components/sidemenu.css";
import human_foot from "./../../image/human_foot.svg";
import mouse_foot from "./../../image/mouse_foot.svg";
import dnaicon from "./../../image/dna-black-icon2.svg";
import sampleicon from "./../../image/lab-icon.svg";
import { SignatureSearch } from "./components/signaturesearch";
import { DiffExpQuery } from "./components/diffgenesearch";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { NavBar } from "../../layout/navbar";
import { SigpyStatusCheck } from "../../layout/sigpystatus";
import { RegexSearchTab } from './components/regexwizard'; // Adjust path as needed

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, padding: "5px" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
`;

const AnimatedButton = styled("button")`
  animation: ${animation} 1000ms linear both;
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

export const DataView = () => {
  const textFieldRef = useRef(null);
  const [hasUserId, setHasUserId] = useState(false);
  const [open, setOpen] = useState(false);
  const itemRefs = useRef([]);
  const [species, setSpecies] = useState('human');
  const [sampleMode, setSampleMode] = useState('sample');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSearchResult, setNewSearchResult] = useState();
  const [newGeneSearchResult, setNewGeneSearchResult] = useState();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  useEffect(() => {
    setValue(sampleMode === "sample" ? 0 : 1);
  }, [sampleMode]);

  const handleSearchField = () => {
    const textFromTextField = textFieldRef.current ? textFieldRef.current.value : '';
    setSearchQuery(textFromTextField);
  };

  const updateSearchQueryFromCellList = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchField();
    }
  };

  const handleExampleClick = (example) => {
    setSearchTerm(example);
    setSearchQuery(example);
  };

  const handleSetSpecies = (sp) => {
    setSpecies(sp);
  };

  const handleSetSampleMode = (mode) => {
    setSampleMode(mode);
  };

  const scrollPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta name="description" content="ARCHS4" />
      </Helmet>

      {hasUserId ? (
        <AppBar position="fixed" open={open}>
          <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
        </AppBar>
      ) : (
        <AppBar position="fixed" open={open}>
          <NavBar />
        </AppBar>
      )}
      <div style={{ height: "90px" }} sx={{ width: "200px", height: "360px" }}></div>

      <Box
        sx={{
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundImage: 'url(congruent_pentagon2.png)',
          marginTop: '0px',
          boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
          minHeight: '80vh',
          gap: '12px'
        }}
      >
        <div style={{ width: "350px" }}>
          <Paper
            sx={{
              padding: '14px',
              marginTop: "40px",
              width: '340px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: "100px",
              gap: "12px",
            }}
          >
            <div
              className="scatterselection scatterselectionspecies"
              onClick={() => handleSetSpecies("human")}
              style={{
                backgroundColor: species === "human" ? "#1ebcbb" : "#dddddd",
                borderColor: species === "human" ? "black" : "#dddddd"
              }}
            >
              <img src={human_foot} style={{ height: "35px" }} />Human
            </div>
            <div
              className="scatterselection scatterselectionspecies"
              onClick={() => handleSetSpecies("mouse")}
              style={{
                backgroundColor: species === "mouse" ? "#1ebcbb" : "#dddddd",
                borderColor: species === "mouse" ? "black" : "#dddddd"
              }}
            >
              <img src={mouse_foot} style={{ height: "35px" }} />Mouse
            </div>
            <div
              className="scatterselection"
              onClick={() => handleSetSampleMode("sample")}
              style={{
                backgroundColor: sampleMode === "sample" ? "#ffb73a" : "#dddddd",
                borderColor: sampleMode === "sample" ? "black" : "#dddddd"
              }}
            >
              <img src={sampleicon} style={{ height: "35px" }} />Sample
            </div>
            <div
              className="scatterselection"
              onClick={() => handleSetSampleMode("gene")}
              style={{
                backgroundColor: sampleMode === "gene" ? "#ffb73a" : "#dddddd",
                borderColor: sampleMode === "gene" ? "black" : "#dddddd"
              }}
            >
              <img src={dnaicon} style={{ height: "35px" }} />Gene
            </div>
          </Paper>

          <Paper
            sx={{
              padding: '6px',
              marginTop: "20px",
              width: '340px',
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'left',
              marginBottom: "40px"
            }}
          >
            <div>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', fontSize: "10px" }}>
                <Tabs value={value} onChange={handleChange} aria-label="">
                  {sampleMode === "sample" ? (
                    <Tab
                      label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <EmojiObjectsIcon style={{ marginRight: 8 }} />
                          Meta
                        </div>
                      }
                      {...a11yProps(0)}
                    />
                  ) : (<></>)}
                  <Tab
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SignalCellularAltIcon style={{ marginRight: 8 }} />
                        {sampleMode === "sample" ? "Data" : "Marker Genes"}
                      </div>
                    }
                    {...a11yProps(1)}
                  />
                  <Tab
                    label={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SearchIcon style={{ marginRight: 8 }} />
                        Regex
                      </div>
                    }
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0} style={{ padding: "5px" }}>
                <div style={{ fontSize: "14px" }}>
                  Examples:<br />
                  {['GSE98386', 'GSM2679484', 'Macrophage', 'Neuron'].map((example, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ", "}
                      <a
                        style={{
                          color: '#007bff',
                          transition: 'color 0.3s',
                          textDecoration: 'none',
                          marginLeft: index === 0 ? '0' : '4px'
                        }}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExampleClick(example);
                        }}
                      >
                        {example}
                      </a>
                    </React.Fragment>
                  ))}
                </div>
                <Box
                  sx={{
                    flex: '1 0 auto',
                    display: 'flex',
                    gap: "6px",
                    flexDirection: 'row',
                  }}
                >
                  <TextField
                    variant="outlined"
                    placeholder="Search..."
                    fullWidth
                    value={searchTerm}
                    inputRef={textFieldRef}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <AnimatedButton
                    type="button"
                    className="btn btn-info"
                    onClick={() => handleSearchField()}
                    style={{
                      width: "120px",
                      fontSize: "14px",
                      height: "34px",
                      backgroundColor: "#5bc0de",
                      color: "white",
                      border: "1px solid transparent",
                      borderRadius: "5px",
                      fontWeight: "800",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    id="animation-target"
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#48a9c7"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#5bc0de"}
                  >
                    Search
                  </AnimatedButton>
                </Box>
                <CellList menuId="sidemenu" setSearchQuery={updateSearchQueryFromCellList} />
                <CellLineList species={species} menuId="sidemenu2" setSearchQuery={updateSearchQueryFromCellList} />
              </CustomTabPanel>
              {sampleMode === "sample" ? (
                <CustomTabPanel value={value} index={1}>
                  <SignatureSearch setNewSearchResult={setNewSearchResult} species={species} />
                </CustomTabPanel>
              ) : (
                <CustomTabPanel value={value} index={1}>
                  <DiffExpQuery setNewGeneSearchResult={setNewGeneSearchResult} species={species} />
                </CustomTabPanel>
              )}
              <CustomTabPanel value={value} index={2}>
                <RegexSearchTab species={species} setNewSearchResult={setNewSearchResult} />
              </CustomTabPanel>
            </div>
          </Paper>
        </div>

        <Paper
          sx={{
            marginTop: "40px",
            marginBottom: "40px",
            padding: '5px',
            width: '700px',
          }}
        >
          <br />
          <ScatterPlot
            sampleMode={sampleMode}
            speciesMode={species}
            query={searchQuery}
            newSearchResult={newSearchResult}
            newGeneSearchResult={newGeneSearchResult}
          />
        </Paper>
      </Box>

      <SigpyStatusCheck />
      <FooterSection />
    </>
  );
};