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
  Rating,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, clearResume } from '../../../store/slices/resumeSlice';

const ResumeFeedback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const resume = useSelector((state) => state.resume.currentResume);
  const analysis = useSelector((state) => state.resume.analysis);
  
  console.log('ResumeFeedback rendering');
  console.log('Current resume state:', resume);
  console.log('Current analysis state:', analysis);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!(file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setError('Please upload a PDF or Word document');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Uploading file:', file.name, 'type:', file.type);
      const resultAction = await dispatch(uploadResume(file));
      if (uploadResume.fulfilled.match(resultAction)) {
        console.log('Upload successful');
      } else {
        throw new Error(resultAction.error?.message || 'Failed to upload resume');
      }
      setUploading(false);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload resume');
      setUploading(false);
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    noClick: false,
    noKeyboard: false
  });

  const PersonalInfoCard = ({ personalInfo }) => {
    console.log('PersonalInfoCard received:', personalInfo);
    
    // Only hide if personalInfo is completely empty
    if (!personalInfo || (Object.keys(personalInfo).length === 0)) {
      console.log('No personal info provided');
      return null;
    }

    // Check if we have any non-null values
    const hasValidInfo = Object.values(personalInfo).some(val => val !== null && val !== undefined);
    if (!hasValidInfo) {
      console.log('No valid personal info found');
      return null;
    }

    console.log('Rendering personal info card with:', personalInfo);

    return (
      <Card sx={{ mb: 2, minHeight: '200px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            Personal Information
          </Typography>
          <List>
            {personalInfo.name && (
              <ListItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.name} 
                  primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                  secondary="Name"
                />
              </ListItem>
            )}
            {personalInfo.email && (
              <ListItem>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.email}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary="Email"
                />
              </ListItem>
            )}
            {personalInfo.phone && (
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.phone}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary="Phone"
                />
              </ListItem>
            )}
            {personalInfo.location && personalInfo.location !== personalInfo.name && (
              <ListItem>
                <ListItemIcon>
                  <LocationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.location}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary="Location"
                />
              </ListItem>
            )}
            {personalInfo.linkedin && (
              <ListItem>
                <ListItemIcon>
                  <LinkedInIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.linkedin}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary="LinkedIn"
                />
              </ListItem>
            )}
            {personalInfo.portfolio && !personalInfo.portfolio.includes('/') && (
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={personalInfo.portfolio}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary="GPA"
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    );
  };

  const ScoreCard = ({ overallScore, sectionScores }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resume Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" color="primary">
              {overallScore}/100
            </Typography>
          </Box>
          <Rating value={overallScore / 20} readOnly max={5} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Section Scores
        </Typography>
        {sectionScores && Object.entries(sectionScores).map(([section, score]) => (
          <Box key={section} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {section}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: score >= 80 ? 'success.main' : score >= 60 ? 'warning.main' : 'error.main',
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 35 }}>
                {Math.round(score)}%
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const SkillsCard = ({ extractedSkills, missingSkills }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills Analysis
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Identified Skills
        </Typography>
        <Box sx={{ mb: 2 }}>
          {extractedSkills?.map((skill, index) => (
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

  const SuggestedRolesCard = ({ roles }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Suggested Job Roles
        </Typography>
        {roles?.map((role, index) => (
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

  const SuggestionsCard = ({ suggestions }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Improvement Suggestions
        </Typography>
        <List dense>
          {suggestions?.map((item, index) => (
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
                  onClick={() => dispatch(clearResume())}
                  startIcon={<UploadIcon />}
                >
                  Upload New Resume
                </Button>
              )}
            </Paper>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )}

          {!resume && (
            <Grid item xs={12}>
              <Paper
                {...getRootProps()}
                sx={{
                  p: 3,
                  mb: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop your resume here' : 'Drag and drop your resume here'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  or click to select a file (PDF, DOC, DOCX)
                </Typography>
                {uploading && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Uploading...
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}

          {resume && analysis && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'sticky', top: 24 }}>
                    <PersonalInfoCard personalInfo={analysis.personalInfo} />
                    <ScoreCard overallScore={analysis.overallScore} sectionScores={analysis.sectionScores} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <SkillsCard extractedSkills={analysis.extractedSkills} missingSkills={analysis.missingKeySkills} />
                  <SuggestedRolesCard roles={resume.suggestedRoles} />
                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <SuggestionsCard suggestions={analysis.suggestions} />
                  )}
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
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeFeedback;
