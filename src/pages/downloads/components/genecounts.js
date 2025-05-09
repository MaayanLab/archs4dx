import React, { useCallback, useState, useEffect} from "react";
import { Box, Grid, Chip, Tooltip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDna, faMessage } from '@fortawesome/free-solid-svg-icons';

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TagIcon from '@mui/icons-material/Tag';
import { keyframes} from "@mui/system";

import { RequestRole } from "../../dashboard/components/request-role";

import gtex from '../../../image/gtex.png';
import tcga from '../../../image/tcga.png';
import prismexp from '../../../image/prismexp.png';
import missingfile from '../../../image/missing_file.svg';

import GitHubIcon from '@mui/icons-material/GitHub';

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

export const GeneCountSection = () => {
    //const [version, setVersion] = useState('2.latest');
    const [versionList, setVersionList] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState('2.latest');
    const [versions, setVersions] = useState([]);
    const [files, setFiles] = useState([]);
    
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    useEffect(() => {
      const fetchVersionFiles = async () => {
          try {
              const response = await fetch('https://archs4.org/api/versionfile');
              const data = await response.json();
              setVersions(data.versionfiles);
              const uniqueVersions = [...new Set(
                data.versionfiles.map(file => `${file.version_major}.${file.version_minor}`)
              )];
              setVersionList(uniqueVersions.reverse());
              updateFiles(selectedVersion, data.versionfiles);
          } catch (error) {
              console.error('Error fetching version files:', error);
          }
      };
      
      fetchVersionFiles();
    }, []);

    const updateFiles = (version, allFiles) => {
      const filteredFiles = allFiles.reduce((acc, file) => {
          const fileVersion = `${file.version_major}.${file.version_minor}`;
          if (fileVersion === version) {
              const key = `${file.species}_${file.data_level}`;
              
              if (!acc[key]) {
                  acc[key] = file;
              } else {
                  const existingFileTimestamp = new Date(acc[key].timestamp);
                  const currentFileTimestamp = new Date(file.timestamp);
                  
                  if (currentFileTimestamp > existingFileTimestamp) {
                      acc[key] = file;
                  }
              }
          }
          return acc;
      }, {});
      
      setFiles(filteredFiles);
      console.log("filtered files", filteredFiles); // log the filtered result
  };

    const handleVersionChange = (event) => {
        const version = event.target.value;
        setSelectedVersion(version);
        updateFiles(version, versions);
    };

    const writeLog = async (event, category) => {
      try {
        const url = event.currentTarget.href;
        const filename = url.substring(url.lastIndexOf('/') + 1);

        const response = await fetch('https://archs4.org/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "category": category, "entry": filename }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error writing log:', error);
      }
    };

    const [isHovered, setIsHovered] = useState(false);
    
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    return(
    <>
        <Box sx={{
            height: 'flex',
            backgroundColor: '#cdffed',
            padding: '30px',
            borderRadius: '12px 12px 0px 0px',
            marginLeft: '-20px',
            marginRight: '-20px',
            position: 'relative',
            animation: `${animation} 1000ms linear both`
          }}>
            <Grid container spacing={2} >
              <Grid item>
                <h2>Gene-level Expression</h2>
              </Grid>
              <Grid item xs></Grid>
              <Grid item>
                <Chip color="primary" icon={<FontAwesomeIcon icon={faDna} />} label="Ensembl 107" />
              </Grid>
            
              <Grid item>
              <Chip color="secondary" icon={<SettingsBackupRestoreIcon />} label={`Version ${selectedVersion}`} />
              </Grid>
              
              

              <Grid item>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right' }}>
                  
                  <FormControl variant="outlined" size="small">
                    <InputLabel id="version-select-label">Version</InputLabel>
                    <Select
                      labelId="version-select-label"
                      value={selectedVersion}
                      onChange={handleVersionChange}
                      label="Version"
                      sx={{width: "110px"}}
                    >
                      {versionList.map((version) => (
                        <MenuItem key={version} value={version}>
                            {version}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              
              
              <Grid item>
                Expression files for mouse and human in HDF5 format. All gene counts are on gene level (Entrez Gene Symbol). For compression purposes, the Kallisto pseudocounts are rounded to integer values.
              </Grid>
      
              
                    <Grid item sx={{
                        marginTop: "10px",
                        marginLeft: "20px",
                        width: "340px",
                        '&:hover': {
                            borderRadius: "18px",
                            background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',
                            transition: 'background 12.3s ease-in-out',
                        },
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ marginBottom: "-20px", marginTop: "-10px" }}>
                                <h3>Human</h3>
                            </Grid>

                            {files['human_gene'] ? (
                                <Grid item key={files['human_gene'].id}>
                                    <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['human_gene'].species}_${files['human_gene'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                                        {`${files['human_gene'].species}_${files['human_gene'].data_level}_v${selectedVersion}.h5`}
                                    </a><br />
                                    <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                                    Date: {new Date(files['human_gene'].timestamp).toLocaleDateString()}<br/>
                                    Samples: {files['human_gene'].samples}<br />
                                    Size: {Math.round(files['human_gene'].file_size / (1024 * 1024 * 1024))} GB<br />
                                    </div>
                                    <Tooltip title={"SHA1 hash"} arrow>
                                        <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['human_gene'].checksum} sx={{
                                            marginLeft: "-15px",
                                            fontSize: "10px",
                                            maxWidth: 'none',
                                            overflow: 'visible',
                                            whiteSpace: 'nowrap'
                                        }} />
                                    </Tooltip>
                                </Grid>
                            ):(
                              <Grid item sx={{
                                  display: 'flex',
                                  alignItems: 'center', // Align items vertically center
                                  color: 'grey',
                                  marginTop: '10px', // Optional: adds some spacing from the top, if needed
                                  paddingBottom: "15px"
                              }}>
                                  <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                                  <span>File not available. Please try a different version.</span>
                              </Grid>
                            )}
                         </Grid>
                    </Grid>
      
              <Grid item  sx={{
                marginTop: "10px",
                marginLeft: "20px",
                '&:hover': {
                    borderRadius: "18px",
                    background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',  // Gradient effect
                    transition: 'background 12.3s ease-in-out',  // Smooth transition
                  },
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{marginBottom: "-20px", marginTop: "-10px"}}>
                    <h3>Mouse</h3>
                  </Grid>
      
                  {files['mouse_gene'] ? (
                      <Grid item key={files['mouse_gene'].id}>
                          <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['mouse_gene'].species}_${files['mouse_gene'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                              {`${files['mouse_gene'].species}_${files['mouse_gene'].data_level}_v${selectedVersion}.h5`}
                          </a><br />
                          <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                          Date: {new Date(files['mouse_gene'].timestamp).toLocaleDateString()}<br/>
                          Samples: {files['mouse_gene'].samples}<br />
                          Size: {Math.round(files['mouse_gene'].file_size / (1024 * 1024 * 1024))} GB<br />
                          </div>
                          <Tooltip title={"SHA1 hash"} arrow>
                              <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['mouse_gene'].checksum} sx={{
                                  marginLeft: "-15px",
                                  fontSize: "10px",
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                              }} />
                          </Tooltip>
                      </Grid>
                  ):(
                    <Grid item sx={{
                        display: 'flex',
                        alignItems: 'center', // Align items vertically center
                        color: 'grey',
                        marginTop: '10px', // Optional: adds some spacing from the top, if needed
                        width: "290px",
                        paddingBottom: "15px"
                    }}>
                        <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                        <span>File not available. Please try a different version.</span>
                    </Grid>
                  )}

                </Grid>
              </Grid>
      
            </Grid>
          </Box>

        <Box id="exp_trans" sx={{borderRadius: '0px 0px 0px 0px', backgroundColor: "#e8e8e8", minHeight: "200px", padding: "30px", marginLeft: "-20px", marginRight: "-20px", paddingTop: "10px"}}>
        <Grid container spacing={2} >
              <Grid item>
                <h2>Transcript-level Expression</h2>
              </Grid>
              <Grid item>
                Expression files for mouse and human in HDF5 format. All transcript counts are at Ensembl transcript ID level. For compression purposes, the Kallisto pseudocounts are rounded to integer values.
              </Grid>

              <Grid item sx={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "340px",
                '&:hover': {
                    borderRadius: "18px",
                    background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',  // Gradient effect
                    transition: 'background 12.3s ease-in-out',  // Smooth transition
                  },
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{marginBottom: "-20px", marginTop: "-10px"}}>
                    <h3>Human</h3>
                  </Grid>
      
                  {files['human_transcript'] ? (
                      <Grid item key={files['human_transcript'].id}>
                          <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['human_transcript'].species}_${files['human_transcript'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                              {`${files['human_transcript'].species}_${files['human_transcript'].data_level}_v${selectedVersion}.h5`}
                          </a><br />
                          <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                          Date: {new Date(files['human_transcript'].timestamp).toLocaleDateString()}<br/>
                          Samples: {files['human_transcript'].samples}<br />
                          Size: {Math.round(files['human_transcript'].file_size / (1024 * 1024 * 1024))} GB<br />
                          </div>
                          <Tooltip title={"SHA1 hash"} arrow>
                              <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['human_transcript'].checksum} sx={{
                                  marginLeft: "-15px",
                                  fontSize: "10px",
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                              }} />
                          </Tooltip>
                      </Grid>
                  ):(
                    <Grid item sx={{
                        display: 'flex',
                        alignItems: 'center', // Align items vertically center
                        color: 'grey',
                        marginTop: '10px', // Optional: adds some spacing from the top, if needed
                        paddingBottom: "15px"
                    }}>
                        <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                        <span>File not available. Please try a different version.</span>
                    </Grid>
                  )}

                </Grid>
              </Grid>
      
              <Grid item  sx={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "300px",
                '&:hover': {
                    borderRadius: "18px",
                    background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',  // Gradient effect
                    transition: 'background 12.3s ease-in-out',  // Smooth transition
                  },
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{marginBottom: "-20px", marginTop: "-10px"}}>
                    <h3>Mouse</h3>
                  </Grid>
      
                  {files['mouse_transcript'] ? (
                      <Grid item key={files['mouse_transcript'].id}>
                          <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['mouse_transcript'].species}_${files['mouse_transcript'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                              {`${files['mouse_transcript'].species}_${files['mouse_transcript'].data_level}_v${selectedVersion}.h5`}
                          </a><br />
                          <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                          Date: {new Date(files['mouse_transcript'].timestamp).toLocaleDateString()}<br/>
                          Samples: {files['mouse_transcript'].samples}<br />
                          Size: {Math.round(files['mouse_transcript'].file_size / (1024 * 1024 * 1024))} GB<br />
                          </div>
                          <Tooltip title={"SHA1 hash"} arrow>
                              <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['mouse_transcript'].checksum} sx={{
                                  marginLeft: "-15px",
                                  fontSize: "10px",
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                              }} />
                          </Tooltip>
                      </Grid>
                  ):(
                    <Grid item sx={{
                        display: 'flex',
                        alignItems: 'center', // Align items vertically center
                        color: 'grey',
                        marginTop: '10px', // Optional: adds some spacing from the top, if needed
                        paddingBottom: "15px"
                    }}>
                        <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                        <span>File not available. Please try a different version.</span>
                    </Grid>
                  )}


                </Grid>
              </Grid>

        </Grid>
        </Box>
        
        <Box id="exp_trans" sx={{borderRadius: '0px 0px 12px 12px', backgroundColor: "#f4f7f4", minHeight: "200px", padding: "30px", marginLeft: "-20px", marginRight: "-20px", paddingTop: "10px"}}>
        <Grid container spacing={2} >
              <Grid item>
                <h2>TPM Transcript-level Expression</h2>
              </Grid>
              <Grid item>
                Expression files for mouse and human in HDF5 format. All TPM counts are at Ensembl transcript ID level. TPM values are computed using the effective length estimated by Kallisto.
              </Grid>

              <Grid item sx={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "340px",
                '&:hover': {
                    borderRadius: "18px",
                    background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',  // Gradient effect
                    transition: 'background 12.3s ease-in-out',  // Smooth transition
                  },
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{marginBottom: "-20px", marginTop: "-10px"}}>
                    <h3>Human</h3>
                  </Grid>
      
                  {files['human_tpm'] ? (
                      <Grid item key={files['human_tpm'].id}>
                          <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['human_tpm'].species}_${files['human_tpm'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                              {`${files['human_tpm'].species}_${files['human_tpm'].data_level}_v${selectedVersion}.h5`}
                          </a><br />
                          <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                          Date: {new Date(files['human_tpm'].timestamp).toLocaleDateString()}<br/>
                          Samples: {files['human_tpm'].samples}<br />
                          Size: {Math.round(files['human_tpm'].file_size / (1024 * 1024 * 1024))} GB<br />
                          </div>
                          <Tooltip title={"SHA1 hash"} arrow>
                              <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['human_tpm'].checksum} sx={{
                                  marginLeft: "-15px",
                                  fontSize: "10px",
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                              }} />
                          </Tooltip>
                      </Grid>
                  ):(
                    <Grid item sx={{
                        display: 'flex',
                        alignItems: 'center', // Align items vertically center
                        color: 'grey',
                        marginTop: '10px', // Optional: adds some spacing from the top, if needed
                        paddingBottom: "15px"
                    }}>
                        <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                        <span>File not available. Please try a different version.</span>
                    </Grid>
                  )}

                </Grid>
              </Grid>
      
              <Grid item  sx={{
                marginTop: "10px",
                marginLeft: "20px",
                width: "300px",
                '&:hover': {
                    borderRadius: "18px",
                    background: 'linear-gradient(to right, transparent, white 1%, white 0%, transparent)',  // Gradient effect
                    transition: 'background 12.3s ease-in-out',  // Smooth transition
                  },
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{marginBottom: "-20px", marginTop: "-10px"}}>
                    <h3>Mouse</h3>
                  </Grid>
      
                  {files['mouse_tpm'] ? (
                      <Grid item key={files['mouse_tpm'].id}>
                          <a href={`https://s3.dev.maayanlab.cloud/archs4/files/${files['mouse_tpm'].species}_${files['mouse_tpm'].data_level}_v${selectedVersion}.h5`} onClick={(event) => writeLog(event, "download")}>
                              {`${files['mouse_tpm'].species}_${files['mouse_tpm'].data_level}_v${selectedVersion}.h5`}
                          </a><br />
                          <div style={{fontSize: "13px", lineHeight: "1.2", marginBottom: "6px"}}>
                          Date: {new Date(files['mouse_tpm'].timestamp).toLocaleDateString()}<br/>
                          Samples: {files['mouse_tpm'].samples}<br />
                          Size: {Math.round(files['mouse_tpm'].file_size / (1024 * 1024 * 1024))} GB<br />
                          </div>
                          <Tooltip title={"SHA1 hash"} arrow>
                              <Chip icon={<TagIcon sx={{ fontSize: "16px" }} />} label={files['mouse_tpm'].checksum} sx={{
                                  marginLeft: "-15px",
                                  fontSize: "10px",
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                              }} />
                          </Tooltip>
                      </Grid>
                  ):(
                    <Grid item sx={{
                        display: 'flex',
                        alignItems: 'center', // Align items vertically center
                        color: 'grey',
                        marginTop: '10px', // Optional: adds some spacing from the top, if needed
                        paddingBottom: "15px"
                    }}>
                        <img src={missingfile} alt="Missing file" style={{ width: '50px', marginRight: '8px' }} />
                        <span>File not available. Please try a different version.</span>
                    </Grid>
                  )}


                </Grid>
              </Grid>

        </Grid>
        </Box>

        <Box
            id="exp_affy"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>Expression (Affymetrix arrays)</h2></Grid>
                <Grid item xs={12} md={5} sx={{ marginRight: { xs: '0px', sm: '60px' }}}>
                Expression files for human and mouse Affymetrix arrays. The collection contains 262,468 human samples and 86,012 mouse samples. All measurements are at the probe level. Values are taken as stored in GEO. For compression reasons values are stored as 16-bit floats.
                </Grid>
                <Grid item xs={6} md={3}>
                   <Grid container>
                   <Grid item xs={12}><h2>Human</h2></Grid>
                   <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL570_expression.h5' onClick={(event) => writeLog(event, "download")}>GPL570_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 14.7 GB
                    </Grid>
                    <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL571_expression.h5' onClick={(event) => writeLog(event, "download")}>GPL571_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 936 MB
                    </Grid>
                    <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL6244_expression.h5' onClick={(event) => writeLog(event, "download")}>GPL6244_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 2 GB
                    </Grid>
                    <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL96_expression.h5'onClick={(event) => writeLog(event, "download")}>GPL96_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 1.66 GB
                    </Grid>
                   </Grid>
                </Grid>
                <Grid item xs={6} md={3}>
                <Grid item xs={12}><h2>Mouse</h2></Grid>
                    <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL6246_expression.h5'>GPL570_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 1.68 GB
                    </Grid>
                    <Grid item xs={12} sx={{marginBottom: "8px"}}>
                        <a href='https://s3.amazonaws.com/mssm-seq-matrix/GPL1261_expression.h5'>GPL1261_expression.h5</a><br/>
                        Date: 5/2021<br/>
                        Size: 4.57 GB
                    </Grid>
                </Grid>
            </Grid>
        </Box>

        <Box
            id="tsne_sample"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>t-SNE sample coordiantes</h2></Grid>
                <Grid item xs={12} md={5} sx={{ marginRight: { xs: '0px', sm: '60px' }}}>
                Gene expression reduced to 3 dimensions. The files contain 4 columns with the first 3 containing dimensions x, y, z and the last column containing the numeric part of the GSM id (GSM123456 to 123456).
                </Grid>
                <Grid item xs={6} md={3}>
                   
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/sample_human_tsne.csv'>sample_human_tsne.csv</a><br/>
                    Date: 3/2018<br/>
                    Size: 2.9 MB
                </Grid>
                <Grid item xs={6} md={3}>
                    
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/sample_mouse_tsne.csv'>sample_mouse_tsne.csv</a><br/>
                    Date: 3/2018<br/>
                    Size: 3.5 MB
                </Grid>
            </Grid>
        </Box>

        <Box
            id="tsne_gene"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>t-SNE gene coordiantes</h2></Grid>
                <Grid item xs={12} md={5} sx={{ marginRight: { xs: '0px', sm: '60px' }}}>
                Gene expression reduced to 3 dimensions. The files contain 4 columns with the first 3 containing dimensions x, y, z and the last column containing Entrez gene symbol.
                </Grid>
                <Grid item xs={6} md={3}>
                   
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/gene_human_tsne.csv'>gene_human_tsne.csv</a><br/>
                    Date: 3/2018<br/>
                    Size: 741.0 KB
                </Grid>
                <Grid item xs={6} md={3}>
                    
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/gene_mouse_tsne.csv'>gene_mouse_tsne.csv</a><br/>
                    Date: 3/2018<br/>
                    Size: 606.0 KB
                </Grid>
            </Grid>
        </Box>

        <Box
            id="correlation_gene"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>Gene correlation</h2></Grid>
                <Grid item xs={12}><h3>v2</h3></Grid>
                <Grid item xs={12} sm={12} md={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                Pairwise pearson correlation of genes across expression samples. File format is pickle and can be loaded directly into memory in Python (pandas.read_pickle()).
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Human</h2>
                    <a href="https://s3.amazonaws.com/mssm-data/human_correlation_v2.4.pkl">human_correlation_v2.4.pkl</a><br/>
                    Date: 6/2024<br/>
                    Size: 6.8 GB<br/>
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Mouse</h2>
                    <a href="https://s3.amazonaws.com/mssm-data/mouse_correlation_v2.4.pkl">mouse_correlation_v2.4.pk</a><br/>
                    Date: 6/2024<br/>
                    Size: 4.3 GB<br/>
                </Grid>
                <Grid item xs={12}><h3>v1</h3></Grid>
                <Grid item xs={12} sm={12} md={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                Pairwise pearson correlation of genes across expression samples in RDA format (R).
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Human</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-matrix/human_correlation.rda">human_correlation.rda</a><br/>
                    Date: 10/2017<br/>
                    Size: 5.0 GB<br/>
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Mouse</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-matrix/mouse_correlation.rda">mouse_correlation.rda</a><br/>
                    Date: 8/2017<br/>
                    Size: 3.0 GB<br/>
                </Grid>
                <Grid item xs={12} sm={12} md={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                Pairwise pearson correlation of genes across expression samples. File format is feather and can be loaded directly into memory in Python and R.
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Human</h2>
                    <a href="https://s3.amazonaws.com/mssm-data/human_correlation_archs4.f">human_correlation_archs4.f</a><br/>
                    Date: 7/20207<br/>
                    Size: 5.3 GB<br/>
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Mouse</h2>
                    <a href="https://s3.amazonaws.com/mssm-data/mouse_correlation_archs4.f">mouse_correlation_archs4.f</a><br/>
                    Date: 7/2020<br/>
                    Size: 3.3 GB<br/>
                </Grid>
            </Grid>
        </Box>

        <Box
            id="prismexp_pred"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>PrismExp predictions</h2></Grid>
                <Grid item xs={12} sm={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                Gene function prediction from PrismEXP using 300 correlation matrices in feather and can be loaded directly into memory in Python and R. Contains 155 files zipped.
                </Grid>
                <Grid item sm={4}>
                    <Box
                        component="img"
                        src={prismexp}
                        alt="prismexp"
                        sx={{
                        width: {
                            xs: '80px',  // width for extra-small devices
                        },
                        transition: 'width 0.3s ease-in-out', 
                        }}
                    /><br/>
                    <a href="https://s3.amazonaws.com/mssm-prismexp-predictions/prismx_predictions.zip">prismx_predictions.zip</a><br/>
                    Date: 4/2021<br/>
                    Size: 4.4 GB<br/>
                </Grid>
               
            </Grid>
        </Box>

        <Box
            id="jl_transform"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>Johnson Lindenstrauss transformation matrix</h2></Grid>
                <Grid item xs={12} sm={12} lg={12} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                Gene expression compressed with the Johnson-Lindenstrauss transformation. The RDA files can be loaded into a running R environment with the "load" command. The files create two variables, the transform matrix used for the projection and the jl_expression matrix. The original dimensions are reduced to 1000. The original distances and correlations of the samples should be preserved.
                </Grid>
                <Grid item sm={12} lg={6}>
                    <h2>Human</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-matrix/compressed_human_expression_1000.rda">compressed_human_expression_1000.rda</a><br/>
                    Date: 3/2018<br/>
                    Size: 1.0 GB<br/>
                </Grid>
                <Grid item sm={12} lg={6}>
                    <h2>Mouse</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-matrix/compressed_mouse_expression_1000.rda">compressed_mouse_expression_1000.rda</a><br/>
                    Date: 3/2018<br/>
                    Size: 1.19 GB<br/>
                </Grid>
            </Grid>
        </Box>

        
        <Box
            id="kallisto_index"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>Kallisto index files</h2></Grid>
                <Grid item xs={12}><h3>v2</h3></Grid>
                <Grid item xs={12} sm={12} md={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                 Kallisto index files used for the alignment process. The index files where build using the Ensembl annotation version 107 for human and 107 for mouse and reference cDNA Homo_sapiens.GRCh38.cdna.all.fa.gz and Mus_musculus.GRCm38.cdna.all.fa.gz.
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Human</h2>
                    <a href="s3://mssm-archs4-index/human_107_kallisto.idx">human_107_kallisto.idx</a><br/>
                    Date: 4/2023<br/>
                    Size: 3.2 GB<br/>
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Mouse</h2>
                    <a href="s3://mssm-archs4-index/mouse_107_kallisto.idx">mouse_107_kallisto.idx</a><br/>
                    Date: 4/2023<br/>
                    Size: 2.4 GB<br/>
                </Grid>
                <Grid item xs={12}><h3>v1</h3></Grid>
                <Grid item xs={12} sm={12} md={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                 Kallisto index files used for the alignment process. The index files where build using the Ensembl annotation version 87 for human and 88 for mouse and reference cDNA Homo_sapiens.GRCh38.cdna.all.fa.gz and Mus_musculus.GRCm38.cdna.all.fa.gz.
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Human</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-index/human_index.idx">human_index.idx</a><br/>
                    Date: 10/2016<br/>
                    Size: 2.2 GB<br/>
                </Grid>
                <Grid item sm={6} md={3}>
                    <h2>Mouse</h2>
                    <a href="https://s3.amazonaws.com/mssm-seq-index/mouse_index.idx">mouse_index.idx</a><br/>
                    Date: 10/2016<br/>
                    Size: 1.8 GB<br/>
                </Grid>
            </Grid>
        </Box>

        <Box
            id="exp_geo"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>GEO expression</h2></Grid>
                <Grid item xs={12} sm={5} sx={{marginRight: { xs: '0px', sm: '60px' }}}>
                    Gene counts from GEO GEO series with raw gene counts. The samples in the H5 file are also in the current version (v2.1) of ARCHS4. Due to some missing samples in GEO there are only 340713 samples processed by GEO that are overlapping with ARCHS4.
                </Grid>
                <Grid item>
                    <h2>Human</h2>
                    <a href="">geo_human_v1.h5</a><br/>
                    Date: 4/2023<br/>
                    Size: 17 GB<br/>
                </Grid>
            </Grid>
        </Box>

        <Box
            id="exp_recount"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}><h2>TCGA and GTEx expression from recount2</h2></Grid>
                <Grid item xs={12} md={5} sx={{ marginRight: { xs: '0px', sm: '60px' }}}>Gene counts from GTEx and TCGA from the recount2 project. The reads for these samples was aligned with a different pipeline resulting in significant differences to the ARCHS4 gene expression. Genes that did not overlap with the genes in the ARCHS4 data were removed.</Grid>
                <Grid item xs={6} md={3}>
                    <Box
                        component="img"
                        src={tcga}
                        alt="tcga"
                        sx={{
                        width: {
                            xs: '120px',  // width for extra-small devices
                        },
                        transition: 'width 0.3s ease-in-out', 
                        }}
                    />
                    <br/>
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/tcga_matrix.h5'>tcga_matrix.h5</a><br/>
                    Date: 10/2017<br/>
                    Size: 589 MB
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box
                        component="img"
                        src={gtex}
                        alt="gtex"
                        sx={{
                        marginTop: "13px",
                        marginBottom: "14px",
                        width: {
                            xs: '120px',  // width for extra-small devices
                        },
                        transition: 'width 0.3s ease-in-out', 
                        }}
                    />
                    <br/>
                    <a href='https://s3.amazonaws.com/mssm-seq-matrix/gtex_matrix.h5'>gtex_matrix.h5</a><br/>
                    Date: 10/2017<br/>
                    Size: 696 MB
                </Grid>
            </Grid>
        </Box>


        <Box
            id="github_rep"
            sx={{
                marginTop: '40px',
                backgroundColor: '#f4f7f4',
                padding: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
            }}
            >
            <Grid container spacing={2}>
            <Grid item>
                <a href="https://github.com/maayanlab/archs4" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                    <GitHubIcon style={{ fontSize: 40 }} sx={{marginTop: "0px"}} />
                </a>
                </Grid>
                <Grid item  sx={{marginTop: "4px"}} > <a href="https://github.com/maayanlab/archs4" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}><h2>GitHub repository</h2></a></Grid>

            </Grid>
        </Box>


        <RequestRole open={openDialog} onClose={handleCloseDialog} />
        </>
    )
    
}