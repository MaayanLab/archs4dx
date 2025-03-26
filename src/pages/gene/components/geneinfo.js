import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from "react-router-dom";
import { faDna } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeneSearch } from "../../../layout/genesearch";
import aiicon from "../../../image/airead.png";

export const GeneInfo = ({ geneName }) => {
  const [data, setData] = useState(null);
  const [gene, setGene] = useState(geneName);
  const [loading, setLoading] = useState(true);
  const [isSigPyAbstract, setIsSigPyAbstract] = useState(false);
  const [citations, setCitations] = useState([]);

  const scrollPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const fetchGeneData = async (geneName) => {
    try {
      const response = await fetch(
        `https://rummagene.com/graphql?query={geneBySymbol(symbol:%22${geneName}%22){symbol,synonyms,description,summary}}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let jsonData = await response.json();
      console.log(jsonData);

      const sigpyResponse = await fetch(
        `https://maayanlab.cloud/sigpy/abstract/${encodeURIComponent(geneName)}`
      );
      
      if (!sigpyResponse.ok) {
        throw new Error("SigPy API response was not ok");
      }
      let jsonSigpy = await sigpyResponse.json();
      const hasAbstract = jsonSigpy.abstract && Object.keys(jsonSigpy.abstract).length > 0;
      if (hasAbstract) {
        jsonData.data.geneBySymbol.summary = jsonSigpy.abstract;
        setIsSigPyAbstract(true);

        const pmidData = extractPMIDs(jsonSigpy.abstract);
        if (pmidData.length > 0) {
          const pmids = pmidData.map(item => item.pmid);
          const citationData = await fetchCitations(pmids);
          const enrichedCitations = citationData
            .map(citation => {
              const match = pmidData.find(item => item.pmid === citation.pmid.toString());
              return { ...citation, number: match ? match.number : null };
            })
            .sort((a, b) => {
              const numA = a.number ? parseInt(a.number, 10) : Infinity;
              const numB = b.number ? parseInt(b.number, 10) : Infinity;
              return numA - numB;
            });
          setCitations(enrichedCitations);
        }
      } else {
        setIsSigPyAbstract(false);
      }

      setData(jsonData?.data?.geneBySymbol || null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching gene data:", err);
      setData(null);
      setIsSigPyAbstract(false);
      setCitations([]);
      setLoading(false);
    }
  };

  const extractPMIDs = (htmlText) => {
    const pmidRegex = /<a\s+href="https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\/?"\s+target="_blank">(\d+)<\/a>/g;
    const matches = [...htmlText.matchAll(pmidRegex)];
    const pmidData = matches.map(match => ({
      pmid: match[1],
      number: match[2]
    }));
    return pmidData;
  };

  const fetchCitations = async (pmids) => {
    try {
      const response = await fetch(
        `https://icite.od.nih.gov/api/pubs?pmids=${pmids.join(',')}`
      );
      if (!response.ok) {
        throw new Error("iCite API response was not ok");
      }
      const jsonData = await response.json();
      return jsonData.data || [];
    } catch (err) {
      console.error("Error fetching citations:", err);
      return [];
    }
  };

  // Function to abbreviate authors
  const formatAuthors = (authors) => {
    if (!authors) return "Unknown Authors";
    const authorList = authors.split(", ");
    if (authorList.length <= 3) return authors;
    return `${authorList.slice(0, 3).join(", ")}, et al.`;
  };

  useEffect(() => {
    if (geneName) {
      fetchGeneData(geneName);
    } else {
      setLoading(false);
    }
  }, [geneName]);

  if (loading) {
    return <Typography>Waiting...</Typography>;
  }

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item md={7}>
            <h2>
              <FontAwesomeIcon icon={faDna} /> {geneName}
            </h2>
            <Typography>
              {data?.description || "Coming soon!"}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <GeneSearch />
          </Grid>
          <Grid item md={7}>
            <Typography component="div">
              <b>Description: </b>
              {data?.summary ? (
                <>
                  <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: data.summary }} />
                  {isSigPyAbstract && (
                    <>
                      {/* Expandable list of citations with no grey line when collapsed */}
                      {citations.length > 0 && (
                        <Accordion
                          sx={{
                            border: "none",
                            boxShadow: "none",
                            padding: "0px",
                            '&:before': { display: 'none' } // Remove the grey line
                          }}
                          style={{ marginTop: "10px" }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ padding: "0px" }}
                          >
                            <Typography>Cited Publications ({citations.length})</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ padding: "0px" }}>
                            <ul style={{ paddingLeft: "0", listStyleType: "none", margin: "0" }}>
                              {citations.map((citation) => (
                                <li key={citation.pmid} style={{ marginBottom: "10px" }}>
                                  <Typography>
                                   <strong>[{citation.number}]</strong> {formatAuthors(citation.authors)} <strong>{citation.title}</strong> <em>{citation.journal} ({citation.year})</em>
                                    {citation.doi && (
                                      <>
                                        {" "}—{" "}
                                        <a
                                          href={`https://doi.org/${citation.doi}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          DOI: {citation.doi}
                                        </a>
                                      </>
                                    )}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      <div style={{ width: "100%", color: "grey", textAlign: "right" }}>
                        AI generated gene description 
                        <img
                          src={aiicon}
                          alt="AI Generated Abstract"
                          style={{ width: "80px", height: "80px", marginLeft: "8px", verticalAlign: "middle" }}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                "Coming soon!"
              )}
            </Typography>
          </Grid>

          {/* Rest of the Grid items remain unchanged */}
          <Grid item style={{ textAlign: "top", fontSize: "14px" }} md={5}>
            <div
              style={{
                float: "right",
                padding: "20px",
                paddingBottom: "0px",
              }}
            >
              <h2>Quick links</h2>
              <b>Predicted gene annotations</b>
              <br />
              <a href="#go_bio" onClick={() => scrollPage("GO_Biological_Process_2021")}>
                GO
              </a>{" "}
              |{" "}
              <a href="#chea" onClick={() => scrollPage("ChEA_2022")}>
                ChEA
              </a>{" "}
              |{" "}
              <a href="#gwas" onClick={() => scrollPage("GWAS_Catalog_2019")}>
                GWAS
              </a>{" "}
              |{" "}
              <a href="#mgi" onClick={() => scrollPage("MGI_Mammalian_Phenotype_Level_4_2021")}>
                Mouse Phenotype
              </a>{" "}
              |{" "}
              <a href="#humph" onClick={() => scrollPage("Human_Phenotype_Ontology")}>
                Human Phenotype
              </a>{" "}
              |{" "}
              <a href="#kea" onClick={() => scrollPage("KEA_2015")}>
                KEA
              </a>{" "}
              |{" "}
              <a href="#kegg" onClick={() => scrollPage("KEGG_2021_Human")}>
                KEGG
              </a>{" "}
              |{" "}
              <a href="#omim" onClick={() => scrollPage("OMIM_Disease")}>
                OMIM
              </a>{" "}
              |{" "}
              <a href="#humap" onClick={() => scrollPage("huMAP")}>
                huMAP
              </a>
              <br />
              <b>Most similar genes based on co-expression</b>
              <br />
              <a href="#correlation" onClick={() => scrollPage("correlation")}>
                Pearson correlation
              </a>{" "}
              |{" "}
              <a href="#correlation" onClick={() => scrollPage("correlation")}>
                Context specific correlation
              </a>
              <br />
              <b>Tissues and cell line expression</b>
              <br />
              <a href="#tissueexpression" onClick={() => scrollPage("tissueexpression")}>
                Tissue Expression
              </a>{" "}
              |{" "}
              <a href="#celllineexpression" onClick={() => scrollPage("celllineexpression")}>
                Cell Line Expression
              </a>

              <br /><br />
              <b>External links</b>
              <Grid container spacing={0.6}>
                <Grid item>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/gene/?term=${geneName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NCBI Entrez Gene
                  </a>
                </Grid>
                <Grid item>|</Grid>
                <Grid item>
                  <a
                    href={`http://www.genecards.org/cgi-bin/carddisp.pl?gene=${geneName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GeneCards
                  </a>
                </Grid>
                <Grid item>|</Grid>
                <Grid item>
                  <a
                    href={`https://amp.pharm.mssm.edu/Harmonizome/gene/${geneName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Harmonizome
                  </a>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};