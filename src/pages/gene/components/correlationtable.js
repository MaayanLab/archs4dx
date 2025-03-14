import DataTable from 'react-data-table-component';
import React from 'react';

// Define the columns for the DataTable
const columns = [
  {
    name: 'Rank',
    selector: row => row.rank,
    sortable: true,
    width: "80px"
  },
  {
    name: 'Gene',
    selector: row => row.gene,
    sortable: true,
  },
  {
    name: 'Correlation',
    selector: row => row.correlation,
    sortable: true,
    width: "115px"
  },
  {
    name: 'Mean Log Exp',
    selector: row => row.mean_log_expression,
    sortable: true,
    width: "125px"
  },
];

// Utility function to download table as CSV
const downloadCSV = (data, filename) => {
  const csvRows = [];
  const headers = ['Rank', 'Gene', 'Correlation', 'Mean Log Exp'];
  csvRows.push(headers.join(','));

  data.forEach(row => {
    const values = [
      row.rank,
      row.gene,
      row.correlation,
      row.mean_log_expression
    ];
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'correlation_table.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Utility function to send data to Enrichr
const sendToEnrichr = (genes, description = "Correlation Table from ARCHS4") => {
  if (!genes || genes.length === 0) {
    alert("No genes available to send to Enrichr.");
    return;
  }

  const geneList = genes.join('\n');
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "https://maayanlab.cloud/Enrichr/enrich");
  form.setAttribute("target", "_blank");
  form.setAttribute("enctype", "multipart/form-data");

  const listField = document.createElement("input");
  listField.setAttribute("type", "hidden");
  listField.setAttribute("name", "list");
  listField.setAttribute("value", geneList);
  form.appendChild(listField);

  const descField = document.createElement("input");
  descField.setAttribute("type", "hidden");
  descField.setAttribute("name", "description");
  descField.setAttribute("value", description);
  form.appendChild(descField);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const CorrelationTable = ({ tableData, searchTerm, gene, direction }) => {
  if (!tableData || tableData.length === 0) {
    return null;
  }

  // Prepare the data for the table
  const updatedData = tableData.map((element, index) => ({
    ...element,
    rank: index + 1,
    correlation: parseFloat(element.correlation.toFixed(3)),
    mean_log_expression: parseFloat(element.mean_log_expression.toFixed(3))
  }));

  // Extract genes for Enrichr
  const geneList = updatedData.map(row => row.gene);

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={columns}
        data={updatedData}
        pagination
        striped
        dense
        highlightOnHover
      />
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        <button
          onClick={() => downloadCSV(updatedData, 'correlation_table.csv')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: '#45c19f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download Table
        </button>
        <button
          onClick={() => sendToEnrichr(geneList, searchTerm+" - ARCHS4 "+direction+" correlation "+gene)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff6f61',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send to Enrichr
        </button>
      </div>
    </div>
  );
};