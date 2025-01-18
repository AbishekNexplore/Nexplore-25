import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    School,
    TrendingUp,
    PlayCircleOutline,
    BookmarkBorder,
    Info
} from '@mui/icons-material';
import { fetchLearningData } from '../../store/slices/learningSlice';
import CourseProgress from './components/CourseProgress';
import RecommendedCourses from './components/RecommendedCourses';
import LearningPath from './components/LearningPath';
import ResourceLibrary from './components/ResourceLibrary';
import SkillProgress from './components/SkillProgress';

const LearningDashboard = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.learning);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchLearningData());
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
                    Error loading learning data: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Learning Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your progress and explore recommended learning resources
                </Typography>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Courses in Progress
                                </Typography>
                            </Box>
                            <Typography variant="h3">
                                {data?.coursesInProgress || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data?.completedCourses || 0} completed this month
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Skills Improved
                                </Typography>
                            </Box>
                            <Typography variant="h3">
                                {data?.skillsImproved || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Out of {data?.totalSkills || 0} tracked skills
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PlayCircleOutline color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Learning Hours
                                </Typography>
                            </Box>
                            <Typography variant="h3">
                                {data?.learningHours || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total hours spent learning
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BookmarkBorder color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Saved Resources
                                </Typography>
                            </Box>
                            <Typography variant="h3">
                                {data?.savedResources || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bookmarked for later
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Course Progress */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Current Progress
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<PlayCircleOutline />}
                                    onClick={() => {/* Handle resume learning */}}
                                >
                                    Resume Learning
                                </Button>
                            </Box>
                            <CourseProgress data={data?.courseProgress} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Skill Progress */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Skill Progress
                                </Typography>
                                <Tooltip title="Track your skill development">
                                    <IconButton size="small">
                                        <Info />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <SkillProgress data={data?.skillProgress} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Learning Path */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Your Learning Path
                            </Typography>
                            <LearningPath data={data?.learningPath} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recommended Courses */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recommended for You
                            </Typography>
                            <RecommendedCourses data={data?.recommendedCourses} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Resource Library */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Resource Library
                            </Typography>
                            <ResourceLibrary data={data?.resources} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LearningDashboard;
