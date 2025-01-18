import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Chip,
    Rating,
    Stack,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    PlayCircleOutline,
    Timer,
    TrendingUp,
    Person,
    Star
} from '@mui/icons-material';

const RecommendedCourses = ({ data }) => {
    if (!data) return null;

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <Grid container spacing={3}>
            {data.map((course, index) => (
                <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Course Image */}
                        <CardMedia
                            component="img"
                            height="140"
                            image={course.image}
                            alt={course.title}
                        />

                        <CardContent sx={{ flexGrow: 1 }}>
                            {/* Course Title and Match Score */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {course.title}
                                </Typography>
                                <Tooltip title="Career Path Match">
                                    <Chip
                                        icon={<TrendingUp />}
                                        label={`${course.matchScore}% match`}
                                        color="primary"
                                        size="small"
                                    />
                                </Tooltip>
                            </Box>

                            {/* Course Info */}
                            <Stack spacing={2}>
                                {/* Description */}
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>

                                {/* Skills */}
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Skills you'll gain:
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {course.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Course Stats */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Timer sx={{ fontSize: 'small', mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {formatDuration(course.duration)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Person sx={{ fontSize: 'small', mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {course.enrollments} enrolled
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating
                                            value={course.rating}
                                            readOnly
                                            size="small"
                                            precision={0.5}
                                        />
                                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                                            ({course.reviewCount})
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Instructor */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        src={course.instructor.avatar}
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {course.instructor.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {course.instructor.title}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Career Impact */}
                                {course.careerImpact && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Star color="warning" />
                                        <Typography variant="body2" color="text.secondary">
                                            {course.careerImpact}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>

                        {/* Action Buttons */}
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<PlayCircleOutline />}
                            >
                                Start Learning
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RecommendedCourses;
