// app/page.js - Main Dashboard Page
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/weather.module.css';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import ForecastCard from '@/components/weather/ForecastCard';
import PredictionsCard from '@/components/weather/PredictionsCard';
import StatsCard from '@/components/weather/StatsCard';
import ActionsPanel from '@/components/weather/ActionsPanel';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import {
  fetchWeatherDashboard,
  fetchWeatherPredictions,
  fetchWeatherStats,
  fetchSystemStatus,
} from '@/features/weatherDashboardSlice';
import { MapPin, Clock, Database, Cpu } from 'lucide-react';

export default function WeatherDashboard() {
  const dispatch = useDispatch();
  const {
    currentWeather,
    dailyForecast,
    predictions,
    stats,
    systemStatus,
    mlModels,
    loading,
    error,
    lastUpdated,
  } = useSelector((state) => state.weatherDashboard);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchWeatherDashboard());
      await dispatch(fetchWeatherPredictions());
      await dispatch(fetchWeatherStats());
      await dispatch(fetchSystemStatus());
    };
    loadData();

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchWeatherDashboard());
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleString();
  };

  if (loading && !currentWeather) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div>
          <h1>Smart Weather System</h1>
          <div className={styles.location}>
            <MapPin size={20} />
            <span>Morang, Nepal</span>
          </div>
        </div>
        
        <div className={styles.systemInfo}>
          <div className={styles.infoItem}>
            <Clock size={16} />
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
          <div className={styles.infoItem}>
            <Database size={16} />
            <span>
              {systemStatus?.total_historical_records || 0} records
            </span>
          </div>
          <div className={styles.infoItem}>
            <Cpu size={16} />
            <span>
              {systemStatus?.active_models?.length || 0} active ML models
            </span>
          </div>
        </div>
      </header>

      <main className={styles.mainGrid}>
        <CurrentWeatherCard data={currentWeather} />
        <ForecastCard forecast={dailyForecast} />
        <PredictionsCard predictions={predictions} mlModels={mlModels} />
        <StatsCard stats={stats} />
      </main>

      <ActionsPanel />

      <footer className={styles.footer}>
        <p>
          Powered by OpenWeatherMap API & Machine Learning Predictions | 
          Smart Weather System v1.0
        </p>
        {systemStatus?.current_weather?.weather_timestamp && (
          <small>
            Current observation: {new Date(systemStatus.current_weather.weather_timestamp).toLocaleString()}
          </small>
        )}
      </footer>
    </div>
  );
}