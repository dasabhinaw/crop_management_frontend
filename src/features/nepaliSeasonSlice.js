// features/nepaliSeasonSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosConfig';

export const fetchNepaliSeasons = createAsyncThunk(
  'nepaliSeason/fetchNepaliSeasons',
  async () => {
    const response = await axiosInstance.get('nepali-season/months/');
    return response.data;
  }
);

export const fetchCropSeasons = createAsyncThunk(
  'nepaliSeason/fetchCropSeasons',
  async () => {
    const response = await axiosInstance.get('nepali-season/crop-seasons/');
    return response.data;
  }
);

export const fetchWeatherCoverage = createAsyncThunk(
  'nepaliSeason/fetchWeatherCoverage',
  async () => {
    const response = await axiosInstance.get('nepali-season/weather-coverage-report/');
    return response.data;
  }
);

export const fetchMonth = createAsyncThunk(
  'nepaliSeason/fetchMonthLists',
  async () => {
    const response = await axiosInstance.get(`nepali-season/months/`);
    return response.data;
  }
);

export const autoFillWeatherData = createAsyncThunk(
  'nepaliSeason/autoFillWeatherData',
  async (monthId) => {
    const response = await axiosInstance.post(`nepali-season/months/${monthId}/auto-fill/`);
    return response.data;
  }
);

const nepaliSeasonSlice = createSlice({
  name: 'nepaliSeason',
  initialState: {
    nepaliMonths: [],
    cropSeasons: [],
    weatherCoverage: null,
    currentMonth: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload;
    },
    updateMonthData: (state, action) => {
      const index = state.nepaliMonths.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.nepaliMonths[index] = { ...state.nepaliMonths[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNepaliSeasons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNepaliSeasons.fulfilled, (state, action) => {
        state.loading = false;
        state.nepaliMonths = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchNepaliSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCropSeasons.fulfilled, (state, action) => {
        state.cropSeasons = action.payload;
      })
      .addCase(fetchWeatherCoverage.fulfilled, (state, action) => {
        state.weatherCoverage = action.payload;
      })
      .addCase(autoFillWeatherData.fulfilled, (state, action) => {
        const monthId = action.meta.arg;
        const index = state.nepaliMonths.findIndex(m => m.id === monthId);
        if (index !== -1) {
          state.nepaliMonths[index] = { 
            ...state.nepaliMonths[index], 
            ...action.payload 
          };
        }
      })
      .addCase(fetchMonth.pending,(state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonth.fulfilled,(state, action) => {
        const { results } = action.payload;
        state.loading = false;
        state.nepaliMonths = results;
      })
      .addCase(fetchMonth.rejected,(state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { setCurrentMonth, updateMonthData } = nepaliSeasonSlice.actions;
export default nepaliSeasonSlice.reducer;