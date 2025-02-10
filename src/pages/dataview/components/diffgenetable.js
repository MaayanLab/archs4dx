import DataTable from 'react-data-table-component';

const columns = [
	{
		name: 'Gene',
		selector: row => row.gene,
        sortable: true,
        width: "120px"

	},
    {
		name: 'Diff',
		selector: row => row.t,
        sortable: true,
        width: "120px"
	}
];

export const DiffTable = ({tableData}) => {

    if (!tableData || tableData.length === 0) {
        return null;
      }
      console.log(tableData);
      const updatedData = tableData.map((element, index) => ({
        ...element, 
        mean_expression_search: parseFloat(element.mean_expression_search.toFixed(3)),
        mean_expression_control: parseFloat(element.mean_expression_control.toFixed(3)),
        fdr: parseFloat(element.fdr.toFixed(3)),
        t: parseFloat(element.t.toFixed(3)),
      }));
    
	return (
		<DataTable
			columns={columns}
			data={updatedData}
            pagination
            striped
            dense
            highlightOnHover
            style={{width: "240px", tableLayout: "fixed" }}
		/>
	);
};