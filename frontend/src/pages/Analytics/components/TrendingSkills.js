import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Tooltip
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    TrendingFlat
} from '@mui/icons-material';
import { ResponsiveBar } from '@nivo/bar';

const TrendingSkills = ({ data }) => {
    if (!data) return null;

    const getTrendIcon = (trend) => {
        if (trend > 5) return <TrendingUp color="success" />;
        if (trend < -5) return <TrendingDown color="error" />;
        return <TrendingFlat color="warning" />;
    };

    const getSkillLevel = (demand) => {
        if (demand >= 80) return 'High';
        if (demand >= 50) return 'Medium';
        return 'Low';
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Trending Skills
            </Typography>

            {/* Skill Demand Chart */}
            <Box sx={{ height: 300, mb: 4 }}>
                <ResponsiveBar
                    data={data.skillDemand}
                    keys={['demand']}
                    indexBy="skill"
                    margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Demand %',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                />
            </Box>

            {/* Skill List */}
            <List>
                {data.skills.map((skill, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 0 }
                        }}
                    >
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">
                                        {skill.name}
                                    </Typography>
                                    <Tooltip title={`${skill.trend}% trend`}>
                                        <Box sx={{ ml: 1 }}>
                                            {getTrendIcon(skill.trend)}
                                        </Box>
                                    </Tooltip>
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>
                                            Demand:
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={skill.demand}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                        />
                                        <Typography variant="body2">
                                            {skill.demand}%
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip
                                            size="small"
                                            label={getSkillLevel(skill.demand)}
                                            color={
                                                skill.demand >= 80 ? 'success' :
                                                skill.demand >= 50 ? 'warning' : 'error'
                                            }
                                        />
                                        {skill.categories.map((category, idx) => (
                                            <Chip
                                                key={idx}
                                                size="small"
                                                label={category}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default TrendingSkills;
