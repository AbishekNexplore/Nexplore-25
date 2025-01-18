import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const mockData = {
  salaryTrends: [
    { year: '2020', entry: 60000, mid: 90000, senior: 130000 },
    { year: '2021', entry: 65000, mid: 95000, senior: 140000 },
    { year: '2022', entry: 70000, mid: 100000, senior: 150000 },
    { year: '2023', entry: 75000, mid: 110000, senior: 160000 },
    { year: '2024', entry: 80000, mid: 120000, senior: 170000 }
  ],
  demandTrends: [
    { skill: 'JavaScript', demand: 85 },
    { skill: 'Python', demand: 90 },
    { skill: 'React', demand: 80 },
    { skill: 'Node.js', demand: 75 },
    { skill: 'Data Science', demand: 95 }
  ],
  industryGrowth: [
    { industry: 'Tech', growth: 15 },
    { industry: 'Healthcare', growth: 12 },
    { industry: 'Finance', growth: 10 },
    { industry: 'Education', growth: 8 },
    { industry: 'Manufacturing', growth: 5 }
  ]
};

const CareerTrends = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('All');

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Career Trends & Insights
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Salary Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Salary Trends
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={data.salaryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="entry" name="Entry Level" stroke="#8884d8" />
                    <Line type="monotone" dataKey="mid" name="Mid Level" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="senior" name="Senior Level" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Demand */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Demand
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.demandTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demand" name="Demand %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Industry Growth */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Industry Growth Rate (%)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.industryGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="growth" name="Growth %" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Highest Growing Skills
                  </Typography>
                  <Typography variant="body2">
                    Data Science, Python, and JavaScript continue to be the most in-demand skills
                    with consistent growth in both job opportunities and compensation.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Salary Trends
                  </Typography>
                  <Typography variant="body2">
                    Senior-level positions show the steepest growth in compensation, while entry-level
                    salaries maintain steady incremental growth.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Industry Outlook
                  </Typography>
                  <Typography variant="body2">
                    Technology and Healthcare sectors demonstrate the highest growth potential,
                    with significant increases in job opportunities and investment.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CareerTrends;
