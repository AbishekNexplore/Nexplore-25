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
    ListItemIcon,
    Chip,
    Button
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Error,
    School
} from '@mui/icons-material';

const SkillGapAnalysis = ({ analysis }) => {
    const getSkillStatus = (score) => {
        if (score >= 80) return { color: 'success', text: 'Expert' };
        if (score >= 60) return { color: 'primary', text: 'Proficient' };
        if (score >= 40) return { color: 'warning', text: 'Intermediate' };
        return { color: 'error', text: 'Beginner' };
    };

    return (
        <Grid container spacing={3}>
            {/* Current Skills Analysis */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Current Skills Analysis
                        </Typography>
                        <List>
                            {analysis?.currentSkills?.map((skill, index) => {
                                const status = getSkillStatus(skill.score);
                                return (
                                    <ListItem key={index}>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                mb: 1
                                            }}>
                                                <Typography variant="body2">
                                                    {skill.name}
                                                </Typography>
                                                <Chip
                                                    label={status.text}
                                                    color={status.color}
                                                    size="small"
                                                />
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={skill.score}
                                                color={status.color}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4
                                                }}
                                            />
                                            <Box sx={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mt: 0.5
                                            }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Market Demand: {skill.marketDemand}%
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Your Score: {skill.score}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Skill Gaps */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recommended Skills to Develop
                        </Typography>
                        <List>
                            {analysis?.skillGaps?.map((skill, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        {skill.priority === 'high' ? (
                                            <Error color="error" />
                                        ) : (
                                            <TrendingUp color="primary" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={skill.name}
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    Market Demand: {skill.marketDemand}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Reason: {skill.reason}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<School />}
                                        sx={{ ml: 2 }}
                                    >
                                        Learn
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Industry Trends */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Industry Trends
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Growing Skills
                                </Typography>
                                <List>
                                    {analysis?.trends?.growing?.map((trend, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <TrendingUp color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={trend.name}
                                                secondary={`Growth Rate: ${trend.growthRate}%`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Declining Skills
                                </Typography>
                                <List>
                                    {analysis?.trends?.declining?.map((trend, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <TrendingDown color="error" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={trend.name}
                                                secondary={`Decline Rate: ${trend.declineRate}%`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SkillGapAnalysis;
