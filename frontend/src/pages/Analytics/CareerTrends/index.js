import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Paper,
  InputAdornment,
  Button,
  IconButton,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule } from 'react-simple-maps';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Network, DataSet } from 'vis-network/standalone';
import { schemeRdYlBu } from 'd3-scale-chromatic';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
    regionData: {},
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
              { id: 1, label: "React", category: "Frontend", value: 85 },
              { id: 2, label: "Node.js", category: "Backend", value: 80 },
              { id: 3, label: "Python", category: "Backend", value: 90 },
              { id: 4, label: "MongoDB", category: "Database", value: 75 },
              { id: 5, label: "AWS", category: "Cloud", value: 85 },
              { id: 6, label: "Docker", category: "DevOps", value: 80 },
              { id: 7, label: "Kubernetes", category: "DevOps", value: 75 },
              { id: 8, label: "SQL", category: "Database", value: 85 },
              { id: 9, label: "MySQL", category: "Database", value: 80 },
              { id: 10, label: "PostgreSQL", category: "Database", value: 80 }
            ],
            edges: [
              { from: 1, to: 2 },
              { from: 2, to: 3 },
              { from: 2, to: 4 },
              { from: 3, to: 8 },
              { from: 5, to: 6 },
              { from: 6, to: 7 },
              { from: 8, to: 9 },
              { from: 8, to: 10 }
            ]
          },
          regionData: {
            "United States of America": { 
              jobCount: 150000, 
              avgSalary: 95000,
              growthRate: 15
            },
            "United Kingdom": { 
              jobCount: 80000, 
              avgSalary: 75000,
              growthRate: 12
            },
            "Germany": { 
              jobCount: 90000, 
              avgSalary: 70000,
              growthRate: 10
            },
            "France": { 
              jobCount: 70000, 
              avgSalary: 65000,
              growthRate: 8
            },
            "India": { 
              jobCount: 200000, 
              avgSalary: 45000,
              growthRate: 25
            },
            "China": { 
              jobCount: 180000, 
              avgSalary: 55000,
              growthRate: 20
            },
            "Japan": { 
              jobCount: 85000, 
              avgSalary: 80000,
              growthRate: 7
            },
            "Australia": { 
              jobCount: 45000, 
              avgSalary: 85000,
              growthRate: 11
            },
            "Canada": { 
              jobCount: 65000, 
              avgSalary: 80000,
              growthRate: 13
            },
            "Brazil": { 
              jobCount: 55000, 
              avgSalary: 45000,
              growthRate: 18
            }
          }
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
            ? theme.palette.warning.light
            : theme.palette.primary.light,
          border: node.label.toLowerCase().includes(searchSkill.toLowerCase())
            ? theme.palette.warning.main
            : theme.palette.primary.main,
          highlight: {
            background: node.label.toLowerCase().includes(searchSkill.toLowerCase())
              ? theme.palette.warning.light
              : theme.palette.primary.light,
            border: node.label.toLowerCase().includes(searchSkill.toLowerCase())
              ? theme.palette.warning.main
              : theme.palette.primary.main
          },
          hover: {
            background: node.label.toLowerCase().includes(searchSkill.toLowerCase())
              ? theme.palette.warning.main
              : theme.palette.primary.main,
            border: node.label.toLowerCase().includes(searchSkill.toLowerCase())
              ? theme.palette.warning.dark
              : theme.palette.primary.dark
          }
        },
        font: {
          color: node.label.toLowerCase().includes(searchSkill.toLowerCase())
            ? theme.palette.warning.dark
            : theme.palette.text.primary,
          size: node.label.toLowerCase().includes(searchSkill.toLowerCase())
            ? 16
            : 14,
          bold: node.label.toLowerCase().includes(searchSkill.toLowerCase())
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
          opacity: searchSkill 
            ? (filteredNodes.some(n => 
                n.label.toLowerCase().includes(searchSkill.toLowerCase()) && 
                (n.id === edge.from || n.id === edge.to)
              ) ? 0.9 : 0.2)
            : 0.8
        },
        width: searchSkill 
          ? (filteredNodes.some(n => 
              n.label.toLowerCase().includes(searchSkill.toLowerCase()) && 
              (n.id === edge.from || n.id === edge.to)
            ) ? 3 : 1)
          : 2,
        smooth: {
          type: 'curvedCW',
          roundness: 0.2
        }
      })) || [];

      if (!networkInstanceRef.current) {
        const network = new Network(networkContainerRef.current, {
          nodes: new DataSet(filteredNodes),
          edges: new DataSet(edges)
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
        edgesDataSet.add(edges);
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

  const RegionalJobMarket = () => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [selectedMetric, setSelectedMetric] = useState("jobCount");
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
      fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
          console.log("GeoJSON loaded:", data);
          setGeoData(data);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));
    }, []);

    const getColor = useCallback((value) => {
      if (!value) return "#F5F4F6";
      const maxValue = Math.max(...Object.values(data.regionData || {})
        .map(d => d[selectedMetric] || 0));
      const colorScale = scaleSequential()
        .domain([0, maxValue])
        .interpolator(interpolateBlues);
      return colorScale(value);
    }, [data.regionData, selectedMetric]);

    const metrics = {
      jobCount: "Job Openings",
      avgSalary: "Average Salary",
      growthRate: "Growth Rate"
    };

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Regional Job Market Analysis
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Metric</InputLabel>
                  <Select
                    value={selectedMetric}
                    label="Metric"
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    {Object.entries(metrics).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.default',
                  minHeight: '200px'
                }}
              >
                {tooltipContent ? (
                  <>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {tooltipContent.name}
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Job Openings
                        </Typography>
                        <Typography variant="h6">
                          {tooltipContent.jobCount?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Salary
                        </Typography>
                        <Typography variant="h6">
                          ${tooltipContent.avgSalary?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Growth Rate
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: (tooltipContent.growthRate || 0) > 0 
                              ? 'success.main' 
                              : 'error.main'
                          }}
                        >
                          {tooltipContent.growthRate > 0 ? '+' : ''}{tooltipContent.growthRate}%
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Hover over a region to see detailed statistics
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
                <ComposableMap
                  projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                  }}
                >
                  <ZoomableGroup>
                    <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                    <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                    {geoData && (
                      <Geographies geography={geoData}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const countryName = geo.properties.name || geo.properties.ADMIN || geo.properties.NAME;
                            const d = data.regionData[countryName];
                            return (
                              <Geography
                                key={`${geo.rsmKey}-${countryName}`}
                                geography={geo}
                                fill={getColor(d?.[selectedMetric])}
                                stroke="#D6D6DA"
                                strokeWidth={0.5}
                                style={{
                                  default: {
                                    outline: "none"
                                  },
                                  hover: {
                                    fill: "#3f51b5",
                                    outline: "none",
                                    cursor: "pointer"
                                  },
                                  pressed: {
                                    outline: "none"
                                  }
                                }}
                                onMouseEnter={() => {
                                  setTooltipContent(d ? {
                                    name: countryName,
                                    ...d
                                  } : {
                                    name: countryName,
                                    jobCount: 0,
                                    avgSalary: 0,
                                    growthRate: 0
                                  });
                                }}
                                onMouseLeave={() => {
                                  setTooltipContent("");
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                    )}
                  </ZoomableGroup>
                </ComposableMap>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legend
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 200, 
                height: 20, 
                background: 'linear-gradient(to right, #f7fbff, #08519c)'
              }} />
              <Typography variant="body2">
                Low to High {metrics[selectedMetric]}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  // Prevent form submission
  const preventFormSubmit = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const filteredSalaryData = selectedExperience === 'All' 
    ? [
        {
          id: 'Entry Level',
          data: data.salaryTrends.map(trend => ({
            x: trend.year,
            y: trend.entry
          }))
        },
        {
          id: 'Mid Level',
          data: data.salaryTrends.map(trend => ({
            x: trend.year,
            y: trend.mid
          }))
        },
        {
          id: 'Senior Level',
          data: data.salaryTrends.map(trend => ({
            x: trend.year,
            y: trend.senior
          }))
        }
      ]
    : [{
        id: selectedExperience,
        data: data.salaryTrends.map(trend => ({
          x: trend.year,
          y: trend[selectedExperience.toLowerCase()]
        }))
      }];

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data || !data.salaryTrends || !data.techTrends || !data.skillConnections || !data.regionData) {
    return <ErrorMessage message="Failed to load career trends data" />;
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          py: 4,
          mt: '64px', 
          pt: 3,
          flex: 1
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            fontWeight: 600
          }}
        >
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
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'primary.light',
                      minWidth: 160,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" color="primary.dark">
                      Average Growth
                    </Typography>
                    <Typography variant="h6" color="primary.dark">
                      {(() => {
                        const years = data.salaryTrends.length;
                        const firstYear = data.salaryTrends[0];
                        const lastYear = data.salaryTrends[years - 1];
                        const growth = ((lastYear[selectedExperience.toLowerCase()] || 
                          (lastYear.entry + lastYear.mid + lastYear.senior) / 3) - 
                          (firstYear[selectedExperience.toLowerCase()] || 
                          (firstYear.entry + firstYear.mid + firstYear.senior) / 3)) / 
                          (firstYear[selectedExperience.toLowerCase()] || 
                          (firstYear.entry + firstYear.mid + firstYear.senior) / 3) * 100;
                        return `+${growth.toFixed(1)}%`;
                      })()}
                    </Typography>
                  </Paper>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'secondary.light',
                      minWidth: 160,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" color="secondary.dark">
                      Current Average
                    </Typography>
                    <Typography variant="h6" color="secondary.dark">
                      ${(() => {
                        const lastYear = data.salaryTrends[data.salaryTrends.length - 1];
                        const salary = selectedExperience === 'All' 
                          ? (lastYear.entry + lastYear.mid + lastYear.senior) / 3
                          : lastYear[selectedExperience.toLowerCase()];
                        return salary.toLocaleString();
                      })()}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ height: 400, p: 1 }}>
              <ResponsiveLine
                data={filteredSalaryData}
                margin={{ top: 40, right: 160, bottom: 60, left: 80 }}
                xScale={{ 
                  type: 'point',
                  padding: 0.5 
                }}
                yScale={{ 
                  type: 'linear', 
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false,
                  padding: 0.2
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Year',
                  legendOffset: 45,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 10,
                  tickRotation: 0,
                  legend: 'Annual Salary',
                  legendOffset: -60,
                  legendPosition: 'middle',
                  format: value => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                }}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fontSize: 12
                      }
                    },
                    legend: {
                      text: {
                        fontSize: 13,
                        fontWeight: 600
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: '#eee',
                      strokeWidth: 1
                    }
                  },
                  legends: {
                    text: {
                      fontSize: 12
                    }
                  },
                  tooltip: {
                    container: {
                      fontSize: 13
                    }
                  }
                }}
                colors={{ scheme: 'set2' }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={5}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={selectedExperience !== 'All'}
                areaBaselineValue={40000}
                areaOpacity={0.1}
                useMesh={true}
                enableSlices="x"
                crosshairType="bottom"
                motionConfig="gentle"
                lineWidth={2.5}
                curve="monotoneX"
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 140,
                    translateY: 0,
                    itemsSpacing: 12,
                    itemDirection: 'left-to-right',
                    itemWidth: 140,
                    itemHeight: 14,
                    itemOpacity: 0.75,
                    symbolSize: 10,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1,
                          itemBackground: 'rgba(0, 0, 0, .03)'
                        }
                      }
                    ]
                  }
                ]}
                tooltip={({ point }) => (
                  <Box
                    sx={{
                      background: 'white',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      minWidth: '150px'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: point.serieColor, mb: 0.5 }}>
                      {point.serieId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Year: {point.data.x}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                      ${point.data.y.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Data shows average salaries across different experience levels from {data.salaryTrends[0].year} to {data.salaryTrends[data.salaryTrends.length - 1].year}
              </Typography>
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
                <Typography variant="caption">
                  High Growth (&ge;20%)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: theme.palette.warning.main, 
                  borderRadius: '50%' 
                }} />
                <Typography variant="caption">
                  Moderate Growth (10-19%)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: theme.palette.error.main, 
                  borderRadius: '50%' 
                }} />
                <Typography variant="caption">
                  Steady Growth (&lt;10%)
                </Typography>
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

        <RegionalJobMarket />
      </Box>
    </Container>
  );
};

export default CareerTrends;
