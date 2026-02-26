// features/weatherHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchHistoricalData = createAsyncThunk(
  'weatherHistory/fetchHistoricalData',
  async ({ startDate, endDate, granularity = 'daily' }) => {
    const response = await axiosInstance.get('/weather/historical/', {
      params: { start_date: startDate, end_date: endDate, granularity }
    });
    return response.data;
  }
);

export const fetchWeatherStats = createAsyncThunk(
  'weatherHistory/fetchWeatherStats',
  async (dateRange) => {
    const response = await axiosInstance.get('/weather/stats/', {
      params: dateRange
    });
    return response.data;
  }
);

export const fetchPredictionAccuracy = createAsyncThunk(
  'weatherHistory/fetchPredictionAccuracy',
  async (dateRange) => {
    const response = await api.get('/weather/prediction-accuracy/', {  
      params: {
        start_date: dateRange.start,
        end_date: dateRange.end
      }
    });
    return response.data;
  }
);

export const fetchCorrelations = createAsyncThunk(
  'weatherHistory/fetchCorrelations',
  async () => {
    const response = await axiosInstance.get('/weather/correlations/');
    return response.data;
  }
);

const weatherHistorySlice = createSlice({
  name: 'weatherHistory',
  initialState: {
    historicalData: [],
    stats: null,
    accuracyData: [],
    correlations: {},
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoricalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.loading = false;
        state.historicalData = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWeatherStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchPredictionAccuracy.fulfilled, (state, action) => {
        state.accuracyData = action.payload;
      })
      .addCase(fetchCorrelations.fulfilled, (state, action) => {
        state.correlations = action.payload;
      });
  },
});

export const { clearError, setDateRange } = weatherHistorySlice.actions;
export default weatherHistorySlice.reducer;