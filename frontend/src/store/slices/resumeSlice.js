import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const uploadResume = createAsyncThunk(
    'resume/upload',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
        }
    }
);

export const analyzeResume = createAsyncThunk(
    'resume/analyze',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/resume/analyze');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to analyze resume');
        }
    }
);

export const getResumeHistory = createAsyncThunk(
    'resume/history',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/resume/history');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch resume history');
        }
    }
);

// Slice
const resumeSlice = createSlice({
    name: 'resume',
    initialState: {
        resume: null,
        analysis: null,
        history: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearAnalysis: (state) => {
            state.analysis = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Upload Resume
            .addCase(uploadResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.loading = false;
                state.resume = action.payload;
                state.error = null;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Analyze Resume
            .addCase(analyzeResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(analyzeResume.fulfilled, (state, action) => {
                state.loading = false;
                state.analysis = action.payload;
                state.error = null;
            })
            .addCase(analyzeResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Resume History
            .addCase(getResumeHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getResumeHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
                state.error = null;
            })
            .addCase(getResumeHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearAnalysis } = resumeSlice.actions;

export default resumeSlice.reducer;
