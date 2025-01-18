import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Button
} from '@mui/material';
import {
    Work,
    TrendingUp,
    School,
    Description
} from '@mui/icons-material';
import CareerSummary from './components/CareerSummary';
import SkillsProgress from './components/SkillsProgress';
import RecommendedJobs from './components/RecommendedJobs';
import LearningPath from './components/LearningPath';
import { getCurrentUser } from '../../store/slices/authSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const { recommendations } = useSelector((state) => state.career);

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, user]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Welcome back, {user?.username}!
            </Typography>

            <Grid container spacing={3}>
                {/* Career Summary */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <CareerSummary />
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Work />}
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    Find Jobs
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Description />}
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    Update Resume
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    startIcon={<School />}
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    Start Learning
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    startIcon={<TrendingUp />}
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    View Trends
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Skills Progress */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <SkillsProgress />
                    </Paper>
                </Grid>

                {/* Recommended Jobs */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <RecommendedJobs />
                    </Paper>
                </Grid>

                {/* Learning Path */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <LearningPath />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
