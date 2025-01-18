import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ResumeFeedback = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && (uploadedFile.type === 'application/pdf' || 
        uploadedFile.type === 'application/msword' || 
        uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(uploadedFile);
      setError(null);
      analyzePDF(uploadedFile);
    } else {
      setError('Please upload a PDF or Word document');
      setFile(null);
    }
  };

  const analyzePDF = async (uploadedFile) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFeedback({
        score: 85,
        strengths: [
          'Clear professional experience section',
          'Good use of action verbs',
          'Relevant technical skills highlighted'
        ],
        improvements: [
          'Add quantifiable achievements',
          'Include more keywords from job descriptions',
          'Strengthen education section'
        ],
        suggestions: [
          'Consider adding certifications',
          'Include a brief professional summary',
          'Add links to project repositories'
        ],
        keywords: [
          'Project Management',
          'Agile',
          'JavaScript',
          'React',
          'Node.js'
        ]
      });
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const FeedbackSection = ({ title, items, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          {title}
        </Typography>
        <List dense>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <InfoIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resume Feedback
        </Typography>
        
        {/* Upload Section */}
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="resume-upload"
            onChange={handleFileUpload}
          />
          <label htmlFor="resume-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              size="large"
              disabled={loading}
            >
              Upload Resume
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              File: {file.name}
            </Typography>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        {loading && (
          <Box sx={{ width: '100%', my: 4 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Analyzing your resume...
            </Typography>
          </Box>
        )}

        {/* Feedback Display */}
        {feedback && !loading && (
          <Box sx={{ mt: 4 }}>
            {/* Score */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" color="primary">
                {feedback.score}/100
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Resume Score
              </Typography>
            </Box>

            {/* Feedback Sections */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FeedbackSection
                  title="Strengths"
                  items={feedback.strengths}
                  icon={<CheckIcon color="success" />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FeedbackSection
                  title="Areas for Improvement"
                  items={feedback.improvements}
                  icon={<WarningIcon color="warning" />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FeedbackSection
                  title="Suggestions"
                  items={feedback.suggestions}
                  icon={<InfoIcon color="info" />}
                />
              </Grid>
            </Grid>

            {/* Keywords */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Key Skills Detected
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {feedback.keywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResumeFeedback;
