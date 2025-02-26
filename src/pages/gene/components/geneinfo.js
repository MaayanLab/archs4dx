import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { Grid, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { faDna } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeneSearch } from "../../../layout/genesearch";

export const GeneInfo = ({ geneName }) => {
  const [data, setData] = useState(null);
  const [gene, setGene] = useState(geneName);
  const [loading, setLoading] = useState(true);

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

      const jsonData = await response.json();
      console.log(jsonData);

      // Set data only if it exists, otherwise set to null
      setData(jsonData?.data?.geneBySymbol || null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching gene data:", err);
      setData(null); // Set data to null on error
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geneName) {
      fetchGeneData(geneName);
    } else {
      setLoading(false); // If no geneName is provided, stop loading
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
              {data?.description || "No description available."}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <GeneSearch />
          </Grid>
          <Grid item md={7}>
            <Typography>
              <b>Description: </b>
              {data?.summary || "No summary available."}
            </Typography>
          </Grid>

          <Grid
            item
            style={{ textAlign: "top", fontSize: "14px" }}
            md={5}
          >
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
            </div>
          </Grid>
        </Grid>
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
      </Box>
    </>
  );
};