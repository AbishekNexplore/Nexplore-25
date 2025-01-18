import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    LinearProgress,
    Tooltip,
    IconButton,
    Grid
} from '@mui/material';
import {
    Info,
    School,
    WorkspacePremium,
    Timeline,
    TrendingUp
} from '@mui/icons-material';
import { ResponsiveRadar } from '@nivo/radar';

const SkillGapMetrics = ({ data }) => {
    if (!data) return null;

    const getSkillLevelColor = (current, required) => {
        const gap = required - current;
        if (gap <= 0) return 'success';
        if (gap <= 2) return 'warning';
        return 'error';
    };

    const formatSkillLevel = (level) => {
        switch (level) {
            case 1: return 'Beginner';
            case 2: return 'Elementary';
            case 3: return 'Intermediate';
            case 4: return 'Advanced';
            case 5: return 'Expert';
            default: return 'N/A';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Skill Gap Analysis
                </Typography>
                <Tooltip title="Compare your skills with industry requirements">
                    <IconButton size="small">
                        <Info />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Skill Radar Chart */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveRadar
                            data={data.skillRadar}
                            keys={['current', 'required']}
                            indexBy="skill"
                            maxValue="auto"
                            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                            curve="linearClosed"
                            borderWidth={2}
                            borderColor={{ from: 'color' }}
                            gridLevels={5}
                            gridShape="circular"
                            gridLabelOffset={36}
                            enableDots={true}
                            dotSize={10}
                            dotColor={{ theme: 'background' }}
                            dotBorderWidth={2}
                            dotBorderColor={{ from: 'color' }}
                            enableDotLabel={true}
                            dotLabel="value"
                            dotLabelYOffset={-12}
                            colors={{ scheme: 'nivo' }}
                            fillOpacity={0.25}
                            blendMode="multiply"
                            animate={true}
                            motionConfig="wobbly"
                            legends={[
                                {
                                    anchor: 'top-left',
                                    direction: 'column',
                                    translateX: -50,
                                    translateY: -40,
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemTextColor: '#999',
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Skill Gap List */}
            <Typography variant="subtitle1" gutterBottom>
                Detailed Skill Analysis
            </Typography>
            <List>
                {data.skillGaps.map((skill, index) => (
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
                                    <School sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2">
                                        {skill.name}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={`Gap: ${skill.required - skill.current}`}
                                        color={getSkillLevelColor(skill.current, skill.required)}
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="caption" display="block">
                                            Current Level: {formatSkillLevel(skill.current)}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(skill.current / 5) * 100}
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" display="block">
                                            Required Level: {formatSkillLevel(skill.required)}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(skill.required / 5) * 100}
                                            color="secondary"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            {/* Learning Recommendations */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Learning Recommendations
                </Typography>
                <Grid container spacing={2}>
                    {data.recommendations.map((rec, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <WorkspacePremium sx={{ mr: 1 }} />
                                        <Typography variant="subtitle2">
                                            {rec.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {rec.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {rec.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Timeline sx={{ mr: 1 }} />
                                        <Typography variant="caption">
                                            {rec.duration}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Chip
                                            size="small"
                                            icon={<TrendingUp />}
                                            label={`${rec.demandGrowth}% demand`}
                                            color="primary"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default SkillGapMetrics;
