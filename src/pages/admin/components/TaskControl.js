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

      // Reload task status after 5 seconds
      setTimeout(async () => {
        try {
          const statusResponse = await fetch('https://archs4.org/api/pipeline/taskstatus');
          if (statusResponse.ok) {
            const newData = await statusResponse.json();
            setData(newData);
            setLaunchStatus((prev) => ({ ...prev, [taskArn]: 'idle' }));
          }
        } catch (err) {
          setSnackbar({ open: true, message: `Error reloading task status: ${err.message}`, severity: 'error' });
        }
      }, 5000);
    } catch (err) {
      setLaunchStatus((prev) => ({ ...prev, [taskArn]: 'error' }));
      setSnackbar({ open: true, message: `Error launching task: ${err.message}`, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderTask = (task, taskName) => (
    <Grid item xs={12} sx={{ margin: '24px' }}>
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', marginLeft: "10px" }}>
        <CardContent sx={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'right' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>
              {taskName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '12px', fontSize: '0.9rem' }}>
              <strong>ARN:</strong> {task.task_arn}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '12px', fontSize: '0.9rem' }}>
              <strong>Created At:</strong> {task.created_at}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
            {launchStatus[task.task_arn] === 'loading' ? (
              <CircularProgress size={24} sx={{ color: '#1976d2' }} />
            ) : (
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
                sx={{ fontWeight: 'medium', fontSize: '0.85rem', padding: '4px 8px' }}
              />
            )}
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
              sx={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '8px' }}
            >
              Launch Task
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderCategory = (category, categoryName) => (
    <Box sx={{ margin: '22px'}}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '1.5rem', textAlign: 'left' }}>
        {categoryName}
      </Typography>
      <Grid container spacing={0}>
        {Object.entries(category).map(([taskName, task]) =>
          renderTask(task, taskName.charAt(0).toUpperCase() + taskName.slice(1))
        )}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '32px' }}>
        <Typography variant="h6" color="error" sx={{ fontSize: '1.2rem' }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '48px', maxWidth: '1440px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '32px', fontSize: '2rem' }}>
        ECS Tasks for Sample Discovery and Packaging
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