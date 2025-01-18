import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  trends: [],
  loading: false,
  error: null,
};

// Async thunk for fetching career trends
export const fetchCareerTrends = createAsyncThunk(
  'career/fetchTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/career/trends`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const careerSlice = createSlice({
  name: 'career',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCareerTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchCareerTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch career trends';
      });
  },
});

export const { clearError } = careerSlice.actions;
export default careerSlice.reducer;
