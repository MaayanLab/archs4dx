import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import { NavBar } from "../../layout/navbar";
import { UserMenu } from "../dashboard/components/user-menu";
import data from "../../data/config.json";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

import { LetterSignup } from '../../layout/newslettersignup';
import "./components/styles.css"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define drawerWidth outside the component
const drawerWidth = 344;

// Styled AppBar using Material-UI
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

export const HelpPage = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(''); // State for email input
  const [hasUserId, setHasUserId] = useState(false);

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

  // Function to handle email submission
  const addEmail = () => {
    if (email.trim()) {
      console.log('Email submitted:', email);
      // Implement your email submission logic here (e.g., API call)
      setEmail(''); // Clear the input after submission
      alert('Thank you for subscribing!');
    } else {
      alert('Please enter a valid email address.');
    }
  };


    const codeString = `
    # R script to download selected samples
    # Copy code and run on a local machine to initiate download
    # Check for dependencies and install if missing
    library("rhdf5") # can be installed using Bioconductor
    destination_file = "human_matrix_v9.h5"
    extracted_expression_file = "GSM2679484_expression_matrix.tsv"
    url = "https://s3.amazonaws.com/mssm-seq-matrix/human_matrix_v9.h5"

    # Check if gene expression file was already downloaded, if not in current directory download file form repository
    if (!file.exists(destination_file)) {
    print("Downloading compressed gene expression matrix.")
    download.file(url, destination_file, quiet = FALSE, mode = 'wb')
    }

    # Selected samples to be extracted
    samp = c("GSM2679452", "GSM2679453", "GSM2679454", "GSM2679455", "GSM2679456",
            "GSM2679457", "GSM2679458", "GSM2679459", "GSM2679460", "GSM2679461", 
            "GSM2679462", "GSM2679463", "GSM2679464", "GSM2679465", "GSM2679466", 
            "GSM2679467", "GSM2679468", "GSM2679469", "GSM2679470", "GSM2679471", 
            "GSM2679472", "GSM2679473", "GSM2679474", "GSM2679475", "GSM2679476", 
            "GSM2679477", "GSM2679478", "GSM2679479", "GSM2679480", "GSM2679481", 
            "GSM2679482", "GSM2679483", "GSM2679484", "GSM2679485", "GSM2679486", 
            "GSM2679487", "GSM2679488", "GSM2679489", "GSM2679490", "GSM2679491", 
            "GSM2679492", "GSM2679493", "GSM2679494", "GSM2679495", "GSM2679496", 
            "GSM2679497", "GSM2679498", "GSM2679499", "GSM2679500", "GSM2679501", 
            "GSM2679502", "GSM2679503", "GSM2679504", "GSM2679505", "GSM2679506", 
            "GSM2679507", "GSM2679508", "GSM2679509", "GSM2679510", "GSM2679511")

    # Retrieve information from compressed data
    samples = h5read(destination_file, "meta/samples/geo_accession")
    genes = h5read(destination_file, "meta/genes/genes")

    # Identify columns to be extracted
    sample_locations = which(samples %in% samp)

    # Extract gene expression from compressed data
    expression = t(h5read(destination_file, "data/expression", index = list(sample_locations, 1:length(genes))))
    H5close()
    rownames(expression) = genes
    colnames(expression) = samples[sample_locations]

    # Print file
    write.table(expression, file = extracted_expression_file, sep = "\\t", quote = FALSE, col.names = NA)
    print(paste0("Expression file was created at ", getwd(), "/", extracted_expression_file))
        `;

  return (
    <>
      {/* Helmet for setting document head */}
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta name="description" content="ARCHS4" />
      </Helmet>

      {/* AppBar with UserMenu */}
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
      {/* Main Content Area */}
      <Box
        sx={{
          flex: '1 0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url(/congruent_pentagon2.png)', // Ensure the path is correct
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          marginTop: "0px",
          boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
          minHeight: '80vh',
        }}
      >
        <Paper
          sx={{
            margin: "40px",
            padding: "40px",
            maxWidth: '1200px', // Optional: to control the width
          }}
        >
          <h2 style={{marginBottom: "40px"}}>ARCHS<sup>4</sup> Help</h2>
          
          
          {/* Navigation Links */}
          <div class="shortcut" id="nav" style={{ width: "100%", paddingLeft: "30px", marginBottom: "20px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {/* First Column */}
              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('getting-started')}>
                    Getting Started with ARCHS<sup>4</sup>
                  </span>
                </h3>
                <ul style={{ paddingLeft: "20px", listStyle: 'none' }}>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('about')}>About ARCHS<sup>4</sup></span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('downloadfiles')}>Download files</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('genepages')}>Gene landing pages</span>
                  </li>
                </ul>
              </div>

              {/* Second Column */}
              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('datavisualization')}>
                    Data visualization
                  </span>
                </h3>
                <ul style={{ paddingLeft: "20px", listStyle: 'none' }}>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('dataviewer')}>WebGL data viewer</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('vieweroptions')}>Viewer options</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('viewerinteraction')}>Viewer-user interaction</span>
                  </li>
                </ul>
              </div>

              {/* Third Column */}
              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('genepages')}>
                    Gene pages
                  </span>
                </h3>
                <ul style={{ paddingLeft: "20px", listStyle: 'none' }}>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('functionalprediction')}>Functional prediction</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('correlation')}>Gene correlation</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('atlas')}>Tissue expression atlas</span>
                  </li>
                </ul>
              </div>
              


              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('datahandling')}>
                    Data handling
                  </span>
                </h3>
                <ul style={{ paddingLeft: "20px", listStyle: 'none' }}>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('fileformat')}>About the H5 file format</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('parsing')}>Parsing the H5 file</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('batcheffect')}>Batch effect removal</span>
                  </li>
                </ul>
              </div>
              

              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('searchtools')}>
                    Search tools
                  </span>
                </h3>
                <ul style={{ paddingLeft: "20px", listStyle: 'none' }}>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('metasearch')}>Meta data search</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('sigsearch')}>Signature search</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('genesearch')}>Gene searchs</span>
                  </li>
                  <li>
                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('api')}>API</span>
                  </li>
                </ul>
              </div>

              <div style={{ flex: '1 1 300px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => scrollPage('termsofuse')}>
                    Terms of use
                  </span>
                </h3>
                
              </div>
            </div>
          </div>

          <hr />


          <hr />

          {/* Example of a section with headings and paragraphs */}
          <div id="firststeps" style={{marginTop: "40px"}}>
            <h2>First Steps <span style={{ cursor: 'pointer' }} onClick={() => scrollPage('nav')}>↑</span></h2>

            <div class="subpoint">
            <h4 id="about">About ARCHS<sup>4</sup></h4>
            <p style={{ fontSize: '14px' }}>
            ARCHS4 provides access to gene counts from all major sequencing platforms for human and mouse experiments. The website allows download of the data in H5 format for programmatic access as well as a 3-dimensional view of the sample space. Search features allow browsing of the data by meta data annotation, signature similarity and functional enrichment. Selected sample sets can be downloaded into a tab separated through auto-generated R scripts for further analysis. Reads are aligned with Kallisto using a custom cloud computing platform. Human samples are aligned against GRCh38 cdna reference and mouse samples against GRCm38 cdna. All processable files from the GEO/SRA database since June 2024 are processed and available for download.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="downloadfiles">Download files</h4>
            <p style={{ fontSize: '14px' }}>
                Raw read counts can be downloaded by browsing to the top of the ARCHS4 website and selecting the Download option. The raw counts are separated by human and mouse samples and are provided in H5 format. H5 provides efficient compression of the gene counts data. Tab separated files can be extracted with the provided code and auto-generated scripts provided by the web interface.
                Selected sample and gene sets are displayed in the Search Results section. Under downloads scripts can be downloaded for the given gene sets. In case of gene sets a text file containing the gene symbols is provided.
                Gene sets can be exported to Enrichr for further analysis.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="genepages">Gene landing pages</h4>
            <p style={{ fontSize: '14px' }}>
            Gene landing pages are accessible through the search fields on the top right of the ARCHS4 interface. Genes can be searched by Entrez gene symbol. The gene search returns the expression distribution for major tissues and cell lines and predictions of biological function and regulatory properties of the target gene. If a gene is previously known to be part of a predicted gene set the terms are marked in green. If a gene has sufficient number of prior knowledge annotations a ROC curve shows how well the prior knowledge about the gene can be recovered.
            </p>
            </div>

          </div>

          
          <div id="datavisualization" style={{marginTop: "40px"}}>
            <h2>Data visualization <span style={{ cursor: 'pointer' }} onClick={() => scrollPage('nav')}>↑</span></h2>

            <div class="subpoint">
            <h4 id="dataviewer">WebGL data viewer</h4>
            <p style={{ fontSize: '14px' }}>
            The data view port displays samples or genes relative to the other samples and genes in the dataset. Samples/Genes with similar expression are clustered. The layout is computed with t-SNE.
The visualization is dynamic and allows rotation and zooming. The two icons on the top right are the manual selection tool and a toggle button that moves the view port into a smaller window to the left of the webpage.
The colors of samples and gene sets can be modified in the result section.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="vieweroptions">Viewer options</h4>
            <p style={{ fontSize: '14px' }}>
            The data view can display 4 precalculated data visualizations: human samples, human genes, mouse samples and mouse genes. To toggle between species, select either the human or mouse button on the left. To change from sample view to gene view select one of the yellow buttons. A new view will automatically be loaded on selection. Prior selections are saved and will be loaded again if the former mode is selected.
The colors of sample and gene sets can be modified in the result section.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="viewerinteraction">Viewer user interaction</h4>
            <p style={{ fontSize: '14px' }}>
            The visualization is dynamic an allows rotation and zoom. The two icons on the top right are the manual selection tool and a toggle button that moves the view port into a smaller window to the left of the webpage.
            </p>
            </div>
        </div>


        <div id="genepages" style={{marginTop: "40px"}}>
            <h2>Gene pages <span style={{ cursor: 'pointer' }} onClick={() => scrollPage('nav')}>↑</span></h2>

            <div class="subpoint">
            <h4 id="functionalprediction">Functional Prediction</h4>
            <p style={{ fontSize: '14px' }}>
                The top 100 predictions of gene set membership accross multiple domains is shown in the tables on the gene page. Gene set membership is predicted by membership by association. If a gene shares high correlation with known members of a gene set it will get a high z-score during the membership perediction. If a gene already has known functions/gene set memberships they are highlighted in green. If a gene is extensively annotated a ROC curve shows how well known annotations could be recovered by the algorithm. If there is no image the gene has not enough prior gene memberships to build a reliable ROC curve.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="correlation">Gene correlation</h4>
            <p style={{ fontSize: '14px' }}>
            The gene correlation table contains the 100 most correlated genes to the gene of interest. The Pearson correlation is calculated over all samples and tissues. The gene list can be uploaded to Enrichr for further investigation.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="atlas">Tissue expression atlas</h4>
            <p style={{ fontSize: '14px' }}>
            The tissue and cell line expression atlas are calculated from samples in ARCHS4. The tissues are grouped in multiple levels and cover a wide range of different cellular contexts. Since samples of any given tissue can come from many distinct laboratoeries condition upon sample creation are not identical and various subtypes of tissues can be mixed. This in comparison to GTEx can report the observed variability in non homogenious sample groups.
            </p>
            </div>
        </div>

        <div id="datahandling" style={{marginTop: "40px"}}>
            <h2>Data handling <span style={{ cursor: 'pointer' }} onClick={() => scrollPage('nav')}>↑</span></h2>

            <div class="subpoint">
            <h4 id="functionalprediction">About the H5 file format</h4>
            <p style={{ fontSize: '14px' }}>
            Hierarchical Data Format (HDF) is an open source file format for large data storage. It allows programmatic accessibility of matrix entries based on column and row indices while allowing for efficient data compression. The H5 files provided by ARCHS4 contain raw read counts as well as detailed meta data information extracted from GEO.
            </p>
            <div style={{ textAlign: 'center' }}>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/TjkWSBQuKoE"
                frameBorder="0"
                allowFullScreen
                title="Embedded YouTube Video"
            ></iframe>
            </div>
            <p>

            <table>
        <thead>
            <tr>
                <th>Path</th>
                <th>Object Type</th>
                <th>Data Type</th>
                <th>Dimensions</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>/data</td><td>H5I_GROUP</td><td></td><td></td></tr>
            <tr><td>/data/expression</td><td>H5I_DATASET</td><td>INTEGER</td><td>307268 x 35238</td></tr>
            <tr><td>/meta</td><td>H5I_GROUP</td><td></td><td></td></tr>
            <tr><td>/meta/genes/chromosome</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/genes/ensembl_gene_id</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/genes/gene_biotype</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/genes/gene_symbol</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/genes/gene</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/genes/start_position</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
            <tr><td>/meta/info</td><td>H5I_GROUP</td><td></td><td></td></tr>
            <tr><td>/meta/info/author</td><td>H5I_DATASET</td><td>STRING</td><td>(0)</td></tr>
            <tr><td>/meta/info/contact</td><td>H5I_DATASET</td><td>STRING</td><td>(0)</td></tr>
            <tr><td>/meta/info/creation-date</td><td>H5I_DATASET</td><td>STRING</td><td>(0)</td></tr>
            <tr><td>/meta/info/laboratory</td><td>H5I_DATASET</td><td>STRING</td><td>(0)</td></tr>
            <tr><td>/meta/info/version</td><td>H5I_DATASET</td><td>INTEGER</td><td>(0)</td></tr>
            <tr><td>/meta/samples</td><td>H5I_GROUP</td><td></td><td></td></tr>
            <tr><td>/meta/samples/channel_count</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/characteristics_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_address</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_city</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_country</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_institute</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_name</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/contact_zip</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/data_processing</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/data_row_count</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/extract_protocol_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/geo_accession</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/instrument_model</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/last_update_date</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/library_selection</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/library_source</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/library_strategy</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/molecule_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/organism_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/platform_id</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/readsaligned</td><td>H5I_DATASET</td><td>FLOAT</td><td>307268</td></tr>
            <tr><td>/meta/samples/readstotal</td><td>H5I_DATASET</td><td>FLOAT</td><td>307268</td></tr>
            <tr><td>/meta/samples/relation</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/series_id</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/singlecellprobability</td><td>H5I_DATASET</td><td>FLOAT</td><td>307268</td></tr>
            <tr><td>/meta/samples/source_name_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/status</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/submission_date</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/taxid_ch1</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/title</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/samples/type</td><td>H5I_DATASET</td><td>STRING</td><td>307268</td></tr>
            <tr><td>/meta/genes</td><td>H5I_DATASET</td><td>STRING</td><td>35238</td></tr>
        </tbody>
    </table>

            </p>
            </div>

            <div class="subpoint">
            <h4 id="parsing">Parsing the H5 file</h4>
            <p style={{ fontSize: '14px' }}>
            Scripts to extract tab separated gene expression files can be created through the graphical user interface of ARCHS4. The script has to be executed as an R-script. A free version of R can be downloaded from: www.rstudio.com. Upon execution the script should install all required dependencies, and then download the full gene expression file before extracting the selected samples.
            </p>

            <p>

            <SyntaxHighlighter language="r" style={solarizedlight}>
                {codeString}
            </SyntaxHighlighter>
            </p>

            </div>

            <div class="subpoint">
            <h4 id="batcheffect">Batch effect correction</h4>
            <p style={{ fontSize: '14px' }}>
            Extracted samples from a specified tissue can originate from multiple series with slightly different experimental conditions. If desired batch effects from gene expression can be removed with the Combat library.
            </p>
            <div style={{ textAlign: 'center' }}>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/3wjbxDex7_8"
                frameBorder="0"
                allowFullScreen
                title="Embedded YouTube Video"
            ></iframe>
            </div>
            </div>
        </div>

        <div id="searchtools" style={{marginTop: "40px"}}>
            <h2>Search tools <span style={{ cursor: 'pointer' }} onClick={() => scrollPage('nav')}>↑</span></h2>

            <div class="subpoint">
            <h4 id="metasearch">Meta data search</h4>
            <p style={{ fontSize: '14px' }}>
            Metadata search parses the tissue description field from GEO to find matches with the entered search term. The search ignores spaces and is case insensitive. Results are highliged in the data viewer and a result is added to the result list.
We preselected a series of cellular tissues based by cellular system. This allows simple browsing of the data for tissues of interest. Some tissue selections can return empty for either mouse or human samples.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="sigsearch">Signature Search</h4>
            <p style={{ fontSize: '14px' }}>
            Signature search uses a list of high expressed genes and low expressed genes and identifies samples that match the given input. The gene expression is z-score normalized across samples to identify the relative gene expression.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="genesearch">Gene search</h4>
            <p style={{ fontSize: '14px' }}>
            
Open gene landing page when searching by gene symbol. A set of genes can be highlighted by selecting a gene set library and a corresponding gene set.
            </p>
            </div>

            <div class="subpoint">
            <h4 id="api">API</h4>
            <p style={{ fontSize: '14px' }}>
            
Open gene landing page when searching by gene symbol. A set of genes can be highlighted by selecting a gene set library and a corresponding gene set.
            </p>
            </div>

        </div>


        <div>
      <h2 id="termsofuse" style={{marginTop: "40px"}}>
        Terms of use
        <i
          className="glyphicon glyphicon-arrow-up"
          style={{ cursor: 'pointer', fontSize: 16 }}
          onClick={() => scrollPage('nav')}
        ></i>
      </h2>

      <h4>Use</h4>
      <p>
        Source code is available under the{' '}
        <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache Licence 2.0</a>. Provided gene expression files
        available under the{' '}
        <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          Creative Commons Attribution 4.0 International License
        </a>
        <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          <img
            alt="Creative Commons License"
            style={{ borderWidth: 0 }}
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
          />
        </a>
        .<br />
        All data is free to use for non-commercial purposes. For commercial use please contact{' '}
        <a href="https://www.ip.mountsinai.org/">MSIP</a>.
      </p>

      <h4>Citation</h4>
      <p>
        Please acknowledge ARCHS<sup>4</sup> in your publications by citing the following reference:
        <br />
        <div class="citation">
        Lachmann A, Torre D, Keenan AB, Jagodnik KM, Lee HJ, Wang L, Silverstein MC, Ma’ayan A. Massive mining of
        publicly available RNA-seq data from human and mouse. Nature Communications 9. Article number: 1366 (2018),
        doi:10.1038/s41467-018-03751-6
        </div>
        <a href="https://www.nature.com/articles/s41467-018-03751-6" target="_blank" rel="noopener noreferrer">
          {' '}
          <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
        </a>
      </p>

      <h4>Disclaimer</h4>
      <p>
        ARCHS<sup>4</sup> is not to be used for treating or diagnosing human subjects. ARCHS<sup>4</sup> or any
        documents available from this server are provided as is without any warranty of any kind, either express,
        implied, or statutory, including, but not limited to, any implied warranties of merchantability, fitness for
        particular purpose and freedom from infringement, or that ARCHS<sup>4</sup> or any documents available from this
        server will be error free. The Ma'ayan lab makes no representations that the use of ARCHS<sup>4</sup> or any
        documents available from this server will not infringe any patent or proprietary rights of third parties.
      </p>
      <p>
        In no event will the Ma'ayan lab or any of its members be liable for any damages, including but not limited to
        direct, indirect, special or consequential damages, arising out of, resulting from, or in any way connected with
        the use of ARCHS<sup>4</sup> or documents available from this server.
      </p>
    </div>



        </Paper>
      </Box>

      {/* Footer Section */}
      <FooterSection />
    </>
  );
};