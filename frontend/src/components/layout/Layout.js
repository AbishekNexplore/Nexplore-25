import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const theme = useTheme();

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            '& .MuiAppBar-root': {
                '& .MuiToolbar-root': {
                    backgroundColor: theme.palette.primary.main,
                    minHeight: '64px'
                }
            }
        }}>
            <Navbar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: '64px', // Fixed height for navbar
                    pt: 3,
                    pb: 3,
                    backgroundColor: theme.palette.background.default,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;
