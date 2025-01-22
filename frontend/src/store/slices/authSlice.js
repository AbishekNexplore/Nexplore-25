import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10001/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Load initial user data from localStorage
const loadUserFromStorage = () => {
    try {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        console.log('Loading user data from storage:', { userData, token });
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
};

// Save user data to localStorage
const saveUserToStorage = (userData) => {
    try {
        console.log('Saving user data to storage:', userData);
        localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

const initialState = {
    user: loadUserFromStorage(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Attempting login:', credentials.email);
            const response = await axios.post('/auth/login', credentials);
            console.log('Login response:', response.data);
            const { token, user } = response.data;
            
            console.log('Login successful, saving data:', { token, user });
            
            // Save token and user data
            localStorage.setItem('token', token);
            saveUserToStorage(user);
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data || { error: error.message || 'Login failed' }
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Attempting registration:', userData.email);
            const response = await axios.post('/auth/register', userData);
            console.log('Registration response:', response.data);
            const { token, user } = response.data;
            
            console.log('Registration successful, saving data:', { token, user });
            
            // Save token and user data
            localStorage.setItem('token', token);
            saveUserToStorage(user);
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data || { error: error.message || 'Registration failed' }
            );
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
            const response = await axios.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Get user error:', error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data || { error: error.message || 'Failed to get user details' }
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Updating profile with data:', userData);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.put('/auth/profile', userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Profile update response:', response.data);
            
            // Save the complete user data
            const updatedUser = {
                ...response.data,
                name: userData.name,
                email: userData.email,
                currentRole: userData.currentRole,
                desiredRole: userData.desiredRole,
                skills: userData.skills,
                experience: userData.experience
            };
            
            // Save to localStorage
            saveUserToStorage(updatedUser);
            
            return updatedUser;
        } catch (error) {
            console.error('Profile update error:', error);
            return rejectWithValue(
                error.response?.data || { error: error.message || 'Failed to update profile' }
            );
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        return null;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        restoreUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            console.log('User data restored:', state.user);
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                // Save to localStorage here as well
                saveUserToStorage(action.payload.user);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Login failed';
                state.isAuthenticated = false;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Registration failed';
                state.isAuthenticated = false;
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to get user details';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Update the entire user object
                state.user = {
                    ...state.user,
                    ...action.payload
                };
                state.error = null;
                // Save to localStorage
                saveUserToStorage(state.user);
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to update profile';
            });
    }
});

export const { clearError, restoreUser } = authSlice.actions;
export default authSlice.reducer;
