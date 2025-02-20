import {speciesData} from "./data.js"
import { Grid, Box, Typography } from "@mui/material";
import archs4zoo from "../../../image/archs4zoo.png";

export const Zoo = () => {
  // Function to handle API requests for downloads
  const downloadFile = (url, file, version) => {
    console.log(`Initiating download for ${file}, version: ${version}`);
    // Implement actual download logic here
  };



  return (
    <div style={{ backgroundColor: 'white', margin: '0px', }}>
      <div style={{ paddingTop: '0px', textAlign: 'center' }}>
        <img id="animation-target" src={archs4zoo} alt="ARCHS4 ZOO" />
      </div>
      
      <div style={{margin: "20px"}}>
      <p>
        This section contains all files created for the ARCHS<sup>4</sup> ZOO collection. Currently, we support a
        selected set of species other than mouse and human. The methods are described in
        <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank" rel="noopener noreferrer"> Nature Communications</a>.
        For help in accessing the files, please refer to the Help section or contact us directly. The database will be updated on a regular 
        basis while old versions of the files will be accessible.
      </p>
      </div>
      
      <div style={{ textAlign: 'center'}}>
        {speciesData.map(species => (
          <a key={species.id} href={`#${species.id}`}>{species.name}</a>
        )).reduce((prev, curr) => [prev, ' | ', curr])}
      </div>
      
      <Grid container>

      {speciesData.map(species => (
        <Grid item sm={12} md={6} lg={4} sx={{padding: "20px"}}>
        <div key={species.id} style={{ paddingBottom: '20px' }} id={species.id}>
          <h3>{species.name}</h3>
          
          {species.updateInfo}

          <br />
          <div style={{ fontSize: '16px', paddingLeft: '20px' }}>
            <table>
              <tbody>
                {species.data.map((item, index) => (
                  <tr key={index}>
                    <td style={{ width: '220px' }}>
                      <a href={item.url} >{item.description}</a>
                    </td>
                    <td style={{ width: '250px' }}>Size: {item.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </Grid>
      ))}
      </Grid>
    </div>
  );
};