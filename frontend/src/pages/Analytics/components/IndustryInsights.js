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
    IconButton
} from '@mui/material';
import {
    Info,
    TrendingUp,
    TrendingDown,
    Business,
    People,
    Timeline
} from '@mui/icons-material';
import { ResponsivePie } from '@nivo/pie';

const IndustryInsights = ({ data }) => {
    if (!data) return null;

    const getGrowthIndicator = (growth) => {
        if (growth > 0) {
            return {
                icon: <TrendingUp fontSize="small" />,
                color: 'success'
            };
        }
        return {
            icon: <TrendingDown fontSize="small" />,
            color: 'error'
        };
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Industry Insights
                </Typography>
                <Tooltip title="Based on current market data and future projections">
                    <IconButton size="small">
                        <Info />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Industry Distribution Chart */}
            <Box sx={{ height: 300, mb: 4 }}>
                <ResponsivePie
                    data={data.distribution}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle'
                        }
                    ]}
                />
            </Box>

            {/* Industry Growth Trends */}
            <Typography variant="subtitle1" gutterBottom>
                Growth Trends
            </Typography>
            <List>
                {data.trends.map((industry, index) => (
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
                                    <Business sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2">
                                        {industry.name}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        icon={getGrowthIndicator(industry.growth).icon}
                                        label={`${industry.growth}% growth`}
                                        color={getGrowthIndicator(industry.growth).color}
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ mr: 1 }}>
                                            Market Share:
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={industry.marketShare}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                        />
                                        <Typography variant="body2">
                                            {industry.marketShare}%
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {industry.tags.map((tag, idx) => (
                                            <Chip
                                                key={idx}
                                                label={tag}
                                                size="small"
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

            {/* Key Statistics */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Key Statistics
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Card sx={{ flex: 1 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <People sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">
                                    Employment Rate
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {data.statistics.employmentRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Industry-wide average
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ flex: 1 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Timeline sx={{ mr: 1 }} />
                                <Typography variant="subtitle2">
                                    Job Creation Rate
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {data.statistics.jobCreationRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Annual growth
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default IndustryInsights;
