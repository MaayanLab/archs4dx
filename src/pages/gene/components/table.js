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
		name: 'AUC',
		selector: row => row.term_auc,
        sortable: true,
        width: "80px"
	},
];


export const Table = ({tableData}) => {

    if (!tableData || tableData.length === 0) {
        // Checks if table_data is null, undefined, or an empty array
        return null;
      }

      const updatedData = tableData.map((element, index) => ({
        ...element,
        rank: index + 1,
        score: parseFloat(element.score.toFixed(3)), 
        term_auc: parseFloat(element.term_auc.toFixed(3))
      }));
    
	return (
		<DataTable
			columns={columns}
			data={updatedData}
            pagination
            striped
            dense
            highlightOnHover
		/>
	);
};