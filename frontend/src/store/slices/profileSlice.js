import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
    'profile/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'profile/updateAvatar',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.put('/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update avatar');
        }
    }
);

export const updatePassword = createAsyncThunk(
    'profile/updatePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await api.put('/profile/password', passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update password');
        }
    }
);

export const updateNotifications = createAsyncThunk(
    'profile/updateNotifications',
    async (notificationSettings, { rejectWithValue }) => {
        try {
            const response = await api.put('/profile/notifications', notificationSettings);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update notifications');
        }
    }
);

export const updateCareerPreferences = createAsyncThunk(
    'profile/updateCareerPreferences',
    async (preferences, { rejectWithValue }) => {
        try {
            const response = await api.put('/profile/career-preferences', preferences);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update career preferences');
        }
    }
);

// Slice
const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
        updateStatus: 'idle',
        updateError: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },
        resetUpdateStatus: (state) => {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.profile = { ...state.profile, ...action.payload };
                state.updateError = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })

            // Update Avatar
            .addCase(updateAvatar.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.profile.avatar = action.payload.avatar;
                state.updateError = null;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })

            // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.updateStatus = 'succeeded';
                state.updateError = null;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })

            // Update Notifications
            .addCase(updateNotifications.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateNotifications.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.profile.notifications = action.payload;
                state.updateError = null;
            })
            .addCase(updateNotifications.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            })

            // Update Career Preferences
            .addCase(updateCareerPreferences.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateCareerPreferences.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                state.profile.careerPreferences = action.payload;
                state.updateError = null;
            })
            .addCase(updateCareerPreferences.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            });
    }
});

export const { clearError, resetUpdateStatus } = profileSlice.actions;

export default profileSlice.reducer;
