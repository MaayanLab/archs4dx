import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

export const SigpyStatusCheck = () => {
    const [status, setStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');
    const endpoint = 'https://maayanlab.cloud/sigpy/status'; // replace BASE_NAME if needed

    // Function to handle Snackbar close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(endpoint);
                setStatus(response.data);

                // Check if the service status is "updating"
                if (response.data.message !== "active") {
                    setAlertMessage('The data API is currently updating. The maintanace can take several hours during which time all data related queries are disabled. Please try again at a later timepoint.');
                    setAlertSeverity('error');
                    setOpen(true);
                }
            } catch (error) {
                console.error('Error fetching the status:', error);
                setAlertMessage('Data API currently unavailable. This can be due to maintanace or high load. Please try again at a later timepoint.');
                setAlertSeverity('error');
                setOpen(true);
            }
        };

        fetchStatus();
    }, [endpoint]);

    return (
        <div>
            <Snackbar open={open} autoHideDuration={30000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertSeverity} sx={{ fontSize: '1.0rem', width: "440px" }} >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};