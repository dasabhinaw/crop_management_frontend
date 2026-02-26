// features/weatherAnalyticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchWeatherCorrelations = createAsyncThunk(
  'weatherAnalytics/fetchCorrelations',
  async () => {
    const response = await axiosInstance.get('/weather/correlations/');
    return response.data;
  }
);

export const fetchWeatherTrends = createAsyncThunk(
  'weatherAnalytics/fetchTrends',
  async ({ period }) => {
    const response = await axiosInstance.get('/weather/trends/', {
      params: { period }
    });
    return response.data;
  }
);

export const fetchPredictionAccuracy = createAsyncThunk(
  'weatherAnalytics/fetchPredictionAccuracy',
  async ({ period }) => {
    const response = await axiosInstance.get('/weather/prediction-accuracy/', {
      params: { period }
    });
    return response.data;
  }
);

export const fetchWeatherStats = createAsyncThunk(
  'weatherAnalytics/fetchWeatherStats',
  async ({ period }) => {
    const response = await axiosInstance.get('/weather/stats/', {
      params: { period }
    });
    return response.data;
  }
);

const weatherAnalyticsSlice = createSlice({
  name: 'weatherAnalytics',
  initialState: {
    correlations: null,
    trends: null,
    accuracy: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherCorrelations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherCorrelations.fulfilled, (state, action) => {
        state.loading = false;
        state.correlations = action.payload;
      })
      .addCase(fetchWeatherCorrelations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWeatherTrends.fulfilled, (state, action) => {
        state.trends = action.payload;
      })
      .addCase(fetchPredictionAccuracy.fulfilled, (state, action) => {
        state.accuracy = action.payload;
      })
      .addCase(fetchWeatherStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearAnalyticsError } = weatherAnalyticsSlice.actions;
export default weatherAnalyticsSlice.reducer;