import React from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const theme = useTheme();

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            bgcolor: theme.palette.background.default
        }}>
            <Navbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: '64px' // Add margin top to account for fixed navbar
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
