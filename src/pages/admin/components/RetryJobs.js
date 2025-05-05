import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Slider, 
    TextField, 
    Button, 
    Box, 
    Alert, 
    Paper, 
    CircularProgress 
} from '@mui/material';

export const RetryJobs = () => {
    const [days, setDays] = useState(100);
    const [retryCount, setRetryCount] = useState(null);
    const [retryJobs, setRetryJobs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRetryCount = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://archs4.org/api/pipeline/retrycount?days=${days}`);
            const data = await response.json();
            if (response.ok) {
                setRetryCount(data.jobs);
            } else {
                setError(data.message || "Failed to fetch retry count");
            }
        } catch (err) {
            setError("Network error occurred");
        }
        setLoading(false);
    };

    const handleRetryJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://archs4.org/api/pipeline/retryjobs?days=${days}`);
            const data = await response.json();
            if (response.ok) {
                setRetryJobs(data.jobs);
            } else {
                setError(data.message || "Failed to retry jobs");
            }
        } catch (err) {
            setError("Network error occurred");
        }
        setLoading(false);
    };

    const handleDaysChange = (event, newValue) => {
        if (newValue >= 1) {
            setDays(newValue);
        }
    };

    const handleTextFieldChange = (event) => {
        const value = parseInt(event.target.value);
        if (value >= 1) {
            setDays(value);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Pipeline Retry Dashboard
            </Typography>
            <Typography variant="body3" paragraph>
                Sometimes samples fail to process. The error can stem from networking issues from the SRA database, or sample accessibility at the time of processing. Another common occurrence is that jobs are stuck in "submission". This happens when samples are actively processed and the instance working on the task is shut down prematurely. Since the instances are using spot pricing this can happen. Rerunning failed samples occasionally helps to recover some of them.
            </Typography>
            <Typography variant="body3" paragraph>
                Select how far back you want to go in reprocessing samples. Once clicking the "Compute retry count" button you can see how many samples will be affected by the reprocessing. Then continue by clicking on "Retry Jobs". The jobs will be resubmitted to the pipeline. 
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                    Days (1-1000): {days}
                </Typography>
                <Slider
                    value={days}
                    onChange={handleDaysChange}
                    min={1}
                    max={1000}
                    step={1}
                    valueLabelDisplay="auto"
                />
                <TextField
                    type="number"
                    value={days}
                    onChange={handleTextFieldChange}
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: 100, mt: 2 }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={fetchRetryCount}
                    disabled={loading}
                    sx={{ maxWidth: 300, width: '100%' }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Compute Retry Count'}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {retryCount && (
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Retry Count
                    </Typography>
                    <Typography variant="body1">
                        Failed: {retryCount.failed}
                    </Typography>
                    <Typography variant="body1">
                        Submitted: {retryCount.submitted}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleRetryJobs}
                            disabled={loading}
                            sx={{ maxWidth: 300, width: '100%' }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Retry Jobs'}
                        </Button>
                    </Box>
                </Paper>
            )}

            {retryJobs && (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Retry Jobs Result
                    </Typography>
                    <pre style={{ fontSize: '0.875rem', overflowX: 'auto' }}>
                        {JSON.stringify(retryJobs, null, 2)}
                    </pre>
                </Paper>
            )}
        </Container>
    );
};