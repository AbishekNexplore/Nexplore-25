import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: theme.palette.background.default,
                        p: 3,
                        mt: 8
                    }}
                >
                    <Container maxWidth="lg">
                        {children}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
