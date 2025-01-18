import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Chip,
    Button,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar
} from '@mui/material';
import {
    CheckCircle,
    PlayArrow,
    Edit
} from '@mui/icons-material';

const LearningPath = () => {
    const [activeStep] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingStepIndex, setEditingStepIndex] = useState(null);
    const [learningSteps, setLearningSteps] = useState([
        {
            title: "Foundation Skills",
            description: "Master the core concepts and fundamentals",
            courses: [
                { id: 1, name: "Python Basics", duration: "4 hours", completed: false },
                { id: 2, name: "Data Structures", duration: "6 hours", completed: false },
                { id: 3, name: "Algorithms", duration: "8 hours", completed: false }
            ]
        },
        {
            title: "Advanced Concepts",
            description: "Deep dive into advanced topics",
            courses: [
                { id: 4, name: "System Design", duration: "10 hours", completed: false },
                { id: 5, name: "Design Patterns", duration: "8 hours", completed: false },
                { id: 6, name: "Architecture Patterns", duration: "6 hours", completed: false }
            ]
        },
        {
            title: "Specialization",
            description: "Focus on your chosen career path",
            courses: [
                { id: 7, name: "AI/ML Fundamentals", duration: "12 hours", completed: false },
                { id: 8, name: "Deep Learning", duration: "15 hours", completed: false },
                { id: 9, name: "Natural Language Processing", duration: "10 hours", completed: false }
            ]
        }
    ]);

    // Calculate overall statistics
    const [stats] = useState(() => {
        let totalCourses = 0;
        let completedCourses = 0;
        let totalHours = 0;
        let completedHours = 0;

        learningSteps.forEach(step => {
            step.courses.forEach(course => {
                totalCourses++;
                const hours = parseInt(course.duration);
                totalHours += hours;
                if (course.completed) {
                    completedCourses++;
                    completedHours += hours;
                }
            });
        });

        const overallProgress = Math.round((completedCourses / totalCourses) * 100);

        return {
            totalCourses,
            completedCourses,
            totalHours,
            completedHours,
            overallProgress
        };
    });

    // Calculate step progress
    const calculateStepProgress = (stepIndex) => {
        const step = learningSteps[stepIndex];
        const totalCourses = step.courses.length;
        const completedCourses = step.courses.filter(course => course.completed).length;
        return Math.round((completedCourses / totalCourses) * 100);
    };

    // Handle course completion toggle
    const handleCourseToggle = (stepIndex, courseId) => {
        setLearningSteps(prevSteps => {
            const newSteps = [...prevSteps];
            const courseIndex = newSteps[stepIndex].courses.findIndex(c => c.id === courseId);
            newSteps[stepIndex].courses[courseIndex].completed = !newSteps[stepIndex].courses[courseIndex].completed;
            
            // Show notification
            const course = newSteps[stepIndex].courses[courseIndex];
            setSnackbarMessage(`${course.name} marked as ${course.completed ? 'completed' : 'incomplete'}`);
            setOpenSnackbar(true);
            
            return newSteps;
        });
    };

    // Handle bulk edit dialog
    const handleOpenEditDialog = (stepIndex) => {
        setEditingStepIndex(stepIndex);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setEditingStepIndex(null);
    };

    const handleBulkEdit = (stepIndex, newCompletionState) => {
        setLearningSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[stepIndex].courses = newSteps[stepIndex].courses.map(course => ({
                ...course,
                completed: newCompletionState
            }));
            return newSteps;
        });
        setSnackbarMessage(`All courses in ${learningSteps[stepIndex].title} marked as ${newCompletionState ? 'completed' : 'incomplete'}`);
        setOpenSnackbar(true);
        handleCloseEditDialog();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Learning Path
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Track and update your learning progress
                </Typography>
            </Box>

            {/* Progress Overview */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                                    {stats.overallProgress}%
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Overall Progress
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ color: 'success.main', mb: 1 }}>
                                    {stats.completedCourses}/{stats.totalCourses}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Courses Completed
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ color: 'warning.main', mb: 1 }}>
                                    {stats.completedHours}h
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Learning Hours
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Learning Path Stepper */}
            <Stepper activeStep={activeStep} orientation="vertical">
                {learningSteps.map((step, stepIndex) => (
                    <Step key={stepIndex} completed={calculateStepProgress(stepIndex) === 100}>
                        <StepLabel
                            StepIconProps={{
                                sx: { width: 40, height: 40 }
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <Typography variant="h6">{step.title}</Typography>
                                <Box>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleOpenEditDialog(stepIndex)}
                                        sx={{ mr: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <Chip
                                        label={`${calculateStepProgress(stepIndex)}%`}
                                        color={calculateStepProgress(stepIndex) === 100 ? "success" : "primary"}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography color="text.secondary" paragraph>
                                    {step.description}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={calculateStepProgress(stepIndex)}
                                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                                />
                                
                                {/* Courses in this step */}
                                {step.courses.map((course) => (
                                    <Card
                                        key={course.id}
                                        sx={{
                                            mb: 2,
                                            backgroundColor: 'background.default',
                                            position: 'relative',
                                            overflow: 'visible'
                                        }}
                                    >
                                        <CardContent>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={course.completed}
                                                        onChange={() => handleCourseToggle(stepIndex, course.id)}
                                                        icon={<PlayArrow />}
                                                        checkedIcon={<CheckCircle />}
                                                        sx={{ 
                                                            color: course.completed ? 'success.main' : 'primary.main',
                                                            '&.Mui-checked': {
                                                                color: 'success.main',
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant="subtitle1">
                                                        {course.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Duration: {course.duration}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={course.completed ? "outlined" : "contained"}
                                                        size="small"
                                                        onClick={() => handleCourseToggle(stepIndex, course.id)}
                                                    >
                                                        {course.completed ? "Mark Incomplete" : "Mark Complete"}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {/* Bulk Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                <DialogTitle>
                    Edit {editingStepIndex !== null && learningSteps[editingStepIndex].title}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Mark all courses in this section as:
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleBulkEdit(editingStepIndex, false)} color="error">
                        All Incomplete
                    </Button>
                    <Button onClick={() => handleBulkEdit(editingStepIndex, true)} color="success">
                        All Complete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity="success" 
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default LearningPath;
