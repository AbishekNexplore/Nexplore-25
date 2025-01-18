import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    Avatar,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    School,
    Description,
    Chat,
    Person,
    Assessment,
    Timeline,
    EmojiEvents,
    Speed,
    WorkOutline,
    Star,
    Assignment,
    CheckCircleOutline,
    LocalLibrary
} from '@mui/icons-material';
import { getCurrentUser } from '../../store/slices/authSlice';

// Custom styled components
const StyledCard = ({ children, ...props }) => (
    <Card
        {...props}
        sx={{
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            },
            ...props.sx
        }}
    >
        {children}
    </Card>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    const featuredActions = [
        {
            title: 'Career Trends',
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            description: 'Explore industry trends and insights',
            color: '#2563eb',
            path: '/career-trends',
            progress: 75
        },
        {
            title: 'AI Chat Assistant',
            icon: <Chat sx={{ fontSize: 40 }} />,
            description: 'Get personalized career guidance',
            color: '#16a34a',
            path: '/chatbot',
            progress: 100
        },
        {
            title: 'Resume Feedback',
            icon: <Description sx={{ fontSize: 40 }} />,
            description: 'Get AI-powered resume analysis',
            color: '#9333ea',
            path: '/resume-feedback',
            progress: 40
        },
        {
            title: 'Learning Path',
            icon: <School sx={{ fontSize: 40 }} />,
            description: 'Track your learning progress',
            color: '#ea580c',
            path: '/learning-path',
            progress: 60
        }
    ];

    const quickStats = [
        { label: 'Profile Strength', value: '85%', icon: <Speed color="primary" /> },
        { label: 'Skills Matched', value: '12/15', icon: <Assessment color="success" /> },
        { label: 'Learning Hours', value: '24h', icon: <Timeline color="info" /> },
        { label: 'Achievements', value: '8', icon: <EmojiEvents color="warning" /> }
    ];

    const recentActivities = [
        {
            type: 'course',
            title: 'Completed Python Basics',
            time: '2 hours ago',
            icon: <LocalLibrary sx={{ color: '#16a34a' }} />
        },
        {
            type: 'resume',
            title: 'Resume Analysis Complete',
            time: '1 day ago',
            icon: <Assignment sx={{ color: '#9333ea' }} />
        },
        {
            type: 'achievement',
            title: 'Earned "Fast Learner" Badge',
            time: '2 days ago',
            icon: <Star sx={{ color: '#eab308' }} />
        }
    ];

    const recommendedSkills = [
        {
            skill: 'React.js',
            relevance: 95,
            category: 'Technical'
        },
        {
            skill: 'Data Analysis',
            relevance: 88,
            category: 'Analytics'
        },
        {
            skill: 'Project Management',
            relevance: 82,
            category: 'Soft Skills'
        }
    ];

    const jobMatches = [
        {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            match: 92,
            new: true
        },
        {
            title: 'Full Stack Developer',
            company: 'Innovation Labs',
            match: 88,
            new: true
        },
        {
            title: 'Frontend Engineer',
            company: 'Digital Solutions',
            match: 85,
            new: false
        }
    ];

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 'calc(100vh - 64px)' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8fafc' }}>
            {/* Welcome Section */}
            <Box sx={{ 
                mb: 4, 
                p: 3, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                color: 'white'
            }}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item>
                        <Avatar
                            sx={{ 
                                width: 64, 
                                height: 64,
                                bgcolor: 'white',
                                color: '#2563eb'
                            }}
                        >
                            <Person sx={{ fontSize: 40 }} />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Welcome back, {user?.name || 'User'}!
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                            Let's continue your career development journey
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {quickStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StyledCard>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <IconButton
                                    sx={{
                                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                        mb: 2
                                    }}
                                    size="large"
                                >
                                    {stat.icon}
                                </IconButton>
                                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {stat.label}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* Featured Actions */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Featured Tools
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {featuredActions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StyledCard>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(action.path)}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: `${action.color}15`,
                                        borderRadius: '50%',
                                        width: 64,
                                        height: 64,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        color: action.color
                                    }}
                                >
                                    {action.icon}
                                </Box>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    {action.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mb: 2, flexGrow: 1 }}
                                >
                                    {action.description}
                                </Typography>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={action.progress}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: `${action.color}20`,
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: action.color
                                            }
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ mt: 0.5, display: 'block' }}
                                    >
                                        {action.progress}% Complete
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* Additional Sections */}
            <Grid container spacing={3}>
                {/* Recent Activities */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Recent Activities
                            </Typography>
                            <List>
                                {recentActivities.map((activity, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemIcon>
                                                {activity.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={activity.title}
                                                secondary={activity.time}
                                            />
                                        </ListItem>
                                        {index < recentActivities.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Recommended Skills */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Recommended Skills
                            </Typography>
                            {recommendedSkills.map((skill, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">
                                            {skill.skill}
                                            <Chip
                                                label={skill.category}
                                                size="small"
                                                sx={{ ml: 1, backgroundColor: '#e2e8f0' }}
                                            />
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {skill.relevance}% Match
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={skill.relevance}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: '#e2e8f0'
                                        }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Job Matches */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Top Job Matches
                            </Typography>
                            <List>
                                {jobMatches.map((job, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                px: 0,
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: '#f1f5f9' }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#2563eb' }}>
                                                    <WorkOutline />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {job.title}
                                                        {job.new && (
                                                            <Chip
                                                                label="New"
                                                                size="small"
                                                                sx={{
                                                                    ml: 1,
                                                                    backgroundColor: '#dcfce7',
                                                                    color: '#16a34a'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2">
                                                            {job.company}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                            <CheckCircleOutline sx={{ color: '#16a34a', fontSize: 16, mr: 0.5 }} />
                                                            <Typography variant="body2" color="success.main">
                                                                {job.match}% Match
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < jobMatches.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
