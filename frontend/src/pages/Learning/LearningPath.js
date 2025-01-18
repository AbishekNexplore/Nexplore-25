import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper,
    Box,
    LinearProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Snackbar
} from '@mui/material';
import {
    Edit,
    Check
} from '@mui/icons-material';

const roleBasedLearningPaths = {
    "Software Developer": {
        foundation: [
            { id: 1, name: "Programming Fundamentals", duration: "6 hours", completed: false },
            { id: 2, name: "Data Structures & Algorithms", duration: "8 hours", completed: false },
            { id: 3, name: "Version Control (Git)", duration: "4 hours", completed: false }
        ],
        advanced: [
            { id: 4, name: "Web Development", duration: "10 hours", completed: false },
            { id: 5, name: "Database Design", duration: "8 hours", completed: false },
            { id: 6, name: "API Development", duration: "6 hours", completed: false }
        ],
        specialization: [
            { id: 7, name: "Cloud Computing", duration: "12 hours", completed: false },
            { id: 8, name: "DevOps Practices", duration: "10 hours", completed: false },
            { id: 9, name: "Software Architecture", duration: "15 hours", completed: false }
        ]
    },
    "Data Scientist": {
        foundation: [
            { id: 1, name: "Statistics & Probability", duration: "8 hours", completed: false },
            { id: 2, name: "Python for Data Science", duration: "6 hours", completed: false },
            { id: 3, name: "Data Preprocessing", duration: "4 hours", completed: false }
        ],
        advanced: [
            { id: 4, name: "Machine Learning Basics", duration: "12 hours", completed: false },
            { id: 5, name: "Data Visualization", duration: "6 hours", completed: false },
            { id: 6, name: "Feature Engineering", duration: "8 hours", completed: false }
        ],
        specialization: [
            { id: 7, name: "Deep Learning", duration: "15 hours", completed: false },
            { id: 8, name: "Natural Language Processing", duration: "10 hours", completed: false },
            { id: 9, name: "Big Data Analytics", duration: "12 hours", completed: false }
        ]
    },
    "UI/UX Designer": {
        foundation: [
            { id: 1, name: "Design Principles", duration: "6 hours", completed: false },
            { id: 2, name: "User Research Methods", duration: "8 hours", completed: false },
            { id: 3, name: "Wireframing Basics", duration: "4 hours", completed: false }
        ],
        advanced: [
            { id: 4, name: "UI Design Patterns", duration: "10 hours", completed: false },
            { id: 5, name: "Prototyping Tools", duration: "8 hours", completed: false },
            { id: 6, name: "Interaction Design", duration: "6 hours", completed: false }
        ],
        specialization: [
            { id: 7, name: "Design Systems", duration: "12 hours", completed: false },
            { id: 8, name: "Advanced Prototyping", duration: "10 hours", completed: false },
            { id: 9, name: "User Testing", duration: "8 hours", completed: false }
        ]
    }
};

// Default learning path for unknown roles
const defaultLearningPath = {
    foundation: [
        { id: 1, name: "Professional Communication", duration: "4 hours", completed: false },
        { id: 2, name: "Project Management", duration: "6 hours", completed: false },
        { id: 3, name: "Problem Solving", duration: "4 hours", completed: false }
    ],
    advanced: [
        { id: 4, name: "Industry Best Practices", duration: "8 hours", completed: false },
        { id: 5, name: "Team Collaboration", duration: "6 hours", completed: false },
        { id: 6, name: "Technical Documentation", duration: "4 hours", completed: false }
    ],
    specialization: [
        { id: 7, name: "Leadership Skills", duration: "10 hours", completed: false },
        { id: 8, name: "Strategic Thinking", duration: "8 hours", completed: false },
        { id: 9, name: "Innovation & Creativity", duration: "6 hours", completed: false }
    ]
};

const LearningPath = () => {
    const [expandedStep, setExpandedStep] = useState(-1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingStepIndex, setEditingStepIndex] = useState(null);
    
    // Get user's desired role from Redux store
    const user = useSelector(state => state.auth.user);
    const desiredRole = user?.desiredRole || '';

    // Initialize learning steps based on desired role
    const [learningSteps, setLearningSteps] = useState([]);

    useEffect(() => {
        const rolePath = roleBasedLearningPaths[desiredRole] || defaultLearningPath;
        
        setLearningSteps([
            {
                title: "Foundation Skills",
                description: "Master the core concepts and fundamentals",
                courses: rolePath.foundation
            },
            {
                title: "Advanced Concepts",
                description: "Deep dive into advanced topics",
                courses: rolePath.advanced
            },
            {
                title: "Specialization",
                description: "Focus on your chosen career path",
                courses: rolePath.specialization
            }
        ]);
    }, [desiredRole]);

    // Calculate overall statistics using useMemo
    const stats = useMemo(() => {
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
    }, [learningSteps]); // Recalculate when learningSteps changes

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

    // Handle step expansion
    const handleStepClick = (stepIndex) => {
        setExpandedStep(currentStep => currentStep === stepIndex ? -1 : stepIndex);
    };

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                py: 4,
                mt: 8, // Add margin top to account for fixed navbar
                position: 'relative',
                zIndex: 1,
                '& .MuiPaper-root': {
                    backgroundColor: 'background.paper'
                }
            }}
        >
            {/* Header Section */}
            <Box sx={{ mb: 4, pt: 2 }}> {/* Added top padding */}
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Learning Path
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Track and update your learning progress
                </Typography>
            </Box>

            {/* Progress Overview */}
            <Paper 
                sx={{ 
                    mb: 4,
                    position: 'relative',
                    zIndex: 2,
                    backgroundColor: 'background.paper',
                    boxShadow: (theme) => theme.shadows[3]
                }}
            >
                <Box sx={{ p: 3 }}>
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
                </Box>
            </Paper>

            {/* Learning Path Stepper */}
            <Stepper 
                nonLinear 
                orientation="vertical"
                expanded={true}
                sx={{
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {learningSteps.map((step, stepIndex) => (
                    <Step 
                        key={stepIndex} 
                        expanded={expandedStep === stepIndex}
                        active={expandedStep === stepIndex}
                    >
                        <StepLabel
                            onClick={() => handleStepClick(stepIndex)}
                            sx={{ 
                                cursor: 'pointer',
                                '& .MuiStepLabel-label': {
                                    width: '100%'
                                }
                            }}
                            optional={
                                <Typography variant="caption" color="text.secondary">
                                    Progress: {calculateStepProgress(stepIndex)}%
                                </Typography>
                            }
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                width: '100%',
                                minWidth: 0 // Ensures proper flex behavior
                            }}>
                                <Typography 
                                    variant="subtitle1" 
                                    component="span"
                                    noWrap
                                >
                                    {step.title}
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    ml: 2 // Add margin to separate from title
                                }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={calculateStepProgress(stepIndex)} 
                                        sx={{ width: 100, mr: 2 }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEditDialog(stepIndex);
                                        }}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </StepLabel>
                        <StepContent
                            TransitionProps={{ unmountOnExit: true }} // Add this to ensure proper unmounting
                        >
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {step.description}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {step.courses.map((course) => (
                                    <Box
                                        key={course.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 1,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                borderRadius: 1
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <TextField
                                                type="checkbox"
                                                checked={course.completed}
                                                onChange={() => handleCourseToggle(stepIndex, course.id)}
                                                color="primary"
                                            />
                                            <Typography>{course.name}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography>{course.duration}</Typography>
                                            {course.completed && (
                                                <Check color="success" fontSize="small" />
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {/* Bulk Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                <DialogTitle>
                    Edit {editingStepIndex !== null ? learningSteps[editingStepIndex].title : ''} Progress
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Mark all courses in this section as:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleBulkEdit(editingStepIndex, true)}
                        >
                            Complete
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleBulkEdit(editingStepIndex, false)}
                        >
                            Incomplete
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default LearningPath;
