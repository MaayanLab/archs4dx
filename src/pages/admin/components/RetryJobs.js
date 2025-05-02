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

const RetryJobs = () => {
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

            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                    Days (1-365): {days}
                </Typography>
                <Slider
                    value={days}
                    onChange={handleDaysChange}
                    min={1}
                    max={365}
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

            <Button
                variant="contained"
                onClick={fetchRetryCount}
                disabled={loading}
                fullWidth
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Compute Retry Count'}
            </Button>

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
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleRetryJobs}
                        disabled={loading}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Retry Jobs'}
                    </Button>
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

export default RetryJobs;