import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10001/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Attempting login:', credentials.email);
            const response = await axios.post('/auth/login', credentials);
            console.log('Login response:', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
            return rejectWithValue({ error: 'No token received' });
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
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
            return rejectWithValue({ error: 'No token received' });
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

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
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
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
