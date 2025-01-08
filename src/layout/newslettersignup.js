import React, { useCallback, useState, useEffect, useRef } from "react";

import Paper from '@mui/material/Paper';
import { Grid, Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';


export const LetterSignup = () => {

    const [email, setEmail] = useState('');
    const inputRef = useRef(null);
    const addEmail = (event) => {
      setEmail(event.target.value);
      console.log(`Email: ${email}`);
      
    };

    const submitEmail = async (e) => {
        e.preventDefault();  // Prevent form submission

        console.log(`Email submitted: ${email}`);
        
        // Replace with the Mailchimp API endpoint
        const url = "https://cloud.us9.list-manage.com/subscribe/post?u=a47c67b0c885cd4449277dfc5&id=5e9ea951dc";
        const payload = new URLSearchParams({
            "EMAIL": email,
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: payload,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (response.ok) {
                console.log("Successfully subscribed!");
                setEmail('');  // Clear the input after success
                inputRef.current.value = ''; // Clear the input field
            } else {
                console.error("Failed to subscribe:", await response.text());
            }
        } catch (error) {
            console.error("Error occurred while subscribing:", error);
        }
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
                            }}
                        >
                            
                            If you would like to receive updates on the ARCHS4 data and stay informed
                            about new data releases consider signing up for the newsletter.
                        </Typography>
                    </Grid>
                    <Grid item  md={12}
                    sx={{
                    paddingTop: "20px",
                    display: 'flex',
                    width: "100%"
                    }}>
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
                            ref={inputRef}
                            value={email}
                            onChange={addEmail}
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Email Address"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />

                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton color="primary" aria-label="directions" sx={{
                            fontSize: "14px",
                            color: "black",
                            p: '10px' 
                            }}
                            className="btn btn-info my-2 my-sm-0"
                            type="button"
                            onClick={submitEmail}
                        >
                            Keep Me Updated
                        </IconButton>
                        </Paper>
                    </form>
                    </Grid>
                    </Box>
            </>
           
    )

}
