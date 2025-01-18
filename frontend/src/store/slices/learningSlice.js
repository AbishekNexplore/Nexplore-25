import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchLearningData = createAsyncThunk(
    'learning/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/learning/dashboard');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch learning data');
        }
    }
);

export const enrollInCourse = createAsyncThunk(
    'learning/enroll',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/learning/courses/${courseId}/enroll`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
        }
    }
);

export const updateProgress = createAsyncThunk(
    'learning/updateProgress',
    async ({ courseId, progress }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/learning/courses/${courseId}/progress`, { progress });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
        }
    }
);

export const saveResource = createAsyncThunk(
    'learning/saveResource',
    async (resourceId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/learning/resources/${resourceId}/save`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save resource');
        }
    }
);

export const updateSkillLevel = createAsyncThunk(
    'learning/updateSkill',
    async ({ skillId, level }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/learning/skills/${skillId}/level`, { level });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update skill level');
        }
    }
);

// Slice
const learningSlice = createSlice({
    name: 'learning',
    initialState: {
        data: null,
        currentCourse: null,
        enrollments: [],
        savedResources: [],
        skillLevels: {},
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Learning Data
            .addCase(fetchLearningData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLearningData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchLearningData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Enroll in Course
            .addCase(enrollInCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = [...state.enrollments, action.payload];
                state.error = null;
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Progress
            .addCase(updateProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                state.loading = false;
                const courseIndex = state.enrollments.findIndex(
                    e => e.courseId === action.payload.courseId
                );
                if (courseIndex !== -1) {
                    state.enrollments[courseIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Save Resource
            .addCase(saveResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveResource.fulfilled, (state, action) => {
                state.loading = false;
                state.savedResources = [...state.savedResources, action.payload];
                state.error = null;
            })
            .addCase(saveResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Skill Level
            .addCase(updateSkillLevel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkillLevel.fulfilled, (state, action) => {
                state.loading = false;
                state.skillLevels = {
                    ...state.skillLevels,
                    [action.payload.skillId]: action.payload.level
                };
                state.error = null;
            })
            .addCase(updateSkillLevel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, setCurrentCourse, clearCurrentCourse } = learningSlice.actions;

export default learningSlice.reducer;
