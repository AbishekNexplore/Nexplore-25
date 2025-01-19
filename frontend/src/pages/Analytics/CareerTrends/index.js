import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Paper,
  InputAdornment
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Network, DataSet } from 'vis-network/standalone';
import { scaleQuantize } from 'd3-scale';
import { schemeRdYlBu } from 'd3-scale-chromatic';
import SearchIcon from '@mui/icons-material/Search';

// Mock data - replace with actual API calls later
const mockData = {
  salaryTrends: [
    { year: 2020, entry: 50000, mid: 75000, senior: 100000 },
    { year: 2021, entry: 55000, mid: 80000, senior: 110000 },
    { year: 2022, entry: 60000, mid: 85000, senior: 120000 },
    { year: 2023, entry: 65000, mid: 90000, senior: 130000 }
  ],
  skillConnections: {
    nodes: [
      { id: 1, label: 'JavaScript', value: 30, category: 'Frontend' },
      { id: 2, label: 'React', value: 25, category: 'Frontend' },
      { id: 3, label: 'Node.js', value: 20, category: 'Backend' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 1, to: 3 }
    ]
  },
  regionData: {
    regions: {
      US: { jobs: 50000, avgSalary: 95000, remoteJobs: 25000 },
      GB: { jobs: 30000, avgSalary: 85000, remoteJobs: 15000 },
      DE: { jobs: 25000, avgSalary: 80000, remoteJobs: 12000 }
    }
  },
  techTrends: [
    { name: 'React', current: 80, trend: 15, category: 'Frontend' },
    { name: 'Node.js', current: 70, trend: 10, category: 'Backend' },
    { name: 'Python', current: 85, trend: 8, category: 'Language' }
  ]
};

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const CareerTrends = () => {
  const theme = useTheme();
  const networkContainerRef = React.useRef(null);
  const [loading, setLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [data, setData] = useState({
    salaryTrends: [],
    skillConnections: {
      nodes: [],
      edges: []
    },
    regionData: {
      regions: {}
    },
    techTrends: []
  });
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [yearFilter, setYearFilter] = useState(2023);
  const [searchSkill, setSearchSkill] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('jobAvailability');
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSalaryData = data.salaryTrends.map((trend) => {
    const entry = selectedExperience === 'Entry' ? trend.entry : selectedExperience === 'Mid' ? trend.mid : selectedExperience === 'Senior' ? trend.senior : trend.entry + trend.mid + trend.senior;
    return {
      id: selectedExperience === 'All' ? 'All Levels' : selectedExperience,
      color: selectedExperience === 'Entry' ? theme.palette.primary.main : selectedExperience === 'Mid' ? theme.palette.secondary.main : selectedExperience === 'Senior' ? theme.palette.success.main : theme.palette.info.main,
      data: [{ x: trend.year, y: entry }]
    };
  });

  useEffect(() => {
    if (!networkContainerRef.current || !data.skillConnections) return;
    
    try {
      // Process nodes with clustering
      const nodes = data.skillConnections.nodes?.map(node => ({
        ...node,
        group: node.category || 'Other',
        value: node.value || 30,
        title: `${node.label}<br/>Popularity: ${node.value}%<br/>Category: ${node.category || 'Other'}`,
        color: {
          background: node.label.toLowerCase().includes(searchSkill.toLowerCase())
            ? theme.palette.primary.light
            : theme.palette.primary.main,
          border: node.label.toLowerCase().includes(searchSkill.toLowerCase())
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
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
          size: 16,
          face: 'Arial'
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 5,
          x: 2,
          y: 2
        }
      })) || [];

      // Filter nodes based on cluster selection
      const filteredNodes = selectedCluster === 'All'
        ? nodes
        : nodes.filter(node => node.group === selectedCluster);

      // Process edges with smooth curves and animations
      const edges = data.skillConnections.edges?.map(edge => ({
        ...edge,
        color: {
          color: theme.palette.divider,
          highlight: theme.palette.primary.main,
          hover: theme.palette.primary.light,
          opacity: 0.8
        },
        width: 2,
        smooth: {
          type: 'curvedCW',
          roundness: 0.2
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 3
        }
      })) || [];

      // Filter edges based on visible nodes
      const filteredEdges = edges.filter(edge =>
        filteredNodes.some(n => n.id === edge.from) &&
        filteredNodes.some(n => n.id === edge.to)
      );

      const network = new Network(networkContainerRef.current, {
        nodes: new DataSet(filteredNodes),
        edges: new DataSet(filteredEdges)
      }, {
        nodes: {
          shape: 'dot',
          scaling: {
            min: 20,
            max: 40,
            label: {
              min: 14,
              max: 24,
              drawThreshold: 9,
              maxVisible: 20
            }
          },
          font: {
            size: 16,
            face: 'Arial'
          },
          borderWidth: 2,
          shadow: true
        },
        edges: {
          width: 2,
          selectionWidth: 3,
          smooth: {
            type: 'continuous',
            roundness: 0.5
          },
          arrows: {
            to: { enabled: false },
            from: { enabled: false }
          }
        },
        physics: {
          stabilization: {
            enabled: true,
            iterations: 200,
            updateInterval: 25
          },
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 200,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.1
          },
          minVelocity: 0.75,
          maxVelocity: 30
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true,
          hideEdgesOnDrag: true,
          hideEdgesOnZoom: true
        }
      });

      // Add event listeners for interactivity
      network.on("stabilizationProgress", function(params) {
        const progress = Math.round(params.iterations / params.total * 100);
        setLoading(progress);
      });

      network.once("stabilizationIterationsDone", function() {
        setLoading(false);
        network.fit(); // Automatically fit the network to view
      });

      // Add double-click event for zooming to clusters
      network.on("doubleClick", function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            setSelectedCluster(node.group);
          }
        }
      });

      return () => {
        network.destroy();
      };
    } catch (error) {
      console.error("Error initializing skill network:", error);
      setLoading(false);
    }
  }, [data.skillConnections, searchSkill, selectedCluster, theme]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const getMetricColor = (value) => {
    const colors = {
      jobAvailability: ['#ff9999', '#ff3333', '#cc0000'],
      remoteWork: ['#99ff99', '#33ff33', '#00cc00'],
      avgSalary: ['#9999ff', '#3333ff', '#0000cc']
    };
    const colorScale = colors[selectedMetric] || colors.jobAvailability;
    return value > 66 ? colorScale[2] : value > 33 ? colorScale[1] : colorScale[0];
  };

  const getMetricValue = (geo) => {
    const regionData = data.regionData.regions[geo.properties.ISO_A2];
    if (!regionData) return 0;
    switch (selectedMetric) {
      case 'remoteWork':
        return regionData.remoteJobs / regionData.jobs * 100 || 0;
      case 'avgSalary':
        return regionData.avgSalary || 0;
      default:
        return regionData.jobs || 0;
    }
  };

  const renderTooltip = (geo) => {
    const regionData = data.regionData.regions[geo.properties.ISO_A2];
    if (!regionData) return '';
    
    return (
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: theme.shadows[3] }}>
        <Typography variant="subtitle1" gutterBottom>
          {geo.properties.name}
        </Typography>
        <Typography variant="body2">
          Job Availability: {regionData.jobs}%<br/>
          Remote Work: {regionData.remoteJobs / regionData.jobs * 100}%<br/>
          Avg. Salary: ${regionData.avgSalary?.toLocaleString()}
        </Typography>
        {selectedRegion?.id === geo.id && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Click to view job postings
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderRegionalMap = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Regional Job Market Analysis
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>View Metric</InputLabel>
              <Select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                label="View Metric"
              >
                <MenuItem value="jobAvailability">Job Availability</MenuItem>
                <MenuItem value="remoteWork">Remote Work Opportunities</MenuItem>
                <MenuItem value="avgSalary">Average Salary</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ height: 500, position: 'relative' }}>
            <ComposableMap
              projectionConfig={{
                scale: 1000
              }}
            >
              <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const value = getMetricValue(geo);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getMetricColor(value)}
                          stroke={theme.palette.divider}
                          strokeWidth={0.5}
                          style={{
                            default: {
                              outline: 'none'
                            },
                            hover: {
                              fill: theme.palette.primary.light,
                              outline: 'none',
                              cursor: 'pointer'
                            },
                            pressed: {
                              fill: theme.palette.primary.dark,
                              outline: 'none'
                            }
                          }}
                          onMouseEnter={(e) => {
                            const tooltip = document.getElementById('map-tooltip');
                            if (tooltip) {
                              tooltip.style.display = 'block';
                              tooltip.style.left = `${e.clientX + 10}px`;
                              tooltip.style.top = `${e.clientY + 10}px`;
                              tooltip.innerHTML = renderTooltip(geo);
                            }
                          }}
                          onMouseLeave={() => {
                            const tooltip = document.getElementById('map-tooltip');
                            if (tooltip) {
                              tooltip.style.display = 'none';
                            }
                          }}
                          onClick={(event) => {
                            setSelectedRegion(geo);
                            // Add animation effect
                            const pulseCircle = document.createElement('div');
                            pulseCircle.className = 'pulse-circle';
                            pulseCircle.style.left = `${event.clientX}px`;
                            pulseCircle.style.top = `${event.clientY}px`;
                            document.body.appendChild(pulseCircle);
                            setTimeout(() => pulseCircle.remove(), 1000);
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </Box>

          <Box
            id="map-tooltip"
            sx={{
              display: 'none',
              position: 'fixed',
              zIndex: theme.zIndex.tooltip,
              pointerEvents: 'none'
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: getMetricColor(25),
                    color: 'common.white',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2">Low</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: getMetricColor(50),
                    color: 'common.white',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2">Medium</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: getMetricColor(75),
                    color: 'common.white',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2">High</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <style jsx global>{`
            .pulse-circle {
              position: fixed;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${theme.palette.primary.main};
              animation: pulse 1s ease-out;
              pointer-events: none;
              z-index: ${theme.zIndex.tooltip + 1};
            }

            @keyframes pulse {
              0% {
                transform: scale(0);
                opacity: 1;
              }
              100% {
                transform: scale(20);
                opacity: 0;
              }
            }
          `}</style>
        </CardContent>
      </Card>
    );
  };

  const renderTechTrends = () => {
    if (!data.techTrends || !Array.isArray(data.techTrends)) {
      return (
        <Alert severity="warning">
          No technology trend data available
        </Alert>
      );
    }

    return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <Slider
            value={yearFilter}
            onChange={(_, newValue) => setYearFilter(newValue)}
            min={2020}
            max={2024}
            step={1}
            marks={[
              { value: 2020, label: '2020' },
              { value: 2021, label: '2021' },
              { value: 2022, label: '2022' },
              { value: 2023, label: '2023' },
              { value: 2024, label: '2024' }
            ]}
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ height: 500, position: 'relative' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 500"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform="translate(450, 250)">
              {data.techTrends.map((tech, i) => {
                const angle = (i / data.techTrends.length) * 2 * Math.PI;
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const size = (tech.current / 100) * 80 + 30;
                const trendColor = tech.trend >= 10 
                  ? theme.palette.success.main 
                  : tech.trend >= 5 
                    ? theme.palette.warning.main 
                    : theme.palette.error.main;

                return (
                  <g 
                    key={tech.name} 
                    transform={`translate(${x}, ${y})`}
                    style={{
                      transition: 'all 0.5s ease-in-out',
                      cursor: 'pointer'
                    }}
                  >
                    <circle
                      className="tech-bubble"
                      r={size/2}
                      fill={`url(#gradient-${i})`}
                      fillOpacity={0.8}
                      stroke={trendColor}
                      strokeWidth={3}
                      onMouseEnter={(e) => {
                        const circle = e.target;
                        circle.style.transform = 'scale(1.1)';
                        circle.style.filter = 'drop-shadow(0 0 10px rgba(0,0,0,0.3))';
                        const tooltip = document.getElementById('tech-tooltip');
                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.innerHTML = `
                            <div style="padding: 16px;">
                              <h3 style="margin: 0; color: ${trendColor}">${tech.name}</h3>
                              <p style="margin: 8px 0;">
                                Adoption: ${tech.current}%<br/>
                                Growth: ${tech.trend > 0 ? '+' : ''}${tech.trend}%<br/>
                                Category: ${tech.category}
                              </p>
                              <div style="font-size: 12px; color: ${theme.palette.text.secondary}">
                                Salary Impact: ${tech.salaryImpact || 'Moderate'}
                              </div>
                            </div>
                          `;
                          tooltip.style.left = `${e.clientX + 10}px`;
                          tooltip.style.top = `${e.clientY + 10}px`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        const circle = e.target;
                        circle.style.transform = 'scale(1)';
                        circle.style.filter = 'none';
                        const tooltip = document.getElementById('tech-tooltip');
                        if (tooltip) {
                          tooltip.style.opacity = 0;
                        }
                      }}
                    />
                    <defs>
                      <radialGradient id={`gradient-${i}`}>
                        <stop offset="0%" stopColor={theme.palette.primary.light} />
                        <stop offset="100%" stopColor={theme.palette.primary.main} />
                      </radialGradient>
                    </defs>
                    <text
                      textAnchor="middle"
                      dy="0.3em"
                      fill={theme.palette.text.primary}
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {tech.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          
          <Box
            id="tech-tooltip"
            sx={{
              position: 'fixed',
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              p: 2,
              opacity: 0,
              transition: 'all 0.2s ease-in-out',
              pointerEvents: 'none',
              zIndex: theme.zIndex.tooltip,
              '& h3': {
                color: 'primary.main',
                mb: 1
              }
            }}
          />
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: theme.palette.success.main, 
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(0,255,0,0.3)'
            }} />
            <Typography variant="caption">High Growth (&ge;10%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: theme.palette.warning.main, 
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,255,0,0.3)'
            }} />
            <Typography variant="caption">Moderate Growth (5-9%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: theme.palette.error.main, 
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,0,0,0.3)'
            }} />
            <Typography variant="caption">Low Growth (&lt;5%)</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderSkillGalaxy = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skill Galaxy
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Search Skills"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Skill Category</InputLabel>
                <Select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  label="Skill Category"
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Frontend">Frontend</MenuItem>
                  <MenuItem value="Backend">Backend</MenuItem>
                  <MenuItem value="Database">Database</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Cloud">Cloud</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box
          ref={networkContainerRef}
          sx={{
            height: 600,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            '& .vis-network:focus': {
              outline: 'none'
            }
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Double-click a node to focus on its skill category. Use the search bar to highlight specific skills.
            The size of each node represents the skill's popularity in the job market.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl">
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
          <ErrorBoundary>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Career Growth and Salary Insights
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Industry</InputLabel>
                        <Select
                          value={selectedIndustry}
                          onChange={(e) => setSelectedIndustry(e.target.value)}
                          label="Industry"
                        >
                          <MenuItem value="All">All Industries</MenuItem>
                          <MenuItem value="Technology">Technology</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="Healthcare">Healthcare</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          label="Role"
                        >
                          <MenuItem value="All">All Roles</MenuItem>
                          <MenuItem value="Software Developer">Software Developer</MenuItem>
                          <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                          <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Experience Level</InputLabel>
                        <Select
                          value={selectedExperience}
                          onChange={(e) => setSelectedExperience(e.target.value)}
                          label="Experience Level"
                        >
                          <MenuItem value="All">All Levels</MenuItem>
                          <MenuItem value="Entry">Entry Level</MenuItem>
                          <MenuItem value="Mid">Mid Level</MenuItem>
                          <MenuItem value="Senior">Senior Level</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ height: 400, position: 'relative' }}>
                  <ResponsiveLine
                    data={filteredSalaryData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto',
                      stacked: false,
                      reverse: false
                    }}
                    curve="natural"
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
                      legend: 'Salary ($)',
                      legendOffset: -40,
                      legendPosition: 'middle',
                      format: value => `$${value.toLocaleString()}`
                    }}
                    enablePoints={true}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaOpacity={0.1}
                    useMesh={true}
                    enableSlices="x"
                    animate={true}
                    motionConfig="stiff"
                    theme={{
                      background: theme.palette.mode === 'dark' ? '#2D3748' : '#ffffff',
                      textColor: theme.palette.text.primary,
                      fontSize: 11,
                      axis: {
                        domain: {
                          line: {
                            stroke: theme.palette.divider,
                            strokeWidth: 1
                          }
                        },
                        ticks: {
                          line: {
                            stroke: theme.palette.divider,
                            strokeWidth: 1
                          }
                        }
                      },
                      grid: {
                        line: {
                          stroke: theme.palette.divider,
                          strokeWidth: 1
                        }
                      },
                      tooltip: {
                        container: {
                          background: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          fontSize: '12px',
                          borderRadius: '4px',
                          boxShadow: theme.shadows[3],
                          padding: '8px 12px'
                        }
                      }
                    }}
                    sliceTooltip={({ slice }) => (
                      <Box
                        sx={{
                          background: theme.palette.background.paper,
                          padding: '12px',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: '4px',
                          boxShadow: theme.shadows[3]
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Year: {slice.points[0].data.x}
                        </Typography>
                        {slice.points.map(point => (
                          <Box key={point.id} sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: point.serieColor }}>
                              {point.serieId}: ${point.data.y.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Industry: {selectedIndustry}
                              {selectedRole !== 'All' && `, Role: ${selectedRole}`}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    legends={[
                      {
                        anchor: 'bottom-right',
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
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <ErrorBoundary>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skill Galaxy
                </Typography>
                {renderSkillGalaxy()}
              </CardContent>
            </Card>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <ErrorBoundary>
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
                {renderRegionalMap()}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    This map shows the distribution of job opportunities and salary ranges across different regions.
                    Hover over countries to see detailed statistics including total jobs, remote opportunities, and average salaries.
                    Colors indicate salary ranges, with darker colors representing higher average salaries.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <ErrorBoundary>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Technology Adoption Trends
                </Typography>
                {renderTechTrends()}
              </CardContent>
            </Card>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Container>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Visualization error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            Failed to load this visualization. Please try refreshing the page.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default CareerTrends;
