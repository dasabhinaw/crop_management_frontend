import { useMemo } from 'react';
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import successAnimationReducer from '@/features/successAnimationSlice'
import userPermissionReducer from '@/features/userPermissionSlice'
import weatherDashboardReducer from '@/features/weatherDashboardSlice';
import weatherHistoryReducer from '@/features/weatherHistorySlice';
import weatherAnalyticsReducer from '@/features/weatherAnalyticsSlice'
import weatherHourlyReducer from '@/features/weatherHourlySlice'
import weatherAlertsReducer from '@/features/weatherAlertsSlice'
import nepaliSeasonReducer from '@/features/nepaliSeasonSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth : authReducer,
      successAnimation : successAnimationReducer,
      userPermission : userPermissionReducer,
      weatherDashboard : weatherDashboardReducer,
      weatherHistory : weatherHistoryReducer,
      weatherAnalytics : weatherAnalyticsReducer,
      weatherHourly : weatherHourlyReducer,
      weatherAlerts : weatherAlertsReducer,
      nepaliSeason : nepaliSeasonReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
    devTools: true, // Enable Redux DevTools extension
  })
}

export function useStore(initialState) {
  return useMemo(() => makeStore(initialState), [initialState]);
}