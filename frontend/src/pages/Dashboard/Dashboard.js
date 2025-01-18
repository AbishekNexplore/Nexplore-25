import React from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    IconButton,
    LinearProgress,
    Divider,
    Container,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    TrendingUp,
    Message,
    Description,
    School,
    Timeline,
    Star,
    CheckCircleOutline,
    Business,
    LocationOn,
    AccessTime,
    CheckCircle,
    RadioButtonUnchecked,
    ArrowForward
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const user = useSelector(state => state.auth.user);
    const theme = useTheme();

    if (!user) {
        return (
            <Container 
                maxWidth="lg" 
                sx={{ 
                    mt: { xs: 8, sm: 9 }, 
                    mb: 4,
                    pt: 3 
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '80vh' 
                }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    // Featured actions with descriptions and progress
    const featuredActions = [
        {
            title: 'Career Trends',
            icon: <TrendingUp />,
            description: 'Analyze industry trends and salary insights',
            link: '/career-trends',
            stats: {
                trendsAnalyzed: 124,
                industriesTracked: 8,
                lastUpdated: '2 hours ago'
            }
        },
        {
            title: 'AI Chat Assistant',
            icon: <Message />,
            description: 'Get personalized career guidance',
            link: '/chatbot',
            stats: {
                chatsCompleted: 15,
                questionsAnswered: 45,
                avgResponseTime: '2 min'
            }
        },
        {
            title: 'Resume Feedback',
            icon: <Description />,
            description: 'Get AI-powered resume analysis',
            link: '/resume',
            stats: {
                resumeScore: 85,
                improvements: 12,
                lastAnalysis: '1 day ago'
            }
        },
        {
            title: 'Learning Path',
            icon: <School />,
            description: 'Track your learning progress',
            link: '/learning-path',
            stats: {
                coursesCompleted: 4,
                hoursLearned: 28,
                nextMilestone: '5 courses'
            }
        }
    ];

    const quickStats = [
        {
            title: 'Profile Strength',
            value: '85%',
            icon: <CheckCircle color="success" />,
            trend: '+5%',
            description: 'Your profile is performing well',
            color: 'success.main'
        },
        {
            title: 'Skills Matched',
            value: '24/30',
            icon: <Star color="warning" />,
            trend: '+3',
            description: 'Required skills for your target role',
            color: 'warning.main'
        },
        {
            title: 'Learning Hours',
            value: '28h',
            icon: <Timeline color="info" />,
            trend: '+2h',
            description: 'Total learning time this month',
            color: 'info.main'
        },
        {
            title: 'Achievements',
            value: '12',
            icon: <CheckCircleOutline color="primary" />,
            trend: '+2',
            description: 'Badges and certifications earned',
            color: 'primary.main'
        }
    ];

    const recentActivities = [
        {
            type: 'course',
            title: 'Completed Python Basics',
            timestamp: '2 hours ago',
            icon: <School color="primary" />,
            color: 'primary'
        },
        {
            type: 'resume',
            title: 'Resume Analysis Complete',
            timestamp: '1 day ago',
            icon: <Description color="secondary" />,
            color: 'secondary'
        },
        {
            type: 'skill',
            title: 'New Skill: React.js',
            timestamp: '2 days ago',
            icon: <Star color="warning" />,
            color: 'warning'
        },
        {
            type: 'job',
            title: 'Applied to Senior Developer',
            timestamp: '3 days ago',
            icon: <Business color="info" />,
            color: 'info'
        }
    ];

    const recommendedSkills = [
        {
            name: 'React.js',
            category: 'Technical',
            relevance: 95,
            progress: 60
        },
        {
            name: 'Node.js',
            category: 'Technical',
            relevance: 90,
            progress: 40
        },
        {
            name: 'Data Analysis',
            category: 'Analytics',
            relevance: 85,
            progress: 30
        },
        {
            name: 'Project Management',
            category: 'Soft Skills',
            relevance: 80,
            progress: 70
        }
    ];

    const jobMatches = [
        {
            title: 'Senior Full Stack Developer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            matchPercentage: 95,
            isNew: true,
            postedDate: '2 days ago',
            skills: ['React.js', 'Node.js', 'MongoDB']
        },
        {
            title: 'Lead Software Engineer',
            company: 'Innovation Labs',
            location: 'New York, NY',
            matchPercentage: 90,
            isNew: true,
            postedDate: '3 days ago',
            skills: ['Java', 'Spring Boot', 'AWS']
        },
        {
            title: 'Frontend Developer',
            company: 'Digital Solutions',
            location: 'Remote',
            matchPercentage: 85,
            isNew: false,
            postedDate: '5 days ago',
            skills: ['React.js', 'Angular', 'Vue.js']
        }
    ];

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                mt: { xs: 8, sm: 9 }, 
                mb: 4,
                pt: 3, 
                position: 'relative',
                zIndex: 0,
                '& .MuiPaper-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                    }
                }
            }}
        >
            {/* Welcome Section with Profile Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper 
                        sx={{ 
                            p: 4, 
                            height: '100%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
                                zIndex: 1
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '30%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                                zIndex: 1
                            }
                        }}
                        elevation={4}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 4,
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <Avatar 
                                sx={{ 
                                    width: 100, 
                                    height: 100,
                                    border: '4px solid rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                    background: 'linear-gradient(45deg, #fff 30%, #f5f5f5 90%)',
                                    color: theme.palette.primary.main,
                                    fontSize: '2.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" component="h1" sx={{ 
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    mb: 1,
                                    letterSpacing: '-0.5px'
                                }}>
                                    Welcome back, {user?.name || 'User'}!
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                    opacity: 0.95,
                                    fontWeight: 500,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    letterSpacing: '0.5px'
                                }}>
                                    Let's continue your journey to success
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Stats Section */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 4,
                        height: '100%',
                        background: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Typography variant="h6" sx={{ 
                            mb: 3, 
                            fontWeight: 600, 
                            color: 'text.primary',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: 0,
                                width: 32,
                                height: 2,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: 1
                            }
                        }}>
                            Quick Stats
                        </Typography>
                        <Grid container spacing={2}>
                            {[
                                { 
                                    label: 'Courses Completed', 
                                    value: '12', 
                                    icon: <CheckCircle sx={{ fontSize: 28 }} color="success" />,
                                    trend: '+2 this week'
                                },
                                { 
                                    label: 'Hours Learning', 
                                    value: '48', 
                                    icon: <AccessTime sx={{ fontSize: 28 }} color="primary" />,
                                    trend: '+5 hrs today'
                                }
                            ].map((stat, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box sx={{ 
                                        textAlign: 'center',
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.primary.main, 0.1) 
                                            : alpha(theme.palette.primary.light, 0.1),
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.primary.main, 0.15)
                                                : alpha(theme.palette.primary.light, 0.15)
                                        }
                                    }}>
                                        {stat.icon}
                                        <Typography variant="h5" sx={{ 
                                            mt: 1,
                                            mb: 0.5,
                                            fontWeight: 'bold',
                                            color: theme.palette.mode === 'dark' 
                                                ? theme.palette.primary.light
                                                : theme.palette.primary.main
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {stat.label}
                                        </Typography>
                                        <Typography variant="caption" 
                                            sx={{ 
                                                color: theme.palette.success.main,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontWeight: 500
                                            }}
                                        >
                                            {stat.trend}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Featured Actions Section */}
            <Typography variant="h5" sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: 'text.primary',
                position: 'relative',
                pl: 2,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2
                }
            }}>
                Featured Actions
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {featuredActions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper sx={{ 
                            p: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            bgcolor: theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.background.paper, 0.9)
                        }}>
                            <Box sx={{ 
                                p: 3,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {action.icon}
                                    </Avatar>
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1
                                }}>
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: theme.palette.text.secondary,
                                    mb: 2,
                                    flex: 1
                                }}>
                                    {action.description}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ 
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Button 
                                    component={Link}
                                    to={action.link}
                                    endIcon={<ArrowForward />}
                                    fullWidth
                                    sx={{ 
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2)
                                        }
                                    }}
                                >
                                    Continue
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activities Section */}
            <Typography variant="h5" sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: 'text.primary',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    borderRadius: 1.5,
                    bgcolor: 'primary.main'
                }
            }}>
                Recent Activities
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <List sx={{ 
                            '& .MuiListItem-root': { 
                                px: 0,
                                '&:hover': {
                                    bgcolor: 'transparent'
                                }
                            }
                        }}>
                            {recentActivities.map((activity, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        '&::before': index !== recentActivities.length - 1 ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 20,
                                            top: 40,
                                            bottom: -20,
                                            width: 2,
                                            bgcolor: 'divider'
                                        } : {}
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 42 }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: `${activity.color}.light`,
                                                color: `${activity.color}.main`
                                            }}
                                        >
                                            {activity.icon}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {activity.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {activity.timestamp}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Activity and Skills Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Recommended Skills</Typography>
                            <Button endIcon={<ArrowForward />} size="small">View All</Button>
                        </Box>
                        <List>
                            {recommendedSkills.map((skill, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                                        {skill.name}
                                                    </Typography>
                                                    <Chip
                                                        label={`${skill.relevance}% Match`}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {skill.category}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {skill.progress}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={skill.progress}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < recommendedSkills.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Job Matches</Typography>
                            <Button endIcon={<ArrowForward />} size="small">View All</Button>
                        </Box>
                        <List>
                            {jobMatches.map((job, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {job.title}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            {job.company}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={`${job.matchPercentage}% Match`}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            bgcolor: `rgba(25, 118, 210, ${job.matchPercentage / 100})`
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.location}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.postedDate}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {job.skills.map((skill, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={skill}
                                                                size="small"
                                                                sx={{ 
                                                                    bgcolor: 'background.default',
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < jobMatches.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
