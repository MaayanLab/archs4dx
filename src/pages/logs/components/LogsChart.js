import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LogsChart = ({ logShowData }) => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (!logShowData || Object.keys(logShowData).length === 0) return;

    // Process log data
    const months = [];
    const monthMap = new Map(); // Map of YYYY-MM to {category: count}
    const categoryTotals = {}; // Track total entries per category
    const categories = Object.keys(logShowData);

    // Generate month labels between start and end dates
    let current = new Date(startDate);
    while (current <= endDate) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthKey);
      monthMap.set(monthKey, {});
      current.setMonth(current.getMonth() + 1);
    }

    // Count entries per category per month and total entries
    categories.forEach(category => {
      categoryTotals[category] = 0;
      logShowData[category].forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        if (timestamp >= startDate && timestamp <= endDate) {
          const monthKey = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`;
          if (monthMap.has(monthKey)) {
            monthMap.get(monthKey)[category] = (monthMap.get(monthKey)[category] || 0) + 1;
            categoryTotals[category] += 1;
          }
        }
      });
    });

    // Filter categories with more than 100 entries
    const filteredCategories = categories.filter(category => categoryTotals[category] > 100);

    // Prepare chart data
    const datasets = filteredCategories.map(category => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      data: months.map(month => monthMap.get(month)[category] || 0),
      backgroundColor: getColor(category),
    }));

    setChartData({
      labels: months,
      datasets,
    });
  }, [logShowData, startDate, endDate]);

  // Assign distinct colors for each category
  const getColor = (category) => {
    const colors = {
      correlation: '#FF6384',
      download: '#36A2EB',
      genesearch: '#FFCE56',
      markergenes: '#4BC0C0',
      metadownload: '#9966FF',
      regex_search: '#FF9F40',
      'pipeline/packaging_human_gene': '#C9CBCF',
      'pipeline/packaging_human_transcript': '#E7E9ED',
      'pipeline/packaging_mouse_gene': '#ADFF2F',
      'pipeline/packaging_mouse_transcript': '#00FF7F',
      'pipeline/samplediscovery': '#FFD700',
      'pipeline/samplepackaging': '#FF4500',
      'pipeline_packaging_human_gene': '#6A5ACD',
    };
    return colors[category] || '#888888';
  };

  // Generate and download CSV
  const downloadCSV = () => {
    if (!chartData) return;

    // Prepare CSV headers
    const headers = ['Month', ...chartData.datasets.map(dataset => dataset.label)];
    // Prepare CSV rows
    const rows = chartData.labels.map((month, index) => [
      month,
      ...chartData.datasets.map(dataset => dataset.data[index] || 0),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'log_counts_by_category.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Log Entries by Category (Monthly, >100 Entries)',
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Log Entries',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Log Activity Chart
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="body2">Start Date:</Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={endDate}
            dateFormat="yyyy-MM-dd"
            customInput={<Button variant="outlined">{startDate.toISOString().split('T')[0]}</Button>}
          />
        </Box>
        <Box>
          <Typography variant="body2">End Date:</Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            customInput={<Button variant="outlined">{endDate.toISOString().split('T')[0]}</Button>}
          />
        </Box>
      </Box>
      
      {chartData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: '100%', height: 400 }}>
          <Bar data={chartData} options={options} />
        </Box>
      ) : (
        <Typography>Loading chart...</Typography>
      )}
      {chartData && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={downloadCSV}>
            Download CSV
          </Button>
        </Box>
      )}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1, marginTop: "40px" }}>
        <Typography variant="subtitle4">Category Explanation</Typography>
        <Typography variant="body4">
          <strong>Download:</strong> h5 bulk file downloads
        </Typography>
        <Typography variant="body4">
          <strong>Correlation:</strong> Tissue specific gene correlation given a gene of interest
        </Typography>
        <Typography variant="body4">
          <strong>Genesearch:</strong> Gene page access
        </Typography>
        <Typography variant="body4">
          <strong>Markergenes:</strong> Find upregulated genes in sample context using regular expression
        </Typography>
        <Typography variant="body4">
          <strong>Metadownload:</strong> Download gene expression matrix from data explorer using regular expression
        </Typography>
        <Typography variant="body4">
          <strong>Regex_search:</strong> Search samples in data explorer using regular expression
        </Typography>
      </Box>
    </Box>
  );
};

export default LogsChart;