import { useSelector } from 'react-redux';

const useWeatherDashboardHook = () => {
  return {
    useWeatherDashboardLoading: () => useSelector(state => state.weatherDashboard.loading),
    useWeatherDashboardError: () => useSelector(state => state.weatherDashboard.error),
    useCurrentWeatherdData: () => useSelector(state => state.weatherDashboard.currentWeather),
    useDailyForecastData: () => useSelector(state => state.weatherDashboard.dailyForecast),
    useWeatherPredictions: () => useSelector(state => state.weatherDashboard.predictions),
    useWeatherStats: () => useSelector(state => state.weatherDashboard.stats),
    useSystemStatus: () => useSelector(state => state.weatherDashboard.systemStatus),
    useMLModels: () => useSelector(state => state.weatherDashboard.mlModels),
  };
};

export default useWeatherDashboardHook;