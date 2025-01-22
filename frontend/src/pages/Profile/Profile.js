import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';

const Profile = () => {
  const reduxUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentRole: '',
    desiredRole: '',
    skills: '',
    experience: ''
  });

  useEffect(() => {
    if (reduxUser) {
      setFormData({
        name: reduxUser.name || '',
        email: reduxUser.email || '',
        currentRole: reduxUser.currentRole || '',
        desiredRole: reduxUser.desiredRole || '',
        skills: Array.isArray(reduxUser.skills) ? reduxUser.skills.join(', ') : (reduxUser.skills || ''),
        experience: reduxUser.experience || ''
      });
    }
  }, [reduxUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const processedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      await dispatch(updateProfile(processedData)).unwrap();
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      pt: { xs: 8, sm: 9 },  // Add padding top to account for navbar
      pb: 4,
      backgroundColor: (theme) => theme.palette.grey[50]
    }}>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3,
                backgroundColor: 'transparent',
                border: 'none'
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Profile Settings
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Update your profile information and career preferences
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Role"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Desired Role</InputLabel>
                      <Select
                        label="Desired Role"
                        name="desiredRole"
                        value={formData.desiredRole}
                        onChange={handleChange}
                      >
                        <MenuItem value="Software Developer">Software Developer</MenuItem>
                        <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                        <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills (comma-separated)"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={2}
                      helperText="Enter your skills separated by commas (e.g., JavaScript, React, Node.js)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      helperText="Briefly describe your work experience"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
