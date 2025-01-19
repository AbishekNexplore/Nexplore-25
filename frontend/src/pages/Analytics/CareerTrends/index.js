import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { Network } from 'vis-network/standalone';
import { ResponsiveLine } from '@nivo/line';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { schemeRdYlBu } from 'd3-scale-chromatic';

// Mock data - replace with actual API calls later
const mockData = {
  salaryTrends: [
    { year: 2020, entry: 60000, mid: 90000, senior: 130000, role: 'Software Developer' },
    { year: 2021, entry: 65000, mid: 95000, senior: 140000, role: 'Software Developer' },
    { year: 2022, entry: 70000, mid: 100000, senior: 150000, role: 'Software Developer' },
    { year: 2023, entry: 75000, mid: 110000, senior: 160000, role: 'Software Developer' },
    { year: 2024, entry: 80000, mid: 120000, senior: 170000, role: 'Software Developer' }
  ],
  skillNetwork: {
    nodes: [
      { id: 1, label: 'JavaScript', value: 85 },
      { id: 2, label: 'Python', value: 90 },
      { id: 3, label: 'React', value: 80 },
      { id: 4, label: 'Node.js', value: 75 },
      { id: 5, label: 'Data Science', value: 95 }
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 4 }
    ]
  },
  regionData: {
    // Sample regional job market data
    regions: {
      'US': { jobs: 5000, avgSalary: 120000, remoteJobs: 2500 },
      'IN': { jobs: 8000, avgSalary: 40000, remoteJobs: 4000 },
      'UK': { jobs: 3000, avgSalary: 90000, remoteJobs: 1500 }
    }
  },
  techTrends: [
    { name: 'React', current: 85, trend: 5, category: 'Frontend' },
    { name: 'Python', current: 90, trend: 8, category: 'Backend' },
    { name: 'AWS', current: 88, trend: 10, category: 'Cloud' },
    { name: 'Docker', current: 82, trend: 7, category: 'DevOps' },
    { name: 'TensorFlow', current: 75, trend: 12, category: 'AI/ML' }
  ]
};

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const CareerTrends = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const networkRef = React.useRef(null);
  const networkContainerRef = React.useRef(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (error) {
        console.error('Error fetching career trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && networkContainerRef.current) {
      // Create nodes with size based on value and color based on demand
      const nodes = data.skillNetwork.nodes.map(node => ({
        ...node,
        size: node.value * 2,
        color: {
          background: theme.palette.primary.main,
          border: theme.palette.primary.dark,
          highlight: {
            background: theme.palette.primary.light,
            border: theme.palette.primary.main
          },
          hover: {
            background: theme.palette.primary.light,
            border: theme.palette.primary.main
          }
        },
        font: {
          color: theme.palette.text.primary,
          size: 16
        },
        shape: 'dot'
      }));

      // Create edges with smooth curves
      const edges = data.skillNetwork.edges.map(edge => ({
        ...edge,
        color: {
          color: theme.palette.divider,
          highlight: theme.palette.primary.main,
          hover: theme.palette.primary.light
        },
        width: 2,
        smooth: {
          type: 'curvedCW',
          roundness: 0.2
        }
      }));

      // Network configuration
      const options = {
        nodes: {
          borderWidth: 2,
          borderWidthSelected: 3,
          scaling: {
            min: 16,
            max: 32
          }
        },
        edges: {
          selectionWidth: 3,
          arrows: {
            to: { enabled: false },
            from: { enabled: false }
          }
        },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18
          },
          maxVelocity: 146,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: { iterations: 150 }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200
        }
      };

      // Create network
      const network = new Network(
        networkContainerRef.current,
        { nodes, edges },
        options
      );

      // Add event listeners
      network.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            // You can add custom click handling here
            console.log('Clicked node:', node);
          }
        }
      });

      networkRef.current = network;

      return () => {
        if (networkRef.current) {
          networkRef.current.destroy();
          networkRef.current = null;
        }
      };
    }
  }, [data, theme]);

  const colorScale = scaleQuantize()
    .domain([0, 150000])
    .range(schemeRdYlBu[9].reverse());

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 10,
        mb: 4,
        position: 'relative',
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: theme.palette.background.default,
        padding: '16px 0'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            position: 'relative',
            zIndex: theme.zIndex.appBar + 1
          }}
        >
          Career Trends & Insights
        </Typography>
      </Box>

      {/* Filters */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <MenuItem value="All">All Industries</MenuItem>
              <MenuItem value="Tech">Technology</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="All">All Roles</MenuItem>
              <MenuItem value="SoftwareDev">Software Developer</MenuItem>
              <MenuItem value="DataScientist">Data Scientist</MenuItem>
              <MenuItem value="DevOps">DevOps Engineer</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Section placeholders - will be implemented separately */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Career Growth and Salary Insights
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveLine
                  data={[
                    {
                      id: "Entry Level",
                      color: theme.palette.primary.main,
                      data: data.salaryTrends.map(d => ({
                        x: d.year,
                        y: d.entry
                      }))
                    },
                    {
                      id: "Mid Level",
                      color: theme.palette.secondary.main,
                      data: data.salaryTrends.map(d => ({
                        x: d.year,
                        y: d.mid
                      }))
                    },
                    {
                      id: "Senior Level",
                      color: theme.palette.success.main,
                      data: data.salaryTrends.map(d => ({
                        x: d.year,
                        y: d.senior
                      }))
                    }
                  ]}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                  }}
                  yFormat=" >-$,.0f"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Year',
                    legendOffset: 36,
                    legendPosition: 'middle'
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Salary (USD)',
                    legendOffset: -40,
                    legendPosition: 'middle',
                    format: value => `$${(value / 1000).toFixed(0)}k`
                  }}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                  theme={{
                    axis: {
                      ticks: {
                        text: {
                          fontSize: 12,
                          fill: theme.palette.text.secondary
                        }
                      },
                      legend: {
                        text: {
                          fontSize: 12,
                          fill: theme.palette.text.primary
                        }
                      }
                    },
                    legends: {
                      text: {
                        fontSize: 12,
                        fill: theme.palette.text.primary
                      }
                    },
                    tooltip: {
                      container: {
                        background: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        fontSize: 12,
                        borderRadius: 4,
                        boxShadow: theme.shadows[1]
                      }
                    }
                  }}
                  motionConfig="gentle"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This chart shows salary progression across different experience levels from {data.salaryTrends[0].year} to {data.salaryTrends[data.salaryTrends.length - 1].year}.
                  Filter by industry and role using the controls above to see specific trends.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Galaxy
              </Typography>
              <Box sx={{ height: 500, position: 'relative' }}>
                <Box
                  ref={networkContainerRef}
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This interactive visualization shows relationships between different skills. 
                  Node size indicates skill demand, and connections show commonly paired skills.
                  Click on nodes to explore related skills and hover for more details.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Regional Job Market Analysis</span>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Average Salary Range (USD)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {schemeRdYlBu[9].reverse().map((color, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: color,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Typography>
              <Box 
                sx={{ 
                  height: 500, 
                  position: 'relative',
                  '& path': {
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }
                }}
                onMouseMove={handleMouseMove}
              >
                <ComposableMap
                  projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                  }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const regionData = data?.regionData?.regions[geo.properties.ISO_A2];
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={regionData ? colorScale(regionData.avgSalary) : theme.palette.grey[200]}
                            stroke={theme.palette.background.paper}
                            strokeWidth={0.5}
                            onMouseEnter={() => {
                              if (regionData) {
                                setTooltipContent(`
                                  <div style="padding: 8px;">
                                    <strong>${geo.properties.name}</strong><br/>
                                    Average Salary: $${regionData.avgSalary.toLocaleString()}<br/>
                                    Total Jobs: ${regionData.jobs.toLocaleString()}<br/>
                                    Remote Jobs: ${regionData.remoteJobs.toLocaleString()} (${Math.round(regionData.remoteJobs/regionData.jobs*100)}%)
                                  </div>
                                `);
                              } else {
                                setTooltipContent("");
                              }
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("");
                            }}
                            style={{
                              default: {
                                outline: 'none'
                              },
                              hover: {
                                fill: theme.palette.primary.light,
                                outline: 'none'
                              },
                              pressed: {
                                outline: 'none'
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
                {tooltipContent && (
                  <Box
                    sx={{
                      position: 'fixed',
                      left: tooltipPosition.x + 10,
                      top: tooltipPosition.y + 10,
                      bgcolor: 'background.paper',
                      boxShadow: theme.shadows[2],
                      borderRadius: 1,
                      zIndex: theme.zIndex.tooltip,
                      '& strong': {
                        color: 'primary.main'
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: tooltipContent }}
                  />
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  This map shows the distribution of job opportunities and salary ranges across different regions.
                  Hover over countries to see detailed statistics including total jobs, remote opportunities, and average salaries.
                  Colors indicate salary ranges, with darker colors representing higher average salaries.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Technology Adoption Trends
              </Typography>
              {/* Technology bubble chart will go here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CareerTrends;
