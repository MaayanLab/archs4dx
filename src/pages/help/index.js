import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import { NavBar } from "../../layout/navbar";
import { UserMenu } from "../dashboard/components/user-menu";
import data from "../../data/config.json";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import creativecommons from "../../image/commons.svg";
import citation from "../../image/citation.svg";
import "./components/styles.css";
import { ApiDocumentation } from "./components/api";

// Define drawerWidth outside the component
const drawerWidth = 344;

// Styled AppBar with responsive adjustments
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  boxShadow: "none",
  background: "#EFF4F5",
  height: { xs: "60px", sm: "93px" },
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
    marginLeft: { xs: 0, sm: `${drawerWidth}px` },
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledCodeBlock = styled('div')({
  '& pre::-webkit-scrollbar': {
    width: '8px', // Thin scrollbar for WebKit browsers (Chrome, Safari)
  },
  '& pre::-webkit-scrollbar-thumb': {
    backgroundColor: '#888', // Gray thumb
    borderRadius: '4px', // Rounded edges
  },
  '& pre': {
    scrollbarWidth: 'thin', // Thin scrollbar for Firefox
    scrollbarColor: '#888 #2d2d2d', // Thumb and track colors
    margin: 0,
    padding: '20px',
    maxWidth: "100%",
    boxSizing: "border-box",
    overflowX: "auto", // Enable horizontal scrolling
  },
});

// CodeBlock component
const CodeBlock = ({ language, children }) => (
  <StyledCodeBlock>
    <SyntaxHighlighter
      language={language}
      style={okaidia}
      customStyle={{
        background: "#2d2d2d", // Dark background
        fontSize: { xs: "12px", sm: "14px" }, // Responsive font size
        lineHeight: "1.5",
      }}
    >
      {children}
    </SyntaxHighlighter>
  </StyledCodeBlock>
);

export const HelpPage = () => {
  const [open, setOpen] = useState(false);
  const [hasUserId, setHasUserId] = useState(false);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const response = await fetch("https://archs4.org/api/user/i");
        const data = await response.json();
        if (data && data.id) {
          setHasUserId(true);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    checkUserId();
  }, []);

  const scrollPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const codeString = `# R script to download selected samples
# Copy code and run on a local machine to initiate download
# Check for dependencies and install if missing
library("rhdf5") # can be installed using Bioconductor
destination_file = "human_matrix_v9.h5"
extracted_expression_file = "GSM2679484_expression_matrix.tsv"
url = "https://s3.dev.maayanlab.cloud/archs4/files/human_gene_v2.latest.h5"

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
print(paste0("Expression file was created at ", getwd(), "/", extracted_expression_file))`;

  return (
    <>
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta name="description" content="ARCHS4" />
      </Helmet>

      {hasUserId ? (
        <AppBar position="fixed" open={open}>
          <UserMenu
            sidebarOpen={open}
            toggleSidebar={() => setOpen(!open)}
            landingPage={true}
          />
        </AppBar>
      ) : (
        <AppBar position="fixed" open={open}>
          <NavBar />
        </AppBar>
      )}

      <Box
        sx={{
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundImage: "url(/congruent_pentagon2.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          marginTop: "0px",
          boxShadow: "inset 0px -4px 8px rgba(0,0,0,0.2)",
          minHeight: { xs: "auto", sm: "80vh" },
          width: "100%",
          maxWidth: "100vw", // Ties directly to viewport width
          boxSizing: "border-box",
          padding: { xs: "0 5px", sm: "0 10px" },
          overflowX: "hidden !important"
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%", // Ensures it stays within the parent
            margin: "0 auto", // Centers the content
            padding: { xs: "0px", sm: "20px", md: "80px" },
            paddingTop: { xs: "0px", sm: "30px", md: "30px" },
            overflowX: "hidden"
          }}
        >
          <Paper
            sx={{
              marginTop: "90px !important",
              margin: { xs: "0", sm: "20px auto" }, // No horizontal margins on small screens
              padding: { xs: "10px", sm: "20px", md: "40px" },
              width: "100%", // Takes full width of the parent Box
              maxWidth: "1200px", // Prevents exceeding the parent
              boxSizing: "border-box", // Includes padding in width
              overflowX: "auto", // Allows scrolling if content overflows
            }}
          >
            <h2 style={{ marginBottom: "40px", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
              ARCHS<sup>4</sup> Help
            </h2>

            <div
              className="shortcut"
              id="nav"
              style={{
                width: "100%",
                paddingLeft: { xs: "10px", sm: "30px" },
                marginBottom: "20px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span
                      style={{ cursor: "pointer", color: "black" }}
                      onClick={() => scrollPage("getting-started")}
                    >
                      Getting Started with ARCHS<sup>4</sup>
                    </span>
                  </h3>
                  <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("about")}>
                        About ARCHS<sup>4</sup>
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("downloadfiles")}>
                        Download files
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("genepages")}>
                        Gene landing pages
                      </span>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span
                      style={{ cursor: "pointer", color: "black" }}
                      onClick={() => scrollPage("datavisualization")}
                    >
                      Data visualization
                    </span>
                  </h3>
                  <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("dataviewer")}>
                        WebGL data viewer
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("vieweroptions")}>
                        Viewer options
                      </span>
                    </li>
                    <li>
                      <span
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => scrollPage("viewerinteraction")}
                      >
                        Viewer-user interaction
                      </span>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("genepages")}>
                      Gene pages
                    </span>
                  </h3>
                  <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                    <li>
                      <span
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => scrollPage("functionalprediction")}
                      >
                        Functional prediction
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("correlation")}>
                        Gene correlation
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("atlas")}>
                        Tissue expression atlas
                      </span>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("datahandling")}>
                      Data handling
                    </span>
                  </h3>
                  <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("fileformat")}>
                        About the H5 file format
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("parsing")}>
                        Parsing the H5 file
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("batcheffect")}>
                        Batch effect removal
                      </span>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("searchtools")}>
                      Search tools
                    </span>
                  </h3>
                  <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("metasearch")}>
                        Metadata search
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("sigsearch")}>
                        Signature search
                      </span>
                    </li>
                    <li>
                      <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("genesearch")}>
                        Gene search
                      </span>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("apidoc")}>
                      API documentation
                    </span>
                  </h3>
                  <h3 style={{ marginBottom: "10px" }}>
                    <span style={{ cursor: "pointer", color: "black" }} onClick={() => scrollPage("termsofuse")}>
                      Terms of use
                    </span>
                  </h3>
                </Grid>
              </Grid>
            </div>

            <div id="firststeps" style={{ marginTop: "40px" }}>
              <h2>
                First Steps{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>

              <div className="subpoint">
                <h4 id="about">
                  About ARCHS<sup>4</sup>
                </h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  ARCHS4 provides access to gene counts from all major sequencing platforms for human and mouse
                  experiments. The website allows download of the data in H5 format for programmatic access as well as a
                  3-dimensional view of the sample space. Search features allow browsing of the data by metadata
                  annotation, signature similarity and functional enrichment. Selected sample sets can be downloaded into
                  a tab separated through auto-generated R scripts for further analysis. Reads are aligned with Kallisto
                  using a custom cloud computing platform. Human samples are aligned against GRCh38 cdna reference and
                  mouse samples against GRCm38 cdna. All processable files from the GEO/SRA database since June 2024 are
                  processed and available for download.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="downloadfiles">Download files</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Raw read counts can be downloaded by browsing to the top of the ARCHS4 website and selecting the
                  Download option. The raw counts are separated by human and mouse samples and are provided in H5 format.
                  H5 provides efficient compression of the gene counts data. Tab separated files can be extracted with the
                  provided code and auto-generated scripts provided by the web interface. Selected sample and gene sets
                  are displayed in the Search Results section. Under downloads scripts can be downloaded for the given
                  gene sets. In case of gene sets a text file containing the gene symbols is provided. Gene sets can be
                  exported to Enrichr for further analysis.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="genepages">Gene landing pages</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Gene landing pages are accessible through the search fields on the top right of the ARCHS4 interface.
                  Genes can be searched by Entrez gene symbol. The gene search returns the expression distribution for
                  major tissues and cell lines and predictions of biological function and regulatory properties of the
                  target gene. If a gene is previously known to be part of a predicted gene set the terms are marked in
                  green. If a gene has sufficient number of prior knowledge annotations a ROC curve shows how well the
                  prior knowledge about the gene can be recovered.
                </p>
              </div>
            </div>

            <div id="datavisualization" style={{ marginTop: "40px" }}>
              <h2>
                Data visualization{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>

              <div className="subpoint">
                <h4 id="dataviewer">WebGL data viewer</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The data view port displays samples or genes relative to the other samples and genes in the dataset.
                  Samples/Genes with similar expression are clustered. The layout is computed with t-SNE. The
                  visualization is dynamic and allows rotation and zooming. The two icons on the top right are the manual
                  selection tool and a toggle button that moves the view port into a smaller window to the left of the
                  webpage. The colors of samples and gene sets can be modified in the result section.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="vieweroptions">Viewer options</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The data view can display 4 precalculated data visualizations: human samples, human genes, mouse samples
                  and mouse genes. To toggle between species, select either the human or mouse button on the left. To
                  change from sample view to gene view select one of the yellow buttons. A new view will automatically be
                  loaded on selection. Prior selections are saved and will be loaded again if the former mode is
                  selected. The colors of sample and gene sets can be modified in the result section.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="viewerinteraction">Viewer user interaction</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The visualization is dynamic an allows rotation and zoom. The two icons on the top right are the manual
                  selection tool and a toggle button that moves the view port into a smaller window to the left of the
                  webpage.
                </p>
              </div>
            </div>

            <div id="genepages" style={{ marginTop: "40px" }}>
              <h2>
                Gene pages{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>

              <div className="subpoint">
                <h4 id="functionalprediction">Functional Prediction</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The top 100 predictions of gene set membership accross multiple domains is shown in the tables on the
                  gene page. Gene set membership is predicted by membership by association. If a gene shares high
                  correlation with known members of a gene set it will get a high z-score during the membership
                  perediction. If a gene already has known functions/gene set memberships they are highlighted in green.
                  If a gene is extensively annotated a ROC curve shows how well known annotations could be recovered by
                  the algorithm. If there is no image the gene has not enough prior gene memberships to build a reliable
                  ROC curve.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="correlation">Gene correlation</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The gene correlation table contains the 100 most correlated genes to the gene of interest. The Pearson
                  correlation is calculated over all samples and tissues. The gene list can be uploaded to Enrichr for
                  further investigation.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="atlas">Tissue expression atlas</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The tissue and cell line expression atlas are calculated from samples in ARCHS4. The tissues are grouped
                  in multiple levels and cover a wide range of different cellular contexts. Since samples of any given
                  tissue can come from many distinct laboratoeries condition upon sample creation are not identical and
                  various subtypes of tissues can be mixed. This in comparison to GTEx can report the observed
                  variability in non homogenious sample groups.
                </p>
              </div>
            </div>

            <div id="datahandling" style={{ marginTop: "40px" }}>
              <h2>
                Data handling{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>

              <div className="subpoint">
                <h4 id="fileformat">About the H5 file format</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Hierarchical Data Format (HDF) is an open source file format for large data storage. It allows
                  programmatic accessibility of matrix entries based on column and row indices while allowing for
                  efficient data compression. The H5 files provided by ARCHS4 contain raw read counts as well as detailed
                  metadata information extracted from GEO.
                </p>
                <br />
                <div style={{ textAlign: "center" }}>
                  <iframe
                    width="100%"
                    height="315"
                    style={{ maxWidth: "560px" }}
                    src="https://www.youtube.com/embed/TjkWSBQuKoE"
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded YouTube Video"
                  ></iframe>
                </div>
                <p>
                  <br />
                  <strong>H5 metadata/data fields</strong>
                  <br />
                  <p>
                    H5 file structure with hierachical data fields. data/expression contains the expression matrix. In
                    this example there are 53511 genes and 1041306 samples. The meta field contains meta information for
                    genes and samples, as well as general information.
                  </p>
                  <br />
<pre style={{overflowX: "hidden", backgroundColor: "#fcf8ed", fontFamily: "monospace", whiteSpace: "pre", borderRadius: "6px", border: "1px solid black", padding: "50px" }}>

<strong>Fields</strong>                    <strong>Type</strong>     <strong>Dimensions</strong>
<br/><br/>
<strong>data</strong><br/>                      
│ expression                uint32 | (53511, 1041306)<br/>
<strong>meta</strong><br/>                      
│ <strong>genes</strong><br/>                     
│   biotype                 str    | (53511,)<br/>
│   ensembl_gene            str    | (53511,)<br/>
│   symbol                  str    | (53511,)<br/>
│ <strong>info</strong><br/>                      
│   author                  str    | ()<br/>
│   contact                 str    | ()<br/>
│   creation-date           str    | ()<br/>
│   laboratory              str    | ()<br/>
│   version                 str    | ()<br/>
│ <strong>samples</strong><br/>                 
│   alignedreads           float64 | (1041306,)<br/>
│   channel_count           str    | (1041306,)<br/>
│   characteristics_ch1     str    | (1041306,)<br/>
│   contact_address         str    | (1041306,)<br/>
│   contact_city            str    | (1041306,)<br/>
│   contact_country         str    | (1041306,)<br/>
│   contact_institute       str    | (1041306,)<br/>
│   contact_name            str    | (1041306,)<br/>
│   contact_zip             str    | (1041306,)<br/>
│   data_processing         str    | (1041306,)<br/>
│   extract_protocol_ch1    str    | (1041306,)<br/>
│   geo_accession           str    | (1041306,)<br/>
│   instrument_model        str    | (1041306,)<br/>
│   last_update_date        str    | (1041306,)<br/>
│   library_selection       str    | (1041306,)<br/>
│   library_source          str    | (1041306,)<br/>
│   library_strategy        str    | (1041306,)<br/>
│   molecule_ch1            str    | (1041306,)<br/>
│   organism_ch1            str    | (1041306,)<br/>
│   platform_id             str    | (1041306,)<br/>
│   relation                str    | (1041306,)<br/>
│   sample                  str    | (1041306,)<br/>
│   series_id               str    | (1041306,)<br/>
│   singlecellprobability  float64 | (1041306,)<br/>
│   source_name_ch1         str    | (1041306,)<br/>
│   status                  str    | (1041306,)<br/>
│   submission_date         str    | (1041306,)<br/>
│   taxid_ch1               str    | (1041306,)<br/>
│   title                   str    | (1041306,)<br/>
│   type                    str    | (1041306,)<br/>
  </pre>
                </p>
              </div>

              <div className="subpoint">
                <h4 id="parsing">Parsing the H5 file</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  The recommended way to interact with the ARCHS4 H5 files is the official <strong>archs4py</strong> Python
                  package. Full documentation can be found on the GitHub page:{" "}
                  <a href="https://github.com/MaayanLab/archs4py">https://github.com/MaayanLab/archs4py</a>. The package
                  supports a wide variety of functions, such as data download, data extraction, metadata search, and local
                  execution of the ARCHS4 sequence alignment. We are also providing an R package with similar
                  functionality (<strong>archs4r</strong>). The Documentation can be found here:{" "}
                  <a href="https://github.com/MaayanLab/archs4r">https://github.com/MaayanLab/archs4r</a>
                </p>
                <br />
                <br />
                <p>
                  <strong>Install archs4py</strong>
                  <CodeBlock language="bash">{`pip3 install archs4py`}</CodeBlock>
                </p>

                <p>
                  <strong>Example use (Python):</strong>
                  <br />
                  For full documentation of parameters and options refer to the GitHub documentation.{" "}
                  <a href="https://github.com/MaayanLab/archs4py">https://github.com/MaayanLab/archs4py</a>
                  <CodeBlock language="python">{`import archs4py as a4

file = "human_gene_v2.6.h5"

# list file structure
a4.ls(file)

# Data extraction module
# ----------------------

# extract 100 random samples and remove sinle cell data
rand_counts = a4.data.rand(file, 100, remove_sc=True)

# get counts for samples at position [0,1,2,3,4]
pos_counts = a4.data.index(file, [0,1,2,3,4])

# search and extract samples matching regex (ignores whitespaces)
meta_counts = a4.data.meta(file, "myoblast", remove_sc=True)

#get sample counts
sample_counts = a4.data.samples(file, ["GSM1158284","GSM1482938","GSM1562817"])

#get sample counts for samples belonging to GSE64016
series_counts = a4.data.series(file, "GSE64016")

# Metadata module
# ---------------

# get sample meta data based on search term
meta_meta = a4.meta.meta(file, "myoblast", meta_fields=["characteristics_ch1", "source_name_ch1"])

# get sample meta data
sample_meta = a4.meta.samples(file, ["GSM1158284","GSM1482938","GSM1562817"])

# get series meta data
series_meta = a4.meta.series(file, "GSE64016")

# get all entries of a meta data field for all samples. In this example get all sample ids and gene symbols in H5 file
all_samples = a4.meta.field(file, "geo_accession")
all_symbols = a4.meta.field(file, "symbol")

# Utility functions
# -----------------

exp = a4.data.rand(file, 100, remove_sc=True)

# aggregate duplicate genes
exp_deduplicated = a4.utils.aggregate_duplicate_genes(exp)

# filter genes with low expression
exp_filtered = a4.utils.filter_genes(exp, readThreshold=50, sampleThreshold=0.02, deterministic=True, aggregate=True)

# normalize gene expression to correct for library size
exp_normalized = a4.normalize(exp, method="log_quantile")
`}</CodeBlock>
                </p>
              </div>

              <div className="subpoint">
                <h4 id="batcheffect">Batch effect correction</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Extracted samples from a specified tissue can originate from multiple series with slightly different
                  experimental conditions. If desired batch effects from gene expression can be removed with the Combat
                  library.
                </p>
                <br />
                <br />
                <div style={{ textAlign: "center" }}>
                  <iframe
                    width="100%"
                    height="315"
                    style={{ maxWidth: "560px" }}
                    src="https://www.youtube.com/embed/3wjbxDex7_8"
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded YouTube Video"
                  ></iframe>
                </div>
              </div>
            </div>

            <div id="searchtools" style={{ marginTop: "40px" }}>
              <h2>
                Search tools{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>

              <div className="subpoint">
                <h4 id="metasearch">Metadata search</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Metadata search parses the tissue description field from GEO to find matches with the entered search
                  term. The search ignores spaces and is case insensitive. Results are highliged in the data viewer and a
                  result is added to the result list. We preselected a series of cellular tissues based by cellular
                  system. This allows simple browsing of the data for tissues of interest. Some tissue selections can
                  return empty for either mouse or human samples.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="sigsearch">Signature Search</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Signature search uses a list of high expressed genes and low expressed genes and identifies samples
                  that match the given input. The gene expression is z-score normalized across samples to identify the
                  relative gene expression.
                </p>
              </div>

              <div className="subpoint">
                <h4 id="genesearch">Gene search</h4>
                <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                  Open gene landing page when searching by gene symbol. A set of genes can be highlighted by selecting a
                  gene set library and a corresponding gene set.
                </p>
              </div>

              <div className="subpoint">
                <ApiDocumentation />
              </div>
            </div>

            <div>
              <h2 id="termsofuse" style={{ marginTop: "40px" }}>
                Terms of use{" "}
                <span style={{ cursor: "pointer" }} onClick={() => scrollPage("nav")}>
                  ↑
                </span>
              </h2>
              <br />
              <h4>Licences</h4>

              <Grid container spacing={2} direction={{ xs: "column", sm: "row" }}>
                <Grid item>
                  <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                    <img
                      alt="Creative Commons License"
                      style={{ borderWidth: 0, width: "200px" }}
                      src={creativecommons}
                    />
                  </a>
                </Grid>
                <Grid item>
                  <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                    Source code is available under the{" "}
                    <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache Licence 2.0</a>. Provided gene expression
                    files available under the{" "}
                    <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                      Creative Commons Attribution 4.0 International License
                    </a>. All data is free to use for non-commercial purposes. For commercial use please contact{" "}
                    <a href="https://www.ip.mountsinai.org/">MSIP</a>.
                  </p>
                </Grid>
              </Grid>

              <br />
              <h4>Citation</h4>
              <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
              <Grid container spacing={2} direction="row" alignItems="center">
  <Grid item xs={2} sm={1}>
    <img
      alt="Citation"
      style={{ borderWidth: 0, width: "70px", display: "block" }}
      src={citation}
    />
  </Grid>
  <Grid item xs={10} sm={11}>
    <div>
      <b>
        Please acknowledge ARCHS<sup>4</sup> in your publications by citing the following reference:
      </b>
      <br />
      <div className="citation">
        Lachmann A, Torre D, Keenan AB, Jagodnik KM, Lee HJ, Wang L, Silverstein MC, Ma’ayan A. Massive
        mining of publicly available RNA-seq data from human and mouse. Nature Communications 9. Article
        number: 1366 (2018), doi:10.1038/s41467-018-03751-6
      </div>
      <a
        href="https://www.nature.com/articles/s41467-018-03751-6"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      </a>
    </div>
  </Grid>
</Grid>
              </p>

              <br />
              <h4>Disclaimer</h4>
              <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                ARCHS<sup>4</sup> is not to be used for treating or diagnosing human subjects. ARCHS<sup>4</sup> or any
                documents available from this server are provided as is without any warranty of any kind, either express,
                implied, or statutory, including, but not limited to, any implied warranties of merchantability, fitness
                for particular purpose and freedom from infringement, or that ARCHS<sup>4</sup> or any documents available
                from this server will be error free. The Ma'ayan lab makes no representations that the use of ARCHS
                <sup>4</sup> or any documents available from this server will not infringe any patent or proprietary
                rights of third parties.
              </p>
              <p style={{ fontSize: { xs: "12px", sm: "14px" } }}>
                In no event will the Ma'ayan lab or any of its members be liable for any damages, including but not
                limited to direct, indirect, special or consequential damages, arising out of, resulting from, or in any
                way connected with the use of ARCHS<sup>4</sup> or documents available from this server.
              </p>
            </div>
          </Paper>
        </Box>
      </Box>

      <FooterSection />
    </>
  );
};