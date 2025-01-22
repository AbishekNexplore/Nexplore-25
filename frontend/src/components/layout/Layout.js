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
            background: theme.palette.background.default,
        }}>
            <Box sx={{ height: '64px', flexShrink: 0 }}>
                <Navbar />
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 3,
                    pb: 3,
                    background: theme.palette.background.default,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
