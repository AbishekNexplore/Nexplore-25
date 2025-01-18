import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Chip,
    Button
} from '@mui/material';
import {
    PlayCircleOutline,
    CheckCircle,
    Lock,
    Timer,
    Assignment
} from '@mui/icons-material';

const CourseProgress = ({ data }) => {
    if (!data) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle color="success" />;
            case 'locked':
                return <Lock color="disabled" />;
            case 'in_progress':
                return <PlayCircleOutline color="primary" />;
            default:
                return <Timer color="action" />;
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <Box>
            {/* Overall Progress */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                        Overall Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.completedModules} of {data.totalModules} modules completed
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={(data.completedModules / data.totalModules) * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                />
            </Box>

            {/* Course Modules */}
            <List>
                {data.modules.map((module, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 2,
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}
                    >
                        {/* Module Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                            <ListItemIcon>
                                {getStatusIcon(module.status)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1">
                                        {module.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                            size="small"
                                            icon={<Timer />}
                                            label={formatDuration(module.duration)}
                                        />
                                        <Chip
                                            size="small"
                                            icon={<Assignment />}
                                            label={`${module.exercises} exercises`}
                                        />
                                    </Box>
                                }
                            />
                            <Button
                                variant="contained"
                                startIcon={<PlayCircleOutline />}
                                disabled={module.status === 'locked'}
                                sx={{ ml: 2 }}
                            >
                                {module.status === 'completed' ? 'Review' : 'Continue'}
                            </Button>
                        </Box>

                        {/* Module Progress */}
                        {module.status === 'in_progress' && (
                            <Box sx={{ p: 2, bgcolor: 'action.hover', width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Module Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {module.completedLessons} of {module.totalLessons} lessons
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(module.completedLessons / module.totalLessons) * 100}
                                />
                            </Box>
                        )}

                        {/* Module Content Preview */}
                        {module.lessons && (
                            <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {module.lessons.map((lesson, idx) => (
                                    <ListItem
                                        key={idx}
                                        sx={{ pl: 4 }}
                                        secondaryAction={
                                            lesson.status === 'completed' ? (
                                                <CheckCircle color="success" fontSize="small" />
                                            ) : (
                                                <IconButton
                                                    edge="end"
                                                    disabled={lesson.status === 'locked'}
                                                >
                                                    <PlayCircleOutline />
                                                </IconButton>
                                            )
                                        }
                                    >
                                        <ListItemText
                                            primary={lesson.title}
                                            secondary={formatDuration(lesson.duration)}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default CourseProgress;
