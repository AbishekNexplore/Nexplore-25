import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Toolbar,
    Divider,
    Box,
    useTheme
} from '@mui/material';
import {
    Dashboard,
    Work,
    Chat,
    Description,
    TrendingUp,
    School
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Career Recommendations', icon: <Work />, path: '/recommendations' },
    { text: 'Career Chat', icon: <Chat />, path: '/chat' },
    { text: 'Resume Analysis', icon: <Description />, path: '/resume' },
    { text: 'Career Trends', icon: <TrendingUp />, path: '/trends' },
    { text: 'Learning Path', icon: <School />, path: '/learning' }
];

const Sidebar = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`
                }
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        bgcolor: theme.palette.primary.light + '20',
                                        borderRight: `3px solid ${theme.palette.primary.main}`,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.light + '30'
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.light + '10'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: location.pathname === item.path 
                                        ? theme.palette.primary.main 
                                        : theme.palette.text.secondary
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: location.pathname === item.path 
                                                ? theme.palette.primary.main 
                                                : theme.palette.text.primary,
                                            fontWeight: location.pathname === item.path 
                                                ? 500 
                                                : 400
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
            </Box>
        </Drawer>
    );
};

export default Sidebar;
