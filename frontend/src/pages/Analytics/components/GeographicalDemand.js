import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    LocationOn,
    TrendingUp,
    Info,
    Business
} from '@mui/icons-material';
import { ResponsiveChoropleth } from '@nivo/geo';
import { scaleQuantize } from 'd3-scale';
import worldCountries from '../../../data/world-countries.json';

const GeographicalDemand = ({ data }) => {
    const [jobRole, setJobRole] = useState('all');
    const [timeFrame, setTimeFrame] = useState('current');

    if (!data) return null;

    const getDemandColor = (demand) => {
        const scale = scaleQuantize()
            .domain([0, 100])
            .range(['#ff9994', '#ff7b73', '#ff584f', '#ff3326', '#ff0000']);
        return scale(demand);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Geographical Job Demand
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small">
                        <Select
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                        >
                            <MenuItem value="all">All Roles</MenuItem>
                            {data.availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <Select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <MenuItem value="current">Current</MenuItem>
                            <MenuItem value="3months">Next 3 Months</MenuItem>
                            <MenuItem value="6months">Next 6 Months</MenuItem>
                            <MenuItem value="1year">Next Year</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* World Map with Demand Heatmap */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveChoropleth
                            data={data.demandByCountry}
                            features={worldCountries.features}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            colors="RdYlBu"
                            domain={[0, 100]}
                            unknownColor="#666666"
                            label="properties.name"
                            valueFormat=".2s"
                            projectionScale={140}
                            projectionTranslation={[0.5, 0.5]}
                            projectionRotation={[0, 0, 0]}
                            enableGraticule={true}
                            graticuleLineColor="rgba(0, 0, 0, .2)"
                            borderWidth={0.5}
                            borderColor="#152538"
                            legends={[
                                {
                                    anchor: 'bottom-left',
                                    direction: 'column',
                                    justify: true,
                                    translateX: 20,
                                    translateY: -20,
                                    itemsSpacing: 0,
                                    itemWidth: 94,
                                    itemHeight: 18,
                                    itemDirection: 'left-to-right',
                                    itemTextColor: '#444444',
                                    itemOpacity: 0.85,
                                    symbolSize: 18,
                                    title: 'Demand %',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000000',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Top Regions */}
            <Typography variant="subtitle1" gutterBottom>
                Top Regions by Demand
            </Typography>
            <List>
                {data.topRegions.map((region, index) => (
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
                                    <LocationOn sx={{ mr: 1 }} />
                                    <Typography variant="subtitle2">
                                        {region.name}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        icon={<TrendingUp />}
                                        label={`${region.demandScore}% demand`}
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    />
                                </Box>
                            }
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {region.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {region.topEmployers.map((employer, idx) => (
                                            <Chip
                                                key={idx}
                                                icon={<Business />}
                                                label={employer}
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

            {/* Regional Insights */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Regional Insights
                </Typography>
                <Grid container spacing={2}>
                    {data.insights.map((insight, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {insight.region}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {insight.description}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" display="block" gutterBottom>
                                            Top Skills in Demand:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {insight.topSkills.map((skill, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={skill}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
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

export default GeographicalDemand;
