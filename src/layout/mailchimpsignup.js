import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export const MailchimpSignup = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the form from submitting the default way

        // Check if the email is valid
        if (!email) {
            setMessage('Email is required.');
            return;
        }

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
                setMessage('Successfully subscribed!');
                setEmail('');  // Clear the email input after successful submission
            } else {
                setMessage('Failed to subscribe. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred while subscribing.');
            console.error("Error occurred while subscribing:", error);
        }
    };

    return (
        <Box id="mc_embed_signup" sx={{ background: '#fff', width: { xs: '100%', md: '600px' }, padding: '20px', borderRadius: '5px' }}>
            <Typography variant="h6">Subscribe to ARCHS4 newsletter</Typography>
            <Typography variant="body2" className="indicates-required">
                <span className="asterisk">*</span> indicates required
            </Typography>
            <form id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" onSubmit={handleSubmit}>
                <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                    <TextField
                        id="mce-EMAIL"
                        name="EMAIL"
                        type="email"
                        required
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <Button
                        type="submit"
                        id="mc-embedded-subscribe"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                    >
                        Subscribe
                    </Button>
                    {message && (
                        <Typography variant="body2" style={{ marginTop: '10px', color: 'red' }}>
                            {message}
                        </Typography>
                    )}
                </div>
            </form>
        </Box>
    );
};
