// components/nepali-season/NepaliCalendar.js
'use client';

import React, { useState } from 'react';
import styles from '@/styles/nepali-season/calendar.module.css';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sun,
  CloudRain,
  Leaf,
  Moon,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
} from 'lucide-react';

export default function NepaliCalendar({ months, onMonthSelect, selectedMonth }) {
  const [currentYear, setCurrentYear] = useState(2080); // Example Nepali year

  const getSeasonIcon = (seasonType) => {
    switch (seasonType) {
      case 'summer': return <Sun size={18} className={styles.summerIcon} />;
      case 'monsoon': return <CloudRain size={18} className={styles.monsoonIcon} />;
      case 'autumn': return <Leaf size={18} className={styles.autumnIcon} />;
      case 'winter': return <Moon size={18} className={styles.winterIcon} />;
      case 'spring': return <TrendingUp size={18} className={styles.springIcon} />;
      default: return <CalendarIcon size={18} />;
    }
  };

  const getWeatherIndicator = (month) => {
    if (!month.weather_data_source || month.weather_data_source === 'none') {
      return <div className={styles.noDataIndicator}>No Data</div>;
    }
    
    const confidence = month.data_confidence || 0;
    let color, label;
    
    if (confidence >= 80) {
      color = '#4caf50';
      label = 'High';
    } else if (confidence >= 50) {
      color = '#ff9800';
      label = 'Medium';
    } else {
      color = '#f44336';
      label = 'Low';
    }
    
    return (
      <div 
        className={styles.confidenceIndicator}
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
    );
  };

  const formatDateRange = (month) => {
    if (!month.start_date_english || !month.end_date_english) return '';
    
    const start = new Date(month.start_date_english);
    const end = new Date(month.end_date_english);
    
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  };

  const getMonthClass = (month) => {
    const classes = [styles.monthCard];
    
    if (selectedMonth?.id === month.id) {
      classes.push(styles.selected);
    }
    
    if (month.weather_data_source && month.weather_data_source !== 'none') {
      classes.push(styles.hasWeatherData);
    }
    
    // Add season-specific class
    classes.push(styles[`season-${month.season_type}`]);
    
    return classes.join(' ');
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h2>
          <CalendarIcon size={24} />
          Nepali Calendar {currentYear}
        </h2>
        <div className={styles.yearNavigation}>
          <button 
            className={styles.navButton}
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span className={styles.currentYear}>{currentYear}</span>
          <button 
            className={styles.navButton}
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.seasonLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.summer}`}></div>
          <span>Summer (गृष्म)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.monsoon}`}></div>
          <span>Monsoon (वर्षा)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.autumn}`}></div>
          <span>Autumn (शरद)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.winter}`}></div>
          <span>Winter (शिशिर)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.spring}`}></div>
          <span>Spring (बसन्त)</span>
        </div>
      </div>

      <div className={styles.monthsGrid}>
        {months?.map((month) => (
          <div
            key={month.id}
            className={getMonthClass(month)}
            onClick={() => onMonthSelect(month)}
          >
            <div className={styles.monthHeader}>
              <div className={styles.monthNumber}>
                {month.month_number}
              </div>
              <div className={styles.seasonIcon}>
                {getSeasonIcon(month.season_type)}
              </div>
            </div>
            
            <div className={styles.monthName}>
              <div className={styles.nepaliName}>
                {month.nepali_name}
              </div>
              <div className={styles.englishName}>
                {month.english_name}
              </div>
            </div>
            
            <div className={styles.dateRange}>
              {formatDateRange(month)}
            </div>
            
            <div className={styles.weatherIndicator}>
              {getWeatherIndicator(month)}
            </div>
            
            {month.weather_data_source && month.weather_data_source !== 'none' && (
              <div className={styles.weatherPreview}>
                <div className={styles.weatherMetric}>
                  <Thermometer size={14} />
                  <span>
                    {month.avg_temperature ? `${month.avg_temperature}°C` : '--'}
                  </span>
                </div>
                <div className={styles.weatherMetric}>
                  <Droplets size={14} />
                  <span>
                    {month.avg_humidity ? `${month.avg_humidity}%` : '--'}
                  </span>
                </div>
                <div className={styles.weatherMetric}>
                  <CloudRain size={14} />
                  <span>
                    {month.total_rainfall ? `${month.total_rainfall}mm` : '--'}
                  </span>
                </div>
              </div>
            )}
            
            {month.festivals && month.festivals.length > 0 && (
              <div className={styles.festivalIndicator}>
                <div className={styles.festivalDot}></div>
                <span className={styles.festivalCount}>
                  {month.festivals.length} festival{month.festivals.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.calendarFooter}>
        <div className={styles.dataSourceInfo}>
          <h4>Data Sources Legend:</h4>
          <div className={styles.sourceLegend}>
            <div className={styles.sourceItem}>
              <div className={`${styles.sourceDot} ${styles.high}`}></div>
              <span>High Confidence (≥80%)</span>
            </div>
            <div className={styles.sourceItem}>
              <div className={`${styles.sourceDot} ${styles.medium}`}></div>
              <span>Medium Confidence (50-79%)</span>
            </div>
            <div className={styles.sourceItem}>
              <div className={`${styles.sourceDot} ${styles.low}`}></div>
              <span>Low Confidence (&lt;50%)</span>
            </div>
            <div className={styles.sourceItem}>
              <div className={`${styles.sourceDot} ${styles.none}`}></div>
              <span>No Weather Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}