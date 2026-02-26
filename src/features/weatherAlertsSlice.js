// features/weatherAlertsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchWeatherAlerts = createAsyncThunk(
  'weatherAlerts/fetchWeatherAlerts',
  async () => {
    const response = await axiosInstance.get('/weather/alerts/');
    return response.data;
  }
);

export const updateAlertStatus = createAsyncThunk(
  'weatherAlerts/updateAlertStatus',
  async ({ alertId, isActive }) => {
    const response = await axiosInstance.patch(`/weather/alerts/${alertId}/`, {
      is_active: isActive
    });
    return response.data;
  }
);

const weatherAlertsSlice = createSlice({
  name: 'weatherAlerts',
  initialState: {
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAlertsError: (state) => {
      state.error = null;
    },
    dismissAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter(alert => alert.id !== alertId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchWeatherAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAlertStatus.fulfilled, (state, action) => {
        const updatedAlert = action.payload;
        const index = state.alerts.findIndex(alert => alert.id === updatedAlert.id);
        if (index !== -1) {
          state.alerts[index] = updatedAlert;
        }
      });
  },
});

export const { clearAlertsError, dismissAlert } = weatherAlertsSlice.actions;
export default weatherAlertsSlice.reducer;