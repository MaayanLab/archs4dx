import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';

const PredictionTables = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://maayanlab.cloud/prismexp/api/v1/gene/SOX2');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array, so this effect runs once on mount

  return (
    <div>
    </div>
  );
};
