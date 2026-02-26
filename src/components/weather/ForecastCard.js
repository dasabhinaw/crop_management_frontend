// components/weather/ForecastCard.js
import React from 'react';
import styles from '@/styles/weather.module.css';

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  };

  return (
    <div className={`${styles.card} ${styles.forecastCard}`}>
      <div className={styles.forecastHeader}>
        <h3>7-Day Forecast</h3>
        <span className={styles.periodLabel}>Next 7 days</span>
      </div>
      
      <div className={styles.forecastGrid}>
        {forecast.slice(0, 7).map((day) => {
          const date = formatDate(day.weather_date);
          return (
            <div key={day.id} className={styles.forecastDay}>
              <div className={styles.dayInfo}>
                <div className={styles.dayName}>{date.weekday}</div>
                <div className={styles.dayDate}>
                  {date.month} {date.day}
                </div>
              </div>
              
              <div className={styles.dayCondition}>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather_icon}.png`}
                  alt={day.weather_description}
                  className={styles.conditionIcon}
                />
                <span className={styles.conditionText}>
                  {day.weather_main}
                </span>
              </div>
              
              <div className={styles.dayTemp}>
                <span className={styles.tempHigh}>
                  {Number(day.temp_max).toFixed(0)}°
                </span>
                <span className={styles.tempLow}>
                  {Number(day.temp_min).toFixed(0)}°
                </span>
              </div>
              
              <div className={styles.dayDetails}>
                <div className={styles.detailItem}>
                  <span>💧</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className={styles.detailItem}>
                  <span>💨</span>
                  <span>{Number(day.wind_speed).toFixed(1)} m/s</span>
                </div>
                {day.pop > 0 && (
                  <div className={styles.detailItem}>
                    <span>🌧️</span>
                    <span>{(day.pop * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;