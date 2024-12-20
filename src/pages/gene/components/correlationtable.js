import DataTable from 'react-data-table-component';

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

export const CorrelationTable = ({tableData}) => {

    if (!tableData || tableData.length === 0) {
        return null;
      }

      const updatedData = tableData.map((element, index) => ({
        ...element,
        rank: index + 1,
        correlation: parseFloat(element.correlation.toFixed(3)), 
        mean_log_expression: parseFloat(element.mean_log_expression.toFixed(3))
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