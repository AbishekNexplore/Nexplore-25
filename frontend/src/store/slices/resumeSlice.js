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
            return response.data.resume;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
        }
    }
);

export const analyzeResume = createAsyncThunk(
    'resume/analyze',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/resume/analysis');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to analyze resume');
        }
    }
);

export const getSuggestedRoles = createAsyncThunk(
    'resume/suggestedRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/resume/suggested-roles');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggested roles');
        }
    }
);

export const reanalyzeResume = createAsyncThunk(
    'resume/reanalyze',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/resume/reanalyze');
            return response.data.resume;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reanalyze resume');
        }
    }
);

// Slice
const resumeSlice = createSlice({
    name: 'resume',
    initialState: {
        resume: null,
        analysis: null,
        suggestedRoles: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearAnalysis: (state) => {
            state.resume = null;
            state.analysis = null;
            state.suggestedRoles = [];
            state.error = null;
            state.success = false;
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
                state.success = true;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Analyze Resume
            .addCase(analyzeResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(analyzeResume.fulfilled, (state, action) => {
                state.loading = false;
                state.analysis = action.payload.analysis;
                state.suggestedRoles = action.payload.suggestedRoles;
                state.success = true;
            })
            .addCase(analyzeResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Get Suggested Roles
            .addCase(getSuggestedRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSuggestedRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestedRoles = action.payload;
                state.success = true;
            })
            .addCase(getSuggestedRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Reanalyze Resume
            .addCase(reanalyzeResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reanalyzeResume.fulfilled, (state, action) => {
                state.loading = false;
                state.resume = action.payload;
                state.analysis = action.payload.analysis;
                state.suggestedRoles = action.payload.suggestedRoles;
                state.success = true;
            })
            .addCase(reanalyzeResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearError, clearAnalysis } = resumeSlice.actions;

export default resumeSlice.reducer;
