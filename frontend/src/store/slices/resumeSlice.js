import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (file, { dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      console.log('Sending file to server:', file.name, file.type);
      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Server response:', response.data);
      
      if (!response.data.resume) {
        throw new Error('Invalid server response - no resume data');
      }
      
      return response.data.resume;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
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

const initialState = {
  currentResume: null,
  analysis: null,
  loading: false,
  error: null,
  uploadStatus: null
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResume: (state) => {
      state.currentResume = null;
      state.analysis = null;
      state.error = null;
      state.uploadStatus = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
        state.analysis = action.payload.analysis;
        state.uploadStatus = 'success';
        console.log('Setting resume state:', action.payload);
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.uploadStatus = 'error';
      })
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload.analysis;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearResume, setError } = resumeSlice.actions;

export default resumeSlice.reducer;
