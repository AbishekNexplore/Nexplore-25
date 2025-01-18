import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import { fetchAnalytics } from '../../store/slices/analyticsSlice';
import TrendingSkills from './components/TrendingSkills';
import CareerTrends from './components/CareerTrends';
import SalaryTrends from './components/SalaryTrends';
import IndustryInsights from './components/IndustryInsights';
import GeographicalDemand from './components/GeographicalDemand';
import SkillGapMetrics from './components/SkillGapMetrics';

const CareerAnalytics = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.analytics);

    useEffect(() => {
        dispatch(fetchAnalytics());
    }, [dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="error">
                    Error loading analytics: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Career Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Data-driven insights to guide your career decisions
            </Typography>

            <Grid container spacing={3}>
                {/* Overview Cards */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Job Opportunities
                            </Typography>
                            <Typography variant="h3">
                                {data?.totalJobs?.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data?.jobGrowth > 0 ? '+' : ''}{data?.jobGrowth}% from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Average Salary
                            </Typography>
                            <Typography variant="h3">
                                ${data?.averageSalary?.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data?.salaryGrowth > 0 ? '+' : ''}{data?.salaryGrowth}% YoY growth
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Skills in Demand
                            </Typography>
                            <Typography variant="h3">
                                {data?.inDemandSkills?.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                New skills trending this quarter
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Career Paths
                            </Typography>
                            <Typography variant="h3">
                                {data?.careerPaths?.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Potential growth trajectories
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Trending Skills Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <TrendingSkills data={data?.skillTrends} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Career Trends */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <CareerTrends data={data?.careerTrends} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Salary Trends */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <SalaryTrends data={data?.salaryTrends} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Industry Insights */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <IndustryInsights data={data?.industryInsights} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Geographical Demand */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <GeographicalDemand data={data?.geographicalDemand} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Skill Gap Metrics */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SkillGapMetrics data={data?.skillGapMetrics} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CareerAnalytics;
