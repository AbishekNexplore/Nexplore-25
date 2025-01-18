import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import {
    Info,
    TrendingUp,
    TrendingDown,
    TrendingFlat
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';

const SalaryTrends = ({ data }) => {
    const [timeRange, setTimeRange] = useState('1Y');
    const [region, setRegion] = useState('all');

    if (!data) return null;

    const getTrendIcon = (trend) => {
        if (trend > 5) return <TrendingUp color="success" />;
        if (trend < -5) return <TrendingDown color="error" />;
        return <TrendingFlat color="warning" />;
    };

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Salary Insights
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small">
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <MenuItem value="1Y">1 Year</MenuItem>
                            <MenuItem value="2Y">2 Years</MenuItem>
                            <MenuItem value="5Y">5 Years</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <Select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <MenuItem value="all">All Regions</MenuItem>
                            <MenuItem value="us">United States</MenuItem>
                            <MenuItem value="eu">Europe</MenuItem>
                            <MenuItem value="asia">Asia</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Salary Trend Chart */}
            <Box sx={{ height: 300, mb: 4 }}>
                <ResponsiveLine
                    data={data.trends}
                    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false
                    }}
                    curve="cardinal"
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Time Period',
                        legendOffset: 40
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Salary (USD)',
                        legendOffset: -50
                    }}
                    enablePoints={true}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    enableArea={true}
                    areaOpacity={0.15}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 0,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            symbolSize: 12,
                            symbolShape: 'circle'
                        }
                    ]}
                />
            </Box>

            {/* Salary Comparison Table */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Entry Level</TableCell>
                            <TableCell align="right">Mid Level</TableCell>
                            <TableCell align="right">Senior Level</TableCell>
                            <TableCell align="right">Trend</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.comparison.map((role) => (
                            <TableRow key={role.title}>
                                <TableCell component="th" scope="row">
                                    {role.title}
                                </TableCell>
                                <TableCell align="right">{formatSalary(role.entry)}</TableCell>
                                <TableCell align="right">{formatSalary(role.mid)}</TableCell>
                                <TableCell align="right">{formatSalary(role.senior)}</TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {getTrendIcon(role.trend)}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Additional Insights */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Top Paying Skills
                            </Typography>
                            <List>
                                {data.topPayingSkills.map((skill, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={skill.name}
                                            secondary={`+${skill.premium}% salary premium`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Regional Variations
                            </Typography>
                            <List>
                                {data.regionalVariations.map((region, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={region.name}
                                            secondary={`${formatSalary(region.averageSalary)} avg.`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Industry Benchmarks
                            </Typography>
                            <List>
                                {data.industryBenchmarks.map((benchmark, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={benchmark.industry}
                                            secondary={`${formatSalary(benchmark.median)} median`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SalaryTrends;
