// components/weather/CurrentWeatherCard.js
import React from 'react';
import styles from '@/styles/weather.module.css';
import { Cloud, Wind, Droplets, Thermometer, Gauge, Eye } from 'lucide-react';

const CurrentWeatherCard = ({ data }) => {
  if (!data) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`${styles.card} ${styles.currentWeather}`}>
      <div className={styles.temperatureSection}>
        <h2 className={styles.tempMain}>
          {Number(data.temperature).toFixed(1)}°C
        </h2>
        <p className={styles.tempFeelsLike}>
          Feels like {Number(data.feels_like).toFixed(1)}°C
        </p>
        <div className={styles.weatherIcon}>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather_icon}@2x.png`}
            alt={data.weather_description}
            className={styles.weatherIcon}
          />
        </div>
      </div>
      
      <div className={styles.weatherInfo}>
        <h3 className={styles.conditionMain}>{data.weather_main}</h3>
        <p className={styles.conditionDescription}>{data.weather_description}</p>
        
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Droplets size={16} /> Humidity
            </span>
            <span className={styles.statValue}>{data.humidity}%</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Gauge size={16} /> Pressure
            </span>
            <span className={styles.statValue}>{data.pressure} hPa</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Wind size={16} /> Wind Speed
            </span>
            <span className={styles.statValue}>{data.wind_speed} m/s</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Eye size={16} /> Visibility
            </span>
            <span className={styles.statValue}>
              {(data.visibility / 1000).toFixed(1)} km
            </span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Cloud size={16} /> Cloudiness
            </span>
            <span className={styles.statValue}>{data.cloudiness}%</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              <Thermometer size={16} /> Temp Range
            </span>
            <span className={styles.statValue}>
              {Number(data.temp_min).toFixed(1)}° - {Number(data.temp_max).toFixed(1)}°
            </span>
          </div>
        </div>
        
        <div className={styles.sunTimes}>
          <div className={styles.sunItem}>
            <span>🌅 Sunrise</span>
            <strong>{formatTime(data.sunrise)}</strong>
          </div>
          <div className={styles.sunItem}>
            <span>🌇 Sunset</span>
            <strong>{formatTime(data.sunset)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;