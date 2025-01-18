import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Tooltip
} from '@mui/material';

const SkillsProgress = () => {
    const { recommendations } = useSelector((state) => state.career);

    // Example skills data
    const skills = [
        { name: 'React', progress: 85 },
        { name: 'Node.js', progress: 70 },
        { name: 'Python', progress: 60 },
        { name: 'Data Analysis', progress: 75 },
        { name: 'Machine Learning', progress: 45 }
    ];

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'success';
        if (progress >= 60) return 'primary';
        if (progress >= 40) return 'warning';
        return 'error';
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Skills Progress
            </Typography>

            <List>
                {skills.map((skill, index) => (
                    <ListItem key={index} sx={{ display: 'block', py: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">
                                {skill.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {skill.progress}%
                            </Typography>
                        </Box>
                        <Tooltip title={`${skill.progress}% proficiency`}>
                            <LinearProgress
                                variant="determinate"
                                value={skill.progress}
                                color={getProgressColor(skill.progress)}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3
                                    }
                                }}
                            />
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Recommended Skills to Learn
                </Typography>
                <List dense>
                    {recommendations?.recommendedSkills?.slice(0, 3).map((skill, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={skill.name}
                                secondary={skill.reason}
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                                secondaryTypographyProps={{
                                    variant: 'caption'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default SkillsProgress;
