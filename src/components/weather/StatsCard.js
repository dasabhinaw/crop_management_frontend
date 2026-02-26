// components/weather/StatsCard.js
import React from 'react';
import styles from '@/styles/weather.module.css';
import { BarChart3, Thermometer, Droplets, Wind, Gauge, Cloud } from 'lucide-react';

const StatsCard = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      icon: <Thermometer />,
      label: 'Avg Temperature',
      value: `${stats.temperature_avg}°C`,
      subtext: `Range: ${stats.temperature_min}° - ${stats.temperature_max}°`,
      color: '#ff6b6b',
    },
    {
      icon: <Droplets />,
      label: 'Avg Humidity',
      value: `${stats.humidity_avg}%`,
      subtext: `Range: ${stats.humidity_min}% - ${stats.humidity_max}%`,
      color: '#4d96ff',
    },
    {
      icon: <Gauge />,
      label: 'Avg Pressure',
      value: `${stats.pressure_avg} hPa`,
      color: '#6c5ce7',
    },
    {
      icon: <Wind />,
      label: 'Avg Wind Speed',
      value: `${stats.wind_speed_avg} m/s`,
      color: '#00b894',
    },
    {
      icon: <Cloud />,
      label: 'Data Points',
      value: stats.record_count,
      color: '#fd79a8',
    },
    {
      icon: <BarChart3 />,
      label: 'Period',
      value: '30 Days',
      subtext: 'Historical Analysis',
      color: '#fdcb6e',
    },
  ];

  return (
    <div className={`${styles.card} ${styles.statsCard}`}>
      <div className={styles.statsHeader}>
        <BarChart3 size={32} />
        <h3>Weather Statistics</h3>
        <p>Last 30 Days Analysis</p>
      </div>
      
      <div className={styles.statsGridFull}>
        {statItems.map((item, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className={styles.statValueLarge}>{item.value}</div>
            <div className={styles.statLabelWhite}>{item.label}</div>
            {item.subtext && (
              <div className={styles.statSubtext}>{item.subtext}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;