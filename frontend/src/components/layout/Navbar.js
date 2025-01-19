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
                zIndex: theme.zIndex.drawer + 1,
                height: '64px',
                boxShadow: 1,
                '& .MuiToolbar-root': {
                    minHeight: '64px',
                    height: '64px',
                    background: theme.palette.primary.main,
                    position: 'relative',
                    zIndex: 'inherit'
                },
                '& .MuiTypography-root': {
                    color: '#fff'
                },
                '& .MuiSvgIcon-root': {
                    color: '#fff'
                },
                '& .MuiButton-root': {
                    color: '#fff'
                }
            }}
        >
            <Toolbar>
                <Box 
                    component="img" 
                    src="/map-svgrepo-com.svg" 
                    alt="Logo"
                    sx={{
                        width: 40,
                        height: 40,
                        mr: 2
                    }}
                />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 600, 
                        letterSpacing: '.5px'
                    }}
                >
                    Career Navigator
                </Typography>

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            size="large"
                            aria-label="show notifications"
                            color="inherit"
                        >
                            <Notifications />
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="go to dashboard"
                            color="inherit"
                            onClick={handleDashboard}
                        >
                            <Dashboard />
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            {user?.avatar ? (
                                <Avatar 
                                    src={user.avatar} 
                                    alt={user.name}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                        <Menu
                            id="menu-appbar"
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
                            sx={{
                                '& .MuiPaper-root': {
                                    mt: 1,
                                    minWidth: 120
                                }
                            }}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
