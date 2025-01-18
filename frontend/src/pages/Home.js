import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Import icons
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';

const features = [
  {
    title: 'Career Guidance',
    description: 'Get personalized career recommendations based on your skills and interests',
    icon: <WorkIcon fontSize="large" color="primary" />,
    path: '/career-trends'
  },
  {
    title: 'Learning Path',
    description: 'Access curated learning resources to develop your skills',
    icon: <SchoolIcon fontSize="large" color="primary" />,
    path: '/dashboard'
  },
  {
    title: 'AI Career Assistant',
    description: 'Chat with our AI assistant for instant career advice',
    icon: <ChatIcon fontSize="large" color="primary" />,
    path: '/chatbot'
  },
  {
    title: 'Resume Analysis',
    description: 'Get professional feedback on your resume',
    icon: <DescriptionIcon fontSize="large" color="primary" />,
    path: '/resume-feedback'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Shape Your Future Career
              </Typography>
              <Typography variant="h5" paragraph>
                Get AI-powered career guidance, skill development resources, and professional advice
              </Typography>
              <Box sx={{ mt: 4 }}>
                {!isAuthenticated ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ mr: 2 }}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="inherit" 
                      size="large"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add hero image here */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    {feature.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
