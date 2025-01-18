import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    LocationOn,
    Work,
    School
} from '@mui/icons-material';

const SalaryInsights = ({ insights }) => {
    return (
        <Grid container spacing={3}>
            {/* Salary Overview */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Salary Overview
                        </Typography>
                        
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Your Expected Salary Range
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    {insights?.expectedRange?.min}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {insights?.expectedRange?.max}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={70}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Based on your skills and experience level
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            Market Statistics
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Industry Average"
                                    secondary={insights?.marketStats?.industryAverage}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Top 10% Earners"
                                    secondary={insights?.marketStats?.topEarners}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Entry Level"
                                    secondary={insights?.marketStats?.entryLevel}
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Factors Affecting Salary */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Salary Factors
                        </Typography>
                        
                        <List>
                            {insights?.factors?.map((factor, index) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {factor.name}
                                                    <Chip
                                                        size="small"
                                                        label={`${factor.impact > 0 ? '+' : ''}${factor.impact}%`}
                                                        color={factor.impact > 0 ? "success" : "error"}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                            secondary={factor.description}
                                        />
                                    </ListItem>
                                    {index < insights.factors.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Location-based Insights */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Location-based Salary Insights
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {insights?.locationInsights?.map((location, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOn color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="subtitle1">
                                                    {location.city}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                {location.averageSalary}
                                            </Typography>
                                            
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Cost of Living Index: {location.costOfLiving}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Job Opportunities: {location.jobCount}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="caption" display="block">
                                                    Top Companies:
                                                </Typography>
                                                {location.topCompanies.map((company, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        size="small"
                                                        label={company}
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Career Growth */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Salary Growth Potential
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {insights?.careerGrowth?.map((level, index) => (
                                <Grid item xs={12} md={3} key={index}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Work color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="subtitle1">
                                                    {level.title}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                {level.salary}
                                            </Typography>
                                            
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Experience: {level.experience}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <School sx={{ fontSize: 16, mr: 0.5 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {level.requiredCertifications} certifications
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {level.keySkills && (
                                                <Box>
                                                    <Typography variant="caption" display="block">
                                                        Key Skills:
                                                    </Typography>
                                                    {level.keySkills.map((skill, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            size="small"
                                                            label={skill}
                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SalaryInsights;
