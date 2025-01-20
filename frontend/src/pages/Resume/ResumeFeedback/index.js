import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Chip,
  Divider,
  Rating
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, analyzeResume } from '../../../store/slices/resumeSlice';

const ResumeFeedback = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, resume, analysis } = useSelector((state) => state.resume);

  const resetResumeState = () => {
    // Clear the resume and analysis from Redux state
    dispatch({ type: 'resume/clearResume' });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setError(null);
      const formData = new FormData();
      formData.append('resume', file);
      try {
        await dispatch(uploadResume(formData)).unwrap();
        await dispatch(analyzeResume()).unwrap();
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('Please upload a PDF or Word document');
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const PersonalInfoCard = ({ personalInfo }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Personal Information
        </Typography>
        <List dense>
          {personalInfo?.name && (
            <ListItem>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Name" secondary={personalInfo.name} />
            </ListItem>
          )}
          {personalInfo?.email && (
            <ListItem>
              <ListItemIcon><EmailIcon /></ListItemIcon>
              <ListItemText primary="Email" secondary={personalInfo.email} />
            </ListItem>
          )}
          {personalInfo?.phone && (
            <ListItem>
              <ListItemIcon><PhoneIcon /></ListItemIcon>
              <ListItemText primary="Phone" secondary={personalInfo.phone} />
            </ListItem>
          )}
          {personalInfo?.location && (
            <ListItem>
              <ListItemIcon><LocationIcon /></ListItemIcon>
              <ListItemText primary="Location" secondary={personalInfo.location} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );

  const ScoreCard = ({ score, sectionScores }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resume Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" color="primary">
              {score}/100
            </Typography>
          </Box>
          <Rating value={score / 20} readOnly max={5} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Section Scores
        </Typography>
        {sectionScores && Object.entries(sectionScores).map(([section, score]) => (
          <Box key={section} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={score} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const SkillsCard = ({ skills, missingSkills }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills Analysis
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Identified Skills
        </Typography>
        <Box sx={{ mb: 2 }}>
          {skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              color="primary"
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
        {missingSkills?.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Recommended Skills
            </Typography>
            <Box>
              {missingSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="warning"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
        </>
        )}
      </CardContent>
    </Card>
  );

  const FeedbackCard = ({ feedback, aiSuggestions }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Improvement Suggestions
        </Typography>
        <List dense>
          {feedback?.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {item.severity === 'high' ? (
                  <WarningIcon color="error" />
                ) : (
                  <InfoIcon color="info" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.feedback}
                secondary={`Section: ${item.section}`}
              />
            </ListItem>
          ))}
        </List>
        {aiSuggestions && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              AI-Powered Suggestions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {aiSuggestions}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );

  const JobMatchCard = ({ suggestedRoles }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Suggested Job Roles
        </Typography>
        {suggestedRoles?.map((role, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              {role.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Match Score: {Math.round(role.matchScore)}%
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Matching Skills:</Typography>
              {role.matchedSkills?.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ m: 0.25 }}
                />
              ))}
            </Box>
            {role.missingSkills?.length > 0 && (
              <Box>
                <Typography variant="body2">Skills to Develop:</Typography>
                {role.missingSkills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ m: 0.25 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      pt: { xs: 8, sm: 9 },
      pb: 4,
      backgroundColor: (theme) => theme.palette.grey[50]
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3,
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Resume Analysis
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Upload your resume to get personalized feedback and career recommendations
                </Typography>
              </Box>
              {resume && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={resetResumeState}
                  startIcon={<UploadIcon />}
                >
                  Upload New Resume
                </Button>
              )}
            </Paper>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}

          {!resume && (
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '60vh' 
              }}>
                <Paper
                  {...getRootProps()}
                  sx={{
                    p: 6,
                    width: '100%',
                    maxWidth: 500,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon sx={{ 
                    fontSize: 64, 
                    color: 'primary.main', 
                    mb: 2,
                    opacity: isDragActive ? 0.8 : 0.6
                  }} />
                  <Typography variant="h5" gutterBottom fontWeight="medium">
                    {isDragActive ? 'Drop your resume here' : 'Drag and drop your resume here'}
                  </Typography>
                  <Typography color="text.secondary">
                    or click to select a file (PDF or Word document)
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          )}

          {loading && (
            <Grid item xs={12}>
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress />
                <Typography align="center" sx={{ mt: 1 }}>
                  Analyzing your resume...
                </Typography>
              </Box>
            </Grid>
          )}

          {resume && analysis && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <PersonalInfoCard personalInfo={resume.personalInfo} />
                  <ScoreCard 
                    score={analysis.overallScore} 
                    sectionScores={analysis.sectionScores}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <SkillsCard 
                    skills={analysis.extractedSkills}
                    missingSkills={analysis.missingKeySkills}
                  />
                  <FeedbackCard 
                    feedback={analysis.formatFeedback}
                    aiSuggestions={analysis.aiSuggestions}
                  />
                  <JobMatchCard suggestedRoles={resume.suggestedRoles} />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={() => navigate('/learning-path')}
                    >
                      Continue to Learning Path
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}
          {resume && analysis && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {resume?.analysis?.sectionScores && (
                  <Grid item xs={12}>
                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Section Scores
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(resume.analysis.sectionScores).map(([section, score]) => (
                          <Grid item xs={12} sm={6} md={3} key={section}>
                            <Card>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom style={{ textTransform: 'capitalize' }}>
                                  {section}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                  <Box width="100%" mr={1}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={score} 
                                      sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                          backgroundColor: score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336',
                                          borderRadius: 5,
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Box minWidth={35}>
                                    <Typography variant="body2" color="textSecondary">{`${Math.round(score)}%`}</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                )}
                {resume?.analysis?.extractedSkills && (
                  <Grid item xs={12}>
                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Skills Analysis
                      </Typography>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Identified Skills
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {resume.analysis.extractedSkills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                )}
                {resume?.analysis?.suggestions && resume.analysis.suggestions.length > 0 && (
                  <Grid item xs={12}>
                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Improvement Suggestions
                      </Typography>
                      <List>
                        {resume.analysis.suggestions.map((suggestion, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                )}
                {resume?.analysis?.aiSuggestions && (
                  <Grid item xs={12}>
                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        AI-Powered Suggestions
                      </Typography>
                      <Card>
                        <CardContent>
                          <Typography variant="body1">
                            {resume.analysis.aiSuggestions}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                )}
                {resume?.suggestedRoles && resume.suggestedRoles.length > 0 && (
                  <Grid item xs={12}>
                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Suggested Job Roles
                      </Typography>
                      <Grid container spacing={2}>
                        {resume.suggestedRoles.map((role, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {role.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Match Score: {Math.round(role.matchScore)}%
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeFeedback;
