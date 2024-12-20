import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import {Table} from "./table"
import { Grid, Box, Typography } from "@mui/material";

export const PrismExp = ({geneSymbol}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://maayanlab.cloud/prismexp/api/v1/gene/${geneSymbol}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return null;
  }

  const { predictions } = data;

  return (
    <div>
        <Grid container>
        {Object.entries(predictions).map(([key, value]) => (
            <Grid key={key} item xs={12} lg={12} xl={6} sx={{padding: "20px"}}>
            <h2 id={key}>{key.replaceAll("_", " ")}</h2>
            <Table tableData={value.prediction} title={key} />
            </Grid>
        
        ))}
        </Grid>
    </div>
  );
};