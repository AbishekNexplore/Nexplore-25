import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Alert
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

  // Initialize form data from Redux state
  useEffect(() => {
    if (reduxUser) {
      console.log('Setting form data from Redux user:', reduxUser);
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
    try {
      console.log('Submitting form data:', formData);
      // Convert skills string to array and ensure name is properly set
      const updatedData = {
        ...formData,
        name: formData.name.trim(),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };

      console.log('Sending updated data to server:', updatedData);
      // Update user profile in Redux
      const result = await dispatch(updateProfile(updatedData)).unwrap();
      console.log('Profile update result:', result);
      
      // If successful, show success message
      setMessage('Profile updated successfully!');
      setError('');

      // Verify the data was saved
      const savedData = localStorage.getItem('userData');
      console.log('Verified saved user data:', savedData);
      
      // Optional: Update form data with the result
      setFormData(prevData => ({
        ...prevData,
        ...result
      }));
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
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
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Role"
                name="currentRole"
                value={formData.currentRole}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Desired Role"
                name="desiredRole"
                value={formData.desiredRole}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                helperText="Enter your skills separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                multiline
                rows={4}
                value={formData.experience}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 3
              }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ minWidth: '200px' }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
