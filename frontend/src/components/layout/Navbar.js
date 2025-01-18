import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box
} from '@mui/material';
import { AccountCircle, Notifications, Dashboard,} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                background: theme.palette.primary.main,
                zIndex: theme.zIndex.appBar,
                height: '64px',
                boxShadow: 1,
                '& .MuiToolbar-root': {
                    minHeight: '64px',
                    height: '64px',
                    background: theme.palette.primary.main
                },
                '& .MuiTypography-root': {
                    color: '#fff',
                    zIndex: 'auto'
                },
                '& .MuiSvgIcon-root': {
                    color: '#fff',
                    zIndex: 'auto'
                },
                '& .MuiButton-root': {
                    color: '#fff',
                    zIndex: 'auto'
                }
            }}
        >
            <Toolbar sx={{ background: theme.palette.primary.main }}>
                <Box 
                    component="img" 
                    src="/map-svgrepo-com.svg" 
                    alt="Logo"
                    sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        position: 'relative',
                        zIndex: theme.zIndex.drawer + 3
                    }}
                />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 600, 
                        letterSpacing: '.5px',
                        position: 'relative',
                        zIndex: theme.zIndex.drawer + 3
                    }}
                >
                    Career Navigator
                </Typography>

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" sx={{ mr: 2 }}>
                            <Notifications />
                        </IconButton>
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                        >
                            {user?.profile?.avatar ? (
                                <Avatar src={user.profile.avatar} />
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                        <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                            <Button
                                color="inherit"
                                startIcon={<Dashboard />}
                                onClick={handleDashboard}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Dashboard
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button 
                            color="inherit" 
                            variant="outlined" 
                            onClick={() => navigate('/register')}
                            sx={{ ml: 1 }}
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
