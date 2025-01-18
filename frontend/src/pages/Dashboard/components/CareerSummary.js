import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    LinearProgress,
    Grid,
    Chip,
    Divider
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const CareerSummary = () => {
    const { user } = useSelector((state) => state.auth);
    const { recommendations } = useSelector((state) => state.career);

    const careerProgress = 65; // Example progress value

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Career Summary
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Career Progress
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={careerProgress}
                            sx={{ 
                                height: 10, 
                                borderRadius: 5,
                                backgroundColor: theme => theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5
                                }
                            }}
                        />
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mt: 1, textAlign: 'right' }}
                        >
                            {careerProgress}% Complete
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                        Current Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {user?.profile?.skills?.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                        Career Trends
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'success.light',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUp />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Growing Skills
                                    </Typography>
                                </Box>
                                <Typography variant="h6">
                                    {recommendations?.growingSkills?.length || 0}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'warning.light',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingDown />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        Skills to Improve
                                    </Typography>
                                </Box>
                                <Typography variant="h6">
                                    {recommendations?.skillGaps?.length || 0}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CareerSummary;
