import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    Tabs,
    Tab,
    Divider,
    CircularProgress,
    IconButton
} from '@mui/material';
import {
    Edit,
    Settings,
    Security,
    Notifications,
    CloudUpload
} from '@mui/icons-material';
import { 
    fetchUserProfile, 
    updateProfile 
} from '../../store/slices/profileSlice';
import PersonalInfo from './components/PersonalInfo';
import CareerPreferences from './components/CareerPreferences';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';
import ActivityHistory from './components/ActivityHistory';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.profile);
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            await dispatch(updateProfile({ avatar: formData }));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="error">
                    Error loading profile: {error}
                </Typography>
            </Box>
        );
    }

    const TabPanel = ({ children, value, index }) => (
        <Box role="tabpanel" hidden={value !== index} sx={{ mt: 3 }}>
            {value === index && children}
        </Box>
    );

    return (
        <Box>
            {/* Profile Header */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profile?.avatar}
                                    sx={{ width: 120, height: 120 }}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleAvatarUpload}
                                />
                                <label htmlFor="avatar-upload">
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <CloudUpload />
                                    </IconButton>
                                </label>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="h4" gutterBottom>
                                    {profile?.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {profile?.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {profile?.location}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Profile Stats */}
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6">
                                        {profile?.stats?.completedCourses || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Completed Courses
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6">
                                        {profile?.stats?.skillsAcquired || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Skills Acquired
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box textAlign="center">
                                    <Typography variant="h6">
                                        {profile?.stats?.achievementPoints || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Achievement Points
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {/* Profile Content */}
            <Card>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<Edit />} label="Personal Info" />
                        <Tab icon={<Settings />} label="Career Preferences" />
                        <Tab icon={<Security />} label="Security" />
                        <Tab icon={<Notifications />} label="Notifications" />
                    </Tabs>

                    <TabPanel value={activeTab} index={0}>
                        <PersonalInfo
                            data={profile?.personalInfo}
                            isEditing={isEditing}
                        />
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                        <CareerPreferences
                            data={profile?.careerPreferences}
                            isEditing={isEditing}
                        />
                    </TabPanel>

                    <TabPanel value={activeTab} index={2}>
                        <SecuritySettings
                            data={profile?.security}
                        />
                    </TabPanel>

                    <TabPanel value={activeTab} index={3}>
                        <NotificationSettings
                            data={profile?.notifications}
                        />
                    </TabPanel>
                </CardContent>
            </Card>

            {/* Activity History */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Activity
                    </Typography>
                    <ActivityHistory data={profile?.activityHistory} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserProfile;
