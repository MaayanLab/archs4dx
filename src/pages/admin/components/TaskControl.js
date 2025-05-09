import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Chip, CircularProgress, Box, Button, Snackbar, Alert } from '@mui/material';

export const TaskControl = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [launchStatus, setLaunchStatus] = useState({}); // Track launch status per task
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://archs4.org/api/pipeline/taskstatus');
        if (!response.ok) throw new Error('Failed to fetch task status');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const launchTask = async (taskArn) => {
    setLaunchStatus((prev) => ({ ...prev, [taskArn]: 'loading' }));
    try {
      const response = await fetch(`https://archs4.org/api/pipeline/launchtask?task=${encodeURIComponent(taskArn)}`, {
        method: 'GET'
      });
      if (!response.ok) throw new Error('Failed to launch task');
      const result = await response.json();
      setLaunchStatus((prev) => ({ ...prev, [taskArn]: 'success' }));
      setSnackbar({ open: true, message: `Task ${taskArn} launched successfully`, severity: 'success' });
      const statusResponse = await fetch('https://archs4.org/api/pipeline/taskstatus');
      if (statusResponse.ok) {
        const newData = await statusResponse.json();
        setData(newData);
      }
    } catch (err) {
      setLaunchStatus((prev) => ({ ...prev, [taskArn]: 'error' }));
      setSnackbar({ open: true, message: `Error launching task: ${err.message}`, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderTask = (task, taskName) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="subtitle1" className="font-bold mb-2" sx={{ fontSize: '1rem' }}>
            {taskName}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2" sx={{ fontSize: '0.875rem' }}>
            <strong>ARN:</strong> {task.task_arn}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2" sx={{ fontSize: '0.875rem' }}>
            <strong>Created At:</strong> {task.created_at}
          </Typography>
          <Box className="flex items-center mb-2">
            <Chip
              icon={
                <i
                  className={`fa ${
                    task.status === 'running' ? 'fa-play text-green-600' : 'fa-stop text-red-600'
                  } mr-2`}
                ></i>
              }
              label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              color={task.status === 'running' ? 'success' : 'error'}
              className="font-semibold"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => launchTask(task.task_arn)}
            disabled={launchStatus[task.task_arn] === 'loading' || task.status === 'running'}
            startIcon={
              launchStatus[task.task_arn] === 'loading' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <i className="fa fa-rocket"></i>
              )
            }
            sx={{ fontSize: '0.75rem' }}
          >
            Launch Task
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderCategory = (category, categoryName) => (
    <Box className="mb-8">
      <Typography variant="h5" className="font-bold mb-4 capitalize" sx={{ fontSize: '1.25rem' }}>
        {categoryName}
      </Typography>
      <Grid container spacing={4}> {/* Increased spacing between cards */}
        {Object.entries(category).map(([taskName, task]) =>
          renderTask(task, taskName.charAt(0).toUpperCase() + taskName.slice(1))
        )}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <Typography variant="h6" color="error" sx={{ fontSize: '1rem' }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-16 max-w-7xl mx-auto"> {/* Increased outer margin */}
      <Typography variant="h4" className="font-bold mb-6 text-center" sx={{ fontSize: '1.5rem' }}>
        ECS Task Status
      </Typography>
      {data.sample_discovery && renderTask(data.sample_discovery, 'Sample Discovery')}
      {data.human && renderCategory(data.human, 'Human')}
      {data.mouse && renderCategory(data.mouse, 'Mouse')}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};