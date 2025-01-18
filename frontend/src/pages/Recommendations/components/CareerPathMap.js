import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
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
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import {
    WorkOutline,
    School,
    TrendingUp,
    AttachMoney,
    Schedule,
    Star
} from '@mui/icons-material';

const CareerPathMap = ({ paths }) => {
    const [selectedPath, setSelectedPath] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Career Paths Overview */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Available Career Paths
                            </Typography>
                            <List>
                                {paths?.map((path, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            button
                                            selected={selectedPath === index}
                                            onClick={() => {
                                                setSelectedPath(index);
                                                setActiveStep(0);
                                            }}
                                        >
                                            <ListItemIcon>
                                                <WorkOutline />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={path.title}
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Chip
                                                            size="small"
                                                            icon={<TrendingUp />}
                                                            label={`${path.growthRate}% Growth`}
                                                            color="primary"
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <Chip
                                                            size="small"
                                                            icon={<AttachMoney />}
                                                            label={path.averageSalary}
                                                            color="success"
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Career Path Details */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {paths && paths[selectedPath] && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        {paths[selectedPath].title}
                                    </Typography>
                                    
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {paths[selectedPath].description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {paths[selectedPath].timeframe}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Star sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {paths[selectedPath].difficulty} Level
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Stepper activeStep={activeStep} orientation="vertical">
                                        {paths[selectedPath].steps.map((step, index) => (
                                            <Step key={index}>
                                                <StepLabel>
                                                    <Typography variant="subtitle1">
                                                        {step.title}
                                                    </Typography>
                                                </StepLabel>
                                                <StepContent>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="body2" paragraph>
                                                            {step.description}
                                                        </Typography>

                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Required Skills:
                                                        </Typography>
                                                        <Box sx={{ mb: 2 }}>
                                                            {step.skills.map((skill, idx) => (
                                                                <Chip
                                                                    key={idx}
                                                                    label={skill}
                                                                    size="small"
                                                                    sx={{ mr: 1, mb: 1 }}
                                                                />
                                                            ))}
                                                        </Box>

                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Recommended Resources:
                                                        </Typography>
                                                        <List dense>
                                                            {step.resources.map((resource, idx) => (
                                                                <ListItem key={idx}>
                                                                    <ListItemIcon>
                                                                        <School fontSize="small" />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={resource.title}
                                                                        secondary={resource.provider}
                                                                    />
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                    >
                                                                        Start
                                                                    </Button>
                                                                </ListItem>
                                                            ))}
                                                        </List>

                                                        <Box sx={{ mt: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={handleNext}
                                                                sx={{ mt: 1, mr: 1 }}
                                                            >
                                                                {index === paths[selectedPath].steps.length - 1
                                                                    ? 'Finish'
                                                                    : 'Continue'}
                                                            </Button>
                                                            <Button
                                                                disabled={index === 0}
                                                                onClick={handleBack}
                                                                sx={{ mt: 1, mr: 1 }}
                                                            >
                                                                Back
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    {activeStep === paths[selectedPath].steps.length && (
                                        <Paper square elevation={0} sx={{ p: 3 }}>
                                            <Typography>All steps completed!</Typography>
                                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                                Reset Progress
                                            </Button>
                                        </Paper>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CareerPathMap;
