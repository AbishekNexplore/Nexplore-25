import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress,
    Tabs,
    Tab,
    Button,
    Chip
} from '@mui/material';
import JobList from './components/JobList';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import CareerPathMap from './components/CareerPathMap';
import SalaryInsights from './components/SalaryInsights';
import { fetchRecommendations } from '../../store/slices/careerSlice';

const Recommendations = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const { recommendations, loading, error } = useSelector((state) => state.career);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && !recommendations) {
            dispatch(fetchRecommendations());
        }
    }, [dispatch, user, recommendations]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Career Recommendations
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Personalized career insights based on your profile and market trends
                </Typography>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Recommended Jobs" />
                    <Tab label="Skill Analysis" />
                    <Tab label="Career Paths" />
                    <Tab label="Salary Insights" />
                </Tabs>
            </Paper>

            {/* Profile Summary */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Your Profile Summary
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Current Skills
                            </Typography>
                            {user?.profile?.skills?.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Experience Level: {user?.profile?.experienceLevel || 'Not specified'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <Button variant="outlined" onClick={() => navigate('/profile')}>
                            Update Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tab Panels */}
            <Box sx={{ mt: 3 }}>
                {activeTab === 0 && <JobList recommendations={recommendations?.jobs} />}
                {activeTab === 1 && <SkillGapAnalysis analysis={recommendations?.skillAnalysis} />}
                {activeTab === 2 && <CareerPathMap paths={recommendations?.careerPaths} />}
                {activeTab === 3 && <SalaryInsights insights={recommendations?.salaryInsights} />}
            </Box>
        </Box>
    );
};

export default Recommendations;
