import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchAnalytics = createAsyncThunk(
    'analytics/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/career');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

export const fetchSkillTrends = createAsyncThunk(
    'analytics/skillTrends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/skills');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch skill trends');
        }
    }
);

export const fetchSalaryTrends = createAsyncThunk(
    'analytics/salaryTrends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/salary');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch salary trends');
        }
    }
);

export const fetchIndustryInsights = createAsyncThunk(
    'analytics/industryInsights',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/industry');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch industry insights');
        }
    }
);

export const fetchGeographicalDemand = createAsyncThunk(
    'analytics/geographicalDemand',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/geography');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch geographical demand');
        }
    }
);

// Slice
const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        data: null,
        skillTrends: null,
        salaryTrends: null,
        industryInsights: null,
        geographicalDemand: null,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearData: (state) => {
            state.data = null;
            state.skillTrends = null;
            state.salaryTrends = null;
            state.industryInsights = null;
            state.geographicalDemand = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Analytics
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Skill Trends
            .addCase(fetchSkillTrends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkillTrends.fulfilled, (state, action) => {
                state.loading = false;
                state.skillTrends = action.payload;
                state.error = null;
            })
            .addCase(fetchSkillTrends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Salary Trends
            .addCase(fetchSalaryTrends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalaryTrends.fulfilled, (state, action) => {
                state.loading = false;
                state.salaryTrends = action.payload;
                state.error = null;
            })
            .addCase(fetchSalaryTrends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Industry Insights
            .addCase(fetchIndustryInsights.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIndustryInsights.fulfilled, (state, action) => {
                state.loading = false;
                state.industryInsights = action.payload;
                state.error = null;
            })
            .addCase(fetchIndustryInsights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Geographical Demand
            .addCase(fetchGeographicalDemand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGeographicalDemand.fulfilled, (state, action) => {
                state.loading = false;
                state.geographicalDemand = action.payload;
                state.error = null;
            })
            .addCase(fetchGeographicalDemand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearData } = analyticsSlice.actions;

export default analyticsSlice.reducer;
