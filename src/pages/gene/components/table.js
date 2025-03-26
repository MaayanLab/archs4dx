import DataTable from 'react-data-table-component';
import { Button } from '@mui/material';

const columns = [
  {
    name: 'Rank',
    selector: row => row.rank,
    sortable: true,
    width: "80px"
  },
  {
    name: 'Gene Set',
    selector: row => row.term,
    sortable: true,
    grow: 4,
  },
  {
    name: 'z-score',
    selector: row => row.score,
    sortable: true,
    width: "100px"
  },
  {
    name: 'Set AUC',
    selector: row => row.term_auc,
    sortable: true,
    width: "96px"
  },
];

export const Table = ({ tableData, goldFlagKey = 'is_gold' }) => {
  if (!tableData || tableData.length === 0) {
    return null;
  }

  const updatedData = tableData.map((element, index) => ({
    ...element,
    rank: index + 1, // Corrected from "rank fit" to "rank"
    score: parseFloat(element.score.toFixed(3)), 
    term_auc: parseFloat(element.term_auc.toFixed(3))
  }));

  // Define conditional row styles
  const conditionalRowStyles = [
    {
      when: row => row[goldFlagKey], // Check if the row has is_gold === true
      style: {
        backgroundColor: '#b0f9e9', // Light green for gold entries
        '&:hover': {
          backgroundColor: '#5edbc0 !important', // Slightly darker green on hover
        },
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={updatedData}
      pagination
      striped
      dense
      highlightOnHover
      conditionalRowStyles={conditionalRowStyles} // Apply the conditional styles
    />
  );
};