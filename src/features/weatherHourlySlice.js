// features/weatherHourlySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchHourlyWeather = createAsyncThunk(
  'weatherHourly/fetchHourlyWeather',
  async ({ hours }) => {
    const response = await axiosInstance.get('/weather/hourly/', {
      params: { hours }
    });
    return response.data;
  }
);

const weatherHourlySlice = createSlice({
  name: 'weatherHourly',
  initialState: {
    hourlyData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHourlyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHourlyWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHourlyWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.hourlyData = action.payload;
      })
      .addCase(fetchHourlyWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearHourlyError } = weatherHourlySlice.actions;
export default weatherHourlySlice.reducer;