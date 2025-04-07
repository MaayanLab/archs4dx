import React, { useCallback, useState, useEffect, useRef } from "react";
import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import loveletter from '../image/loveletter.png'

export const LetterSignup = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const addEmail = async (e) => {
        const payload = { "email": email }; // Prepare the payload
        const url = 'https://archs4.org/api/mailchimp/subscribe';
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setEmail('');
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <>
        <Box>
            <Grid item md={12}>
                <Typography
                    className="headerSubtitle"
                    sx={{
                        fontSize: "15px",
                        lineHeight: "18px",
                        letterSpacing: "0px",
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {isSubscribed && (
                        <img 
                            src={loveletter} 
                            alt="Love letter" 
                            style={{ 
                                marginRight: '10px',
                                height: '40px' // Adjust size as needed
                            }} 
                        />
                    )}
                    {isSubscribed 
                        ? "Thank you for signing up to the ARCHS4 newsletter!"
                        : "If you would like to receive updates on the ARCHS4 data and stay informed about new data releases consider signing up for the newsletter."
                    }
                </Typography>
            </Grid>
            {!isSubscribed && (
                <Grid 
                    item 
                    md={12}
                    sx={{
                        paddingTop: "20px",
                        display: 'flex',
                        width: "100%"
                    }}
                >
                    <form
                        className="form-inline"
                        style={{ paddingTop: '2px', width: '100%' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            addEmail();
                        }}
                    >
                        <Paper
                            component="form"
                            sx={{ display: 'flex', alignItems: 'center', width: "100%"}}
                        >
                            <IconButton sx={{ p: '10px' }} aria-label="menu">
                                <LoyaltyIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                value={email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton 
                                color="primary" 
                                aria-label="directions" 
                                sx={{
                                    fontSize: "14px",
                                    color: "black",
                                    p: '10px' 
                                }}
                                className="btn btn-info my-2 my-sm-0"
                                type="button"
                                onClick={addEmail}
                            >
                                Keep Me Updated
                            </IconButton>
                        </Paper>
                    </form>
                </Grid>
            )}
        </Box>
        </>
    );
}