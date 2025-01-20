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
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, analyzeResume } from '../../../store/slices/resumeSlice';

const ResumeFeedback = () => {
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, resume, analysis } = useSelector((state) => state.resume);

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
        dispatch(analyzeResume());
      } catch (err) {
        setError(err.message || 'Error uploading resume');
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
              {role.roleId.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Match Score: {Math.round(role.matchScore)}%
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Matching Skills:</Typography>
              {role.matchedSkills.map((skill, idx) => (
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
            {role.missingSkills.length > 0 && (
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Resume Feedback
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!resume && (
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
      )}

      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 1 }}>
            Analyzing your resume...
          </Typography>
        </Box>
      )}

      {resume && analysis && (
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
      )}
    </Container>
  );
};

export default ResumeFeedback;
