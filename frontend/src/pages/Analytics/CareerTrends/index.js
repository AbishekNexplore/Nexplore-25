import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Paper,
  InputAdornment,
  Button,
  IconButton
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Network, DataSet } from 'vis-network/standalone';
import { schemeRdYlBu } from 'd3-scale-chromatic';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const SearchBox = memo(({ onSearch }) => {
  const [value, setValue] = useState('');
  const timeoutRef = useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onSearch(value);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TextField
      fullWidth
      label="Search Skills"
      variant="outlined"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  );
});

const CareerTrends = () => {
  const theme = useTheme();
  const networkContainerRef = useRef(null);
  const networkInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [yearFilter, setYearFilter] = useState(2023);
  const [searchSkill, setSearchSkill] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('jobAvailability');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [data, setData] = useState({
    salaryTrends: [],
    skillConnections: { nodes: [], edges: [] },
    regionData: [],
    techTrends: []
  });

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const mockData = {
          salaryTrends: [
            { year: 2021, entry: 50000, mid: 80000, senior: 120000 },
            { year: 2022, entry: 55000, mid: 85000, senior: 130000 },
            { year: 2023, entry: 60000, mid: 90000, senior: 140000 }
          ],
          techTrends: [
            { name: 'React', adoption: 70, growth: 15 },
            { name: 'Python', adoption: 65, growth: 20 },
            { name: 'Node.js', adoption: 60, growth: 18 },
            { name: 'TypeScript', adoption: 55, growth: 25 },
            { name: 'Docker', adoption: 50, growth: 22 },
            { name: 'AWS', adoption: 75, growth: 17 }
          ],
          skillConnections: {
            nodes: [
              { id: 1, label: 'JavaScript', category: 'Frontend', value: 85 },
              { id: 2, label: 'React', category: 'Frontend', value: 80 },
              { id: 3, label: 'TypeScript', category: 'Frontend', value: 75 },
              { id: 4, label: 'HTML/CSS', category: 'Frontend', value: 90 },
              { id: 5, label: 'Node.js', category: 'Backend', value: 78 },
              { id: 6, label: 'Python', category: 'Backend', value: 82 },
              { id: 7, label: 'Java', category: 'Backend', value: 75 },
              { id: 8, label: 'SQL', category: 'Database', value: 85 },
              { id: 9, label: 'MongoDB', category: 'Database', value: 70 },
              { id: 10, label: 'PostgreSQL', category: 'Database', value: 72 },
              { id: 11, label: 'Docker', category: 'DevOps', value: 68 },
              { id: 12, label: 'Kubernetes', category: 'DevOps', value: 65 },
              { id: 13, label: 'Jenkins', category: 'DevOps', value: 60 },
              { id: 14, label: 'AWS', category: 'Cloud', value: 80 },
              { id: 15, label: 'Azure', category: 'Cloud', value: 70 },
              { id: 16, label: 'GCP', category: 'Cloud', value: 65 }
            ],
            edges: [
              { from: 1, to: 2 }, // JavaScript -> React
              { from: 1, to: 3 }, // JavaScript -> TypeScript
              { from: 1, to: 4 }, // JavaScript -> HTML/CSS
              { from: 1, to: 5 }, // JavaScript -> Node.js
              { from: 2, to: 3 }, // React -> TypeScript
              { from: 2, to: 4 }, // React -> HTML/CSS
              { from: 5, to: 8 }, // Node.js -> SQL
              { from: 5, to: 9 }, // Node.js -> MongoDB
              { from: 6, to: 8 }, // Python -> SQL
              { from: 6, to: 10 }, // Python -> PostgreSQL
              { from: 7, to: 8 }, // Java -> SQL
              { from: 7, to: 10 }, // Java -> PostgreSQL
              { from: 11, to: 12 }, // Docker -> Kubernetes
              { from: 11, to: 13 }, // Docker -> Jenkins
              { from: 14, to: 11 }, // AWS -> Docker
              { from: 14, to: 12 }, // AWS -> Kubernetes
              { from: 15, to: 11 }, // Azure -> Docker
              { from: 16, to: 11 }, // GCP -> Docker
              { from: 8, to: 9 }, // SQL -> MongoDB
              { from: 8, to: 10 } // SQL -> PostgreSQL
            ]
          },
          regionData: [
            { region: 'North America', jobAvailability: 80, avgSalary: 95000 },
            { region: 'Europe', jobAvailability: 75, avgSalary: 85000 },
            { region: 'Asia', jobAvailability: 70, avgSalary: 65000 },
            { region: 'Australia', jobAvailability: 72, avgSalary: 88000 },
            { region: 'South America', jobAvailability: 65, avgSalary: 55000 }
          ]
        };

        setData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!networkContainerRef.current || !data.skillConnections) return;
    
    try {
      const nodes = data.skillConnections.nodes?.map(node => ({
        ...node,
        group: node.category || 'Other',
        value: node.value || 30,
        title: `${node.label} (${node.category})\nPopularity: ${node.value}%`,
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
        }
      })) || [];

      const filteredNodes = selectedCluster === 'All'
        ? nodes
        : nodes.filter(node => node.group === selectedCluster);

      const edges = data.skillConnections.edges?.map(edge => ({
        ...edge,
        id: `${edge.from}-${edge.to}`,
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
        }
      })) || [];

      const filteredEdges = selectedCluster === 'All'
        ? edges
        : edges.filter(edge =>
            filteredNodes.some(n => n.id === edge.from) &&
            filteredNodes.some(n => n.id === edge.to)
          );

      if (!networkInstanceRef.current) {
        const network = new Network(networkContainerRef.current, {
          nodes: new DataSet(filteredNodes),
          edges: new DataSet(filteredEdges)
        }, {
          nodes: {
            shape: 'dot',
            scaling: {
              min: 20,
              max: 35,
              label: {
                min: 12,
                max: 20,
                drawThreshold: 6,
                maxVisible: 30
              }
            },
            font: {
              size: 14,
              face: 'Arial',
              color: theme.palette.text.primary
            },
            borderWidth: 2,
            shadow: {
              enabled: true,
              color: 'rgba(0,0,0,0.2)',
              size: 5,
              x: 2,
              y: 2
            }
          },
          edges: {
            width: 1.5,
            selectionWidth: 2,
            smooth: {
              type: 'continuous',
              roundness: 0.3
            },
            color: {
              inherit: false,
              color: theme.palette.divider,
              opacity: 0.7,
              highlight: theme.palette.primary.main,
              hover: theme.palette.primary.light
            },
            shadow: {
              enabled: true,
              color: 'rgba(0,0,0,0.1)',
              size: 2
            }
          },
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 120,
              springConstant: 0.03,
              damping: 0.09,
              avoidOverlap: 0.2
            },
            stabilization: {
              enabled: true,
              iterations: 1000,
              updateInterval: 100,
              onlyDynamicEdges: false,
              fit: true
            }
          },
          interaction: {
            hover: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
            multiselect: false,
            dragNodes: true,
            dragView: true,
            zoomView: true,
            selectable: true,
            selectConnectedEdges: true,
            navigationButtons: false,
            keyboard: {
              enabled: true,
              bindToWindow: false
            }
          },
          layout: {
            improvedLayout: true,
            hierarchical: false
          }
        });

        networkInstanceRef.current = network;
      } else {
        const network = networkInstanceRef.current;
        const nodesDataSet = network.body.data.nodes;
        const edgesDataSet = network.body.data.edges;

        nodesDataSet.clear();
        edgesDataSet.clear();
        nodesDataSet.add(filteredNodes);
        edgesDataSet.add(filteredEdges);
        network.fit();
      }

      networkInstanceRef.current.on("stabilizationProgress", function(params) {
        const progress = Math.round(params.iterations / params.total * 100);
        setLoading(progress < 100);
      });

      networkInstanceRef.current.once("stabilizationIterationsDone", function() {
        setLoading(false);
        networkInstanceRef.current.fit();
      });

      networkInstanceRef.current.on("click", function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            const connectedNodes = new Set();
            const connectedEdges = new Set();
            
            edges.forEach(edge => {
              if (edge.from === nodeId || edge.to === nodeId) {
                // Only add connected nodes if they're in the current category filter
                if (selectedCluster === 'All' || 
                    nodes.find(n => n.id === edge.from)?.group === selectedCluster || 
                    nodes.find(n => n.id === edge.to)?.group === selectedCluster) {
                  connectedNodes.add(edge.from);
                  connectedNodes.add(edge.to);
                  connectedEdges.add(edge);
                }
              }
            });

            const nodesDataSet = networkInstanceRef.current.body.data.nodes;
            const edgesDataSet = networkInstanceRef.current.body.data.edges;

            // Only update nodes that are in the current filter
            const visibleNodes = selectedCluster === 'All' 
              ? nodes 
              : nodes.filter(n => n.group === selectedCluster);

            nodesDataSet.update(visibleNodes.map(n => ({
              id: n.id,
              color: {
                background: connectedNodes.has(n.id) ? theme.palette.primary.light : theme.palette.primary.main,
                border: connectedNodes.has(n.id) ? theme.palette.primary.main : theme.palette.primary.dark
              }
            })));

            // Only show edges between visible nodes
            const visibleEdges = edges.filter(e => 
              visibleNodes.some(n => n.id === e.from) && 
              visibleNodes.some(n => n.id === e.to)
            );

            edgesDataSet.update(visibleEdges.map(e => ({
              id: e.id,
              color: {
                color: theme.palette.divider,
                opacity: connectedEdges.has(e) ? 1 : 0.3
              }
            })));
          }
        } else {
          // Reset colors when clicking on empty space
          const nodesDataSet = networkInstanceRef.current.body.data.nodes;
          const edgesDataSet = networkInstanceRef.current.body.data.edges;

          const visibleNodes = selectedCluster === 'All' 
            ? nodes 
            : nodes.filter(n => n.group === selectedCluster);

          nodesDataSet.update(visibleNodes.map(n => ({
            id: n.id,
            color: {
              background: theme.palette.primary.main,
              border: theme.palette.primary.dark
            }
          })));

          const visibleEdges = edges.filter(e => 
            visibleNodes.some(n => n.id === e.from) && 
            visibleNodes.some(n => n.id === e.to)
          );

          edgesDataSet.update(visibleEdges.map(e => ({
            id: e.id,
            color: {
              color: theme.palette.divider,
              opacity: 0.8
            }
          })));
        }
      });

      return () => {
        if (networkInstanceRef.current) {
          networkInstanceRef.current.destroy();
          networkInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing skill network:", error);
    }
  }, [data.skillConnections, searchSkill, selectedCluster, theme]);

  const Legend = () => (
    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
      {['Frontend', 'Backend', 'Database', 'DevOps', 'Cloud'].map((category) => (
        <Box
          key={category}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: theme.palette.background.paper,
            p: 1,
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: selectedCluster === category ? theme.palette.primary.light : theme.palette.primary.main
            }}
          />
          <Typography variant="caption">
            {category}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const ErrorMessage = ({ message }) => (
    <Alert 
      severity="error" 
      sx={{ mb: 2 }}
      action={
        <Button 
          color="inherit" 
          size="small"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );

  const LoadingState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh',
      gap: 2
    }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Loading career insights...
      </Typography>
    </Box>
  );

  // Prevent form submission
  const preventFormSubmit = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data || !data.salaryTrends || !data.techTrends || !data.skillConnections || !data.regionData) {
    return <ErrorMessage message="Failed to load career trends data" />;
  }

  const filteredSalaryData = data.salaryTrends.map((trend) => ({
    id: selectedExperience === 'All' ? 'All Levels' : selectedExperience,
    color: selectedExperience === 'Entry' ? theme.palette.primary.main : 
           selectedExperience === 'Mid' ? theme.palette.secondary.main : 
           selectedExperience === 'Senior' ? theme.palette.success.main : 
           theme.palette.info.main,
    data: [{ 
      x: trend.year, 
      y: selectedExperience === 'Entry' ? trend.entry : 
         selectedExperience === 'Mid' ? trend.mid : 
         selectedExperience === 'Senior' ? trend.senior : 
         trend.entry + trend.mid + trend.senior 
    }]
  }));

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Career Trends & Insights
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Salary Trends by Experience Level
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
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
            <Box sx={{ height: 400 }}>
              <ResponsiveLine
                data={filteredSalaryData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
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
                  legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
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
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Technology Adoption Trends
            </Typography>
            <Grid container spacing={3}>
              {data.techTrends.map((tech) => (
                <Grid item xs={12} sm={6} md={4} key={tech.name}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {tech.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Current Adoption Rate
                      </Typography>
                      <Box sx={{ position: 'relative', pt: 0.5 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.100',
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              width: `${tech.adoption}%`,
                              height: '100%',
                              bgcolor: theme.palette.primary.main,
                              borderRadius: 4,
                              transition: 'width 1s ease-in-out'
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            position: 'absolute',
                            right: 0,
                            top: -20,
                            color: theme.palette.text.secondary
                          }}
                        >
                          {tech.adoption}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: tech.growth >= 20 ? 'success.main' : 
                                  tech.growth >= 10 ? 'warning.main' : 'error.main'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {tech.growth >= 20 ? 'High Growth' : 
                         tech.growth >= 10 ? 'Moderate Growth' : 'Steady Growth'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: theme.palette.success.main, 
                  borderRadius: '50%' 
                }} />
                <Typography variant="caption">High Growth (&ge;20%)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: theme.palette.warning.main, 
                  borderRadius: '50%' 
                }} />
                <Typography variant="caption">Moderate Growth (10-19%)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: theme.palette.error.main, 
                  borderRadius: '50%' 
                }} />
                <Typography variant="caption">Steady Growth (&lt;10%)</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Skill Galaxy
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                      value={selectedCluster}
                      label="Filter by Category"
                      onChange={(e) => setSelectedCluster(e.target.value)}
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
                <Grid item xs={12} sm={6}>
                  <SearchBox onSearch={setSearchSkill} />
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
            <Legend />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Double-click a node to focus on its skill category. Use the search bar to highlight specific skills.
                The size of each node represents the skill's popularity in the job market.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Regional Job Market Analysis
            </Typography>
            <Grid container spacing={2}>
              {data.regionData.map((region) => (
                <Grid item xs={12} sm={6} md={4} key={region.region}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {region.region}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Job Availability Score
                      </Typography>
                      <Slider
                        value={region.jobAvailability}
                        disabled
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Typography variant="body2">
                      Average Salary: ${region.avgSalary.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CareerTrends;
