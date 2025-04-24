import { Helmet } from "react-helmet-async";
import { FooterSection } from "../../layout/footer";
import { NavBar } from "../../layout/navbar";
import data from "../../data/config.json";
import { UserMenu } from "../dashboard/components/user-menu";
import React, { useState, useEffect, useRef } from 'react';
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import { Box, Typography, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const drawerWidth = 344;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  boxShadow: "none",
  background: "#EFF4F5",
  height: "93px",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const LogsPage = () => {
    const [open, setOpen] = useState(false);
    const [hasUserId, setHasUserId] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState([]);
    const [versionFiles, setVersionFiles] = useState([]);
    const [pipelineStatus, setPipelineStatus] = useState([]);
    const [pipelineTasks, setPipelineTasks] = useState([]);
    const [logShowData, setLogShowData] = useState({});

    const categoryRef = useRef(null);
    const versionRef = useRef(null);
    const statusRef = useRef(null);
    const tasksRef = useRef(null);
    const logShowRef = useRef(null);

    const toggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        // Check user ID
        const checkUserId = async () => {
            try {
                const response = await fetch('https://archs4.org/api/user/i');
                const data = await response.json();
                if (data && data.id) {
                    setHasUserId(true);
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };

        // Fetch category counts
        const fetchCategoryCounts = async () => {
            try {
                const response = await fetch('https://archs4.org/api/log/categorycounts');
                const data = await response.json();
                const formattedData = Object.entries(data.counts).map(([category, count], index) => ({
                    id: index,
                    category,
                    count
                }));
                setCategoryCounts(formattedData);
            } catch (error) {
                console.log('Error fetching category counts:', error);
            }
        };

        // Fetch version files
        const fetchVersionFiles = async () => {
            try {
                const response = await fetch('https://archs4.org/api/versionfile');
                const data = await response.json();
                const formattedData = data.versionfiles.map(file => ({
                    ...file,
                    version: `${file.version_major}.${file.version_minor}`,
                    file_size_gb: (file.file_size / 1e9).toFixed(2),
                    // Convert timestamp to ISO string for sorting and keep original for display
                    sort_timestamp: new Date(file.timestamp).toISOString(),
                    display_timestamp: file.timestamp
                }));
                setVersionFiles(formattedData);
            } catch (error) {
                console.log('Error fetching version files:', error);
            }
        };

        // Fetch pipeline overview
        const fetchPipelineStatus = async () => {
            try {
                const response = await fetch('https://archs4.org/api/pipeline/overview');
                const data = await response.json();
                const formattedData = [
                    { id: 1, metric: 'Completed', value: data.status.completed },
                    { id: 2, metric: 'Failed', value: data.status.failed },
                    { id: 3, metric: 'Submitted', value: data.status.submitted },
                    { id: 4, metric: 'Waiting', value: data.status.waiting },
                    { id: 5, metric: 'Current Time', value: data.status.current_time }
                ];
                setPipelineStatus(formattedData);
            } catch (error) {
                console.log('Error fetching pipeline status:', error);
            }
        };

        // Fetch pipeline tasks
        const fetchPipelineTasks = async () => {
            try {
                const response = await fetch('https://archs4.org/api/log/pipeline/tasks');
                const data = await response.json();
                const formattedData = Object.entries(data.log).map(([task, info], index) => ({
                    id: index,
                    task,
                    date: info.date,
                    status: info.entry
                }));
                setPipelineTasks(formattedData);
            } catch (error) {
                console.log('Error fetching pipeline tasks:', error);
            }
        };

        // Fetch log show data
        const fetchLogShowData = async () => {
            try {
                const response = await fetch('https://archs4.org/api/log/show');
                const data = await response.json();
                const formattedData = {};
                Object.keys(data.counts).forEach(category => {
                    formattedData[category] = data.counts[category].map((entry, index) => ({
                        id: `${category}-${index}`,
                        ...entry
                    }));
                });
                setLogShowData(formattedData);
            } catch (error) {
                console.log('Error fetching log show data:', error);
            }
        };

        checkUserId();
        fetchCategoryCounts();
        fetchVersionFiles();
        fetchPipelineStatus();
        fetchPipelineTasks();
        fetchLogShowData();
    }, []);

    const categoryColumns = [
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'count', headerName: 'Count', flex: 1 }
    ];

    const versionColumns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'species', headerName: 'Species', flex: 1 },
        { field: 'data_level', headerName: 'Data Level', flex: 1 },
        { field: 'version', headerName: 'Version', flex: 1 },
        { field: 'file_size_gb', headerName: 'File Size (GB)', flex: 1 },
        { field: 'samples', headerName: 'Samples', flex: 1 },
        { field: 'display_timestamp', headerName: 'Timestamp', flex: 1 }
    ];

    const statusColumns = [
        { field: 'metric', headerName: 'Metric', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1 }
    ];

    const taskColumns = [
        { field: 'task', headerName: 'Task', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 }
    ];

    const logShowColumns = {
        correlation: [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Log Entry', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        download: [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'File Downloaded', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        genesearch: [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Gene Searched', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        markergenes: [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Marker Gene/Tissue', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        metadownload: [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Metadata', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/packaging_human_gene': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Status', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/packaging_human_transcript': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Status', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/packaging_mouse_gene': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Status', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/packaging_mouse_transcript': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Status', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/samplediscovery': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Sample Count', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline/samplepackaging': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Sample Count', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'pipeline_packaging_human_gene': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Status', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ],
        'regex_search': [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'log_category', headerName: 'Category', flex: 1 },
            { field: 'log_entry', headerName: 'Search Query', flex: 2 },
            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
            { field: 'user_id', headerName: 'User ID', flex: 1 }
        ]
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const tableStyles = {
        '& .MuiDataGrid-root': {
            border: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontSize: '0.85rem',
            minHeight: '40px !important',
            maxHeight: '40px !important',
        },
        '& .MuiDataGrid-cell': {
            fontSize: '0.75rem',
            padding: '2px 6px',
        },
        '& .MuiDataGrid-row': {
            minHeight: '28px !important',
            maxHeight: '28px !important',
        },
        '& .MuiDataGrid-row:hover': {
            backgroundColor: '#e3f2fd',
        },
        '& .MuiDataGrid-toolbarContainer': {
            padding: '4px',
        },
        '& .MuiTablePagination-root': {
            fontSize: '0.75rem',
        },
        '& .MuiTablePagination-selectLabel': {
            fontSize: '0.75rem',
        },
        '& .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem',
        },
        '& .MuiTablePagination-select': {
            fontSize: '0.75rem',
        },
        '& .MuiTablePagination-menuItem': {
            fontSize: '0.75rem',
        },
    };

    return (
        <>
            <Helmet>
                <title>{data.general.project_title}</title>
                <link rel="icon" type="image/png" href={data.general.project_icon} />
                <meta name="description" content="ARCHS4" />
            </Helmet>

            {hasUserId ? (
                <AppBar position="fixed" open={open}>
                    <UserMenu sidebarOpen={open} toggleSidebar={toggle} landingPage={true} />
                </AppBar>
            ) : (
                <AppBar position="fixed" open={open}>
                    <NavBar />
                </AppBar>
            )}
            <div style={{ height: "90px" }}></div>

            <Box sx={{
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'url(../congruent_pentagon2.png)',
                marginTop: "0px",
                boxShadow: 'inset 0px -4px 8px rgba(0,0,0,0.2)',
                minHeight: '80vh',
            }}>
                <Paper sx={{ margin: "40px", padding: "40px", width: '80%' }}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={() => scrollToSection(categoryRef)}>Category Counts</Button>
                        <Button variant="contained" onClick={() => scrollToSection(versionRef)}>Version Files</Button>
                        <Button variant="contained" onClick={() => scrollToSection(statusRef)}>Pipeline Status</Button>
                        <Button variant="contained" onClick={() => scrollToSection(tasksRef)}>Pipeline Tasks</Button>
                        <Button variant="contained" onClick={() => scrollToSection(logShowRef)}>Log Show</Button>
                    </Box>
                    <Grid container spacing={3}>
                        {/* Category Counts */}
                        <Grid item xs={12} ref={categoryRef}>
                            <Typography variant="h5" gutterBottom>Category Counts</Typography>
                            <DataGrid
                                rows={categoryCounts}
                                columns={categoryColumns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                rowHeight={28}
                                autoHeight
                                disableSelectionOnClick
                                components={{ Toolbar: GridToolbar }}
                                initialState={{
                                    pagination: {
                                        pageSize: 25,
                                    },
                                }}
                                sx={tableStyles}
                            />
                        </Grid>

                        {/* Version Files */}
                        <Grid item xs={12} ref={versionRef}>
                            <Typography variant="h5" gutterBottom>Version Files</Typography>
                            <DataGrid
                                rows={versionFiles}
                                columns={versionColumns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                rowHeight={28}
                                autoHeight
                                disableSelectionOnClick
                                components={{ Toolbar: GridToolbar }}
                                initialState={{
                                    pagination: {
                                        pageSize: 25,
                                    },
                                    sorting: {
                                        sortModel: [{ field: 'sort_timestamp', sort: 'desc' }],
                                    },
                                }}
                                sx={tableStyles}
                            />
                        </Grid>

                        {/* Pipeline Status */}
                        <Grid item xs={12} ref={statusRef}>
                            <Typography variant="h5" gutterBottom>Pipeline Status</Typography>
                            <DataGrid
                                rows={pipelineStatus}
                                columns={statusColumns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                rowHeight={28}
                                autoHeight
                                disableSelectionOnClick
                                components={{ Toolbar: GridToolbar }}
                                initialState={{
                                    pagination: {
                                        pageSize: 25,
                                    },
                                }}
                                sx={tableStyles}
                            />
                        </Grid>

                        {/* Pipeline Tasks */}
                        <Grid item xs={12} ref={tasksRef}>
                            <Typography variant="h5" gutterBottom>Pipeline Tasks</Typography>
                            <DataGrid
                                rows={pipelineTasks}
                                columns={taskColumns}
                                pageSize={25}
                                rowsPerPageOptions={[25, 50, 100]}
                                rowHeight={28}
                                autoHeight
                                disableSelectionOnClick
                                components={{ Toolbar: GridToolbar }}
                                initialState={{
                                    pagination: {
                                        pageSize: 25,
                                    },
                                    sorting: {
                                        sortModel: [{ field: 'date', sort: 'desc' }],
                                    },
                                }}
                                sx={tableStyles}
                            />
                        </Grid>

                        {/* Log Show */}
                        <Grid item xs={12} ref={logShowRef}>
                            <Typography variant="h5" gutterBottom>Log Show</Typography>
                            {Object.keys(logShowData).map(category => (
                                <Box key={category} sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                                    <DataGrid
                                        rows={logShowData[category] || []}
                                        columns={logShowColumns[category] || [
                                            { field: 'id', headerName: 'ID', width: 80 },
                                            { field: 'log_category', headerName: 'Category', flex: 1 },
                                            { field: 'log_entry', headerName: 'Entry', flex: 2 },
                                            { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
                                            { field: 'user_id', headerName: 'User ID', flex: 1 }
                                        ]}
                                        pageSize={25}
                                        rowsPerPageOptions={[25, 50, 100]}
                                        rowHeight={28}
                                        autoHeight
                                        disableSelectionOnClick
                                        components={{ Toolbar: GridToolbar }}
                                        initialState={{
                                            pagination: {
                                                pageSize: 25,
                                            },
                                            sorting: {
                                                sortModel: [{ field: 'timestamp', sort: 'desc' }],
                                            },
                                        }}
                                        sx={tableStyles}
                                    />
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <FooterSection />
        </>
    );
};