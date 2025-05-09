import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Chip, CircularProgress, Box } from '@mui/material';

export const TaskControl = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderTask = (task, taskName) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-2">
            {taskName}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2">
            <strong>ARN:</strong> {task.task_arn}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-2">
            <strong>Created At:</strong> {task.created_at}
          </Typography>
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
          />
        </CardContent>
      </Card>
    </Grid>
  );

  const renderCategory = (category, categoryName) => (
    <Box className="mb-8">
      <Typography variant="h5" className="font-bold mb-4 capitalize">
        {categoryName}
      </Typography>
      <Grid container spacing={3}>
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
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="font-bold mb-6 text-center">
        ECS Task Status
      </Typography>
      {data.sample_discovery && renderTask(data.sample_discovery, 'Sample Discovery')}
      {data.human && renderCategory(data.human, 'Human')}
      {data.mouse && renderCategory(data.mouse, 'Mouse')}
    </Box>
  );
};
