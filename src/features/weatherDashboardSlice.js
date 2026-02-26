// features/weatherDashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchWeatherDashboard = createAsyncThunk(
  'weatherDashboard/fetchDashboard',
  async () => {
    const response = await axiosInstance.get('/weather/dashboard/');
    return response.data;
  }
);

export const fetchWeatherPredictions = createAsyncThunk(
  'weatherDashboard/fetchPredictions',
  async () => {
    const response = await axiosInstance.get('/weather/predictions/?days=7');
    return response.data;
  }
);

export const fetchWeatherStats = createAsyncThunk(
  'weatherDashboard/fetchStats',
  async () => {
    const response = await axiosInstance.get('/weather/stats/');
    return response.data;
  }
);

export const fetchSystemStatus = createAsyncThunk(
  'weatherDashboard/fetchSystemStatus',
  async () => {
    const response = await axiosInstance.get('/weather/status/');
    return response.data;
  }
);

export const updateWeatherData = createAsyncThunk(
  'weatherDashboard/updateWeather',
  async () => {
    const response = await axiosInstance.post('/weather/update/');
    return response.data;
  }
);

export const trainMLModels = createAsyncThunk(
  'weatherDashboard/trainModels',
  async () => {
    const response = await axiosInstance.post('/weather/train-models/');
    return response.data;
  }
);

export const makePredictions = createAsyncThunk(
  'weatherDashboard/makePredictions',
  async () => {
    const response = await axiosInstance.post('/weather/make-predictions/');
    return response.data;
  }
);

const weatherDashboardSlice = createSlice({
  name: 'weatherDashboard',
  initialState: {
    currentWeather: null,
    dailyForecast: [],
    predictions: [],
    stats: null,
    systemStatus: null,
    mlModels: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.current;
        state.dailyForecast = action.payload.daily_next_7d;
        state.lastUpdated = action.payload.last_updated;
      })
      .addCase(fetchWeatherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWeatherPredictions.fulfilled, (state, action) => {
        state.predictions = action.payload;
      })
      .addCase(fetchWeatherStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchSystemStatus.fulfilled, (state, action) => {
        state.systemStatus = action.payload;
        state.mlModels = action.payload.active_models || [];
      });
  },
});

export const { clearError } = weatherDashboardSlice.actions;
export default weatherDashboardSlice.reducer;