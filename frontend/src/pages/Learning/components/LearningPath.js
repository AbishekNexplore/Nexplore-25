import React from 'react';
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress
} from '@mui/material';
import {
    School,
    WorkspacePremium,
    Timeline,
    CheckCircle,
    PlayCircleOutline,
    Lock
} from '@mui/icons-material';

const LearningPath = ({ data }) => {
    if (!data) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'primary';
            case 'locked':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle color="success" />;
            case 'in_progress':
                return <PlayCircleOutline color="primary" />;
            case 'locked':
                return <Lock color="disabled" />;
            default:
                return <Timeline color="action" />;
        }
    };

    return (
        <Box>
            {/* Path Overview */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {data.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                        icon={<Timeline />}
                        label={`${data.estimatedDuration} months`}
                        variant="outlined"
                    />
                    <Chip
                        icon={<School />}
                        label={`${data.totalCourses} courses`}
                        variant="outlined"
                    />
                    <Chip
                        icon={<WorkspacePremium />}
                        label={data.difficulty}
                        variant="outlined"
                    />
                </Box>
                {/* Overall Progress */}
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Overall Progress</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.completedSteps} of {data.totalSteps} steps
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={(data.completedSteps / data.totalSteps) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>
            </Box>

            {/* Learning Path Steps */}
            <Stepper orientation="vertical">
                {data.steps.map((step, index) => (
                    <Step key={index} active={step.status === 'in_progress'} completed={step.status === 'completed'}>
                        <StepLabel
                            StepIconComponent={() => getStatusIcon(step.status)}
                            optional={
                                <Typography variant="caption">
                                    {step.duration} • {step.type}
                                </Typography>
                            }
                        >
                            <Typography variant="subtitle1">{step.title}</Typography>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {step.description}
                                </Typography>
                                
                                {/* Skills */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Skills covered:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {step.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {/* Resources */}
                                {step.resources && (
                                    <List dense>
                                        {step.resources.map((resource, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemIcon>
                                                    {getStatusIcon(resource.status)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={resource.title}
                                                    secondary={resource.type}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}

                                {/* Action Buttons */}
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => {/* Handle start/continue */}}
                                        sx={{ mr: 1 }}
                                        disabled={step.status === 'locked'}
                                    >
                                        {step.status === 'completed' ? 'Review' : 'Start'}
                                    </Button>
                                    {step.status === 'in_progress' && (
                                        <Button variant="outlined">
                                            Mark as Complete
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {/* Completion Paper */}
            {data.completedSteps === data.totalSteps && (
                <Paper square elevation={0} sx={{ p: 3, mt: 3, bgcolor: 'success.light' }}>
                    <Typography variant="h6" gutterBottom>
                        Congratulations! 🎉
                    </Typography>
                    <Typography paragraph>
                        You've completed all steps in this learning path.
                    </Typography>
                    <Button variant="contained" color="primary">
                        View Certificate
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default LearningPath;
