// app/nepali-season/dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNepaliSeasons,
  fetchCropSeasons,
  fetchWeatherCoverage,
  fetchMonth
} from '@/features/nepaliSeasonSlice';
import NepaliCalendar from '@/components/nepali-season/NepaliCalendar';
import WeatherCoverageChart from '@/components/nepali-season/WeatherCoverageChart';
import CropSeasonOverview from '@/components/nepali-season/CropSeasonOverview';
import MonthlySummary from '@/components/nepali-season/MonthlySummary';
import AgriculturalAdvisory from '@/components/nepali-season/AgriculturalAdvisory';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import styles from '@/styles/nepali-season/dashboard.module.css';
import {
  Calendar,
  Cloud,
  Droplets,
  Thermometer,
  Leaf,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Moon,
  Sun,
  CloudRain,
  Wind,
} from 'lucide-react';

export default function NepaliSeasonDashboard() {
  const dispatch = useDispatch();
  const {
    nepaliMonths,
    cropSeasons,
    weatherCoverage,
    loading,
    error,
    currentMonth,
  } = useSelector((state) => state.nepaliSeason);
  const safeMonths = Array.isArray(nepaliMonths) ? nepaliMonths : [];

  const [activeView, setActiveView] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    dispatch(fetchNepaliSeasons());
    dispatch(fetchCropSeasons());
    dispatch(fetchWeatherCoverage());
    dispatch(fetchMonth());
  }, [dispatch]);

  const getCurrentNepaliDate = () => {
    // This would integrate with a Nepali date library
    const today = new Date();
    return today.toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getSeasonIcon = (season) => {
    switch (season) {
      case 'summer': return <Sun size={20} />;
      case 'monsoon': return <CloudRain size={20} />;
      case 'autumn': return <Leaf size={20} />;
      case 'winter': return <Moon size={20} />;
      case 'spring': return <TrendingUp size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  const getWeatherDataQuality = (month) => {
    if (!month.weather_data_source || month.weather_data_source === 'none') {
      return { label: 'No Data', color: '#f44336', icon: <AlertTriangle size={16} /> };
    }
    
    const confidence = month.data_confidence || 0;
    if (confidence >= 80) return { label: 'High', color: '#4caf50', icon: <Cloud size={16} /> };
    if (confidence >= 50) return { label: 'Medium', color: '#ff9800', icon: <Cloud size={16} /> };
    return { label: 'Low', color: '#f44336', icon: <Cloud size={16} /> };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }
  console.log('nepaliMonths:', getCurrentNepaliDate());
  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1>
            <Calendar size={32} />
            Nepali Season Dashboard
          </h1>
          <div className={styles.currentDate}>
            <div className={styles.nepaliDate}>
              <span className={styles.dateLabel}>नेपाली मिति:</span>
              <span className={styles.dateValue}>{getCurrentNepaliDate()}</span>
            </div>
            <div className={styles.englishDate}>
              <span className={styles.dateLabel}>English Date:</span>
              <span className={styles.dateValue}>January 1, 2024</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.refreshButton}
            onClick={() => {
              dispatch(fetchNepaliSeasons());
              dispatch(fetchCropSeasons());
            }}
          >
            <RefreshCw size={18} />
            Refresh Data
          </button>
        </div>
      </header>

      {/* View Navigation */}
      <nav className={styles.viewNavigation}>
        {['calendar', 'overview', 'agriculture', 'analysis'].map((view) => (
          <button
            key={view}
            className={`${styles.viewButton} ${activeView === view ? styles.active : ''}`}
            onClick={() => setActiveView(view)}
          >
            {view === 'calendar' && <Calendar size={18} />}
            {view === 'overview' && <Cloud size={18} />}
            {view === 'agriculture' && <Leaf size={18} />}
            {view === 'analysis' && <TrendingUp size={18} />}
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeView === 'calendar' && (
          <div className={styles.calendarView}>
            <div className={styles.calendarSection}>
              <NepaliCalendar 
                months={safeMonths}
                onMonthSelect={setSelectedMonth}
                selectedMonth={selectedMonth}
              />
            </div>
            
            {selectedMonth && (
              <div className={styles.monthDetails}>
                <MonthlySummary month={selectedMonth} />
              </div>
            )}
          </div>
        )}

        {activeView === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.weatherCoverage}>
              <h2>
                <Cloud size={24} />
                Weather Data Coverage
              </h2>
              <WeatherCoverageChart coverage={weatherCoverage} />
            </div>
            
            <div className={styles.seasonalBreakdown}>
              <h2>
                <Calendar size={24} />
                Seasonal Breakdown
              </h2>
              <div className={styles.seasonalStats}>
                {['summer', 'monsoon', 'autumn', 'winter', 'spring'].map((season) => {
                  const seasonMonths = nepaliMonths?.filter(m => m.season_type === season) || [];
                  const monthsWithData = seasonMonths.filter(m => m.weather_data_source !== 'none');
                  
                  return (
                    <div key={season} className={styles.seasonStat}>
                      <div className={styles.seasonIcon}>
                        {getSeasonIcon(season)}
                      </div>
                      <div className={styles.seasonInfo}>
                        <div className={styles.seasonName}>
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </div>
                        <div className={styles.seasonData}>
                          <span className={styles.dataValue}>
                            {monthsWithData.length}/{seasonMonths.length}
                          </span>
                          <span className={styles.dataLabel}>months with data</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === 'agriculture' && (
          <div className={styles.agricultureView}>
            <div className={styles.cropSeasonSection}>
              <h2>
                <Leaf size={24} />
                Crop Seasons
              </h2>
              <CropSeasonOverview seasons={cropSeasons} />
            </div>
            
            <div className={styles.advisorySection}>
              <h2>
                <AlertTriangle size={24} />
                Agricultural Advisory
              </h2>
              <AgriculturalAdvisory 
                currentMonth={currentMonth}
                weatherData={nepaliMonths}
              />
            </div>
          </div>
        )}

        {activeView === 'analysis' && (
          <div className={styles.analysisView}>
            <div className={styles.trendsSection}>
              <h2>
                <TrendingUp size={24} />
                Seasonal Trends
              </h2>
              <div className={styles.trendsGrid}>
                {nepaliMonths?.slice(0, 6).map((month) => {
                  const quality = getWeatherDataQuality(month);
                  return (
                    <div key={month.id} className={styles.trendCard}>
                      <div className={styles.trendHeader}>
                        <h3>{month.nepali_name}</h3>
                        <span 
                          className={styles.qualityBadge}
                          style={{ backgroundColor: quality.color }}
                        >
                          {quality.icon}
                          {quality.label}
                        </span>
                      </div>
                      <div className={styles.trendMetrics}>
                        <div className={styles.metric}>
                          <Thermometer size={16} />
                          <span>
                            Temp: {month.avg_temperature ? `${month.avg_temperature}°C` : 'N/A'}
                          </span>
                        </div>
                        <div className={styles.metric}>
                          <Droplets size={16} />
                          <span>
                            Rain: {month.total_rainfall ? `${month.total_rainfall}mm` : 'N/A'}
                          </span>
                        </div>
                        <div className={styles.metric}>
                          <CloudRain size={16} />
                          <span>
                            Humidity: {month.avg_humidity ? `${month.avg_humidity}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <footer className={styles.footerStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Calendar size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{nepaliMonths?.length || 0}</div>
            <div className={styles.statLabel}>Nepali Months</div>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Cloud size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
            {safeMonths.filter(m => m.weather_data_source !== 'none').length}
            </div>
            <div className={styles.statLabel}>Months with Weather Data</div>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Leaf size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{cropSeasons?.length || 0}</div>
            <div className={styles.statLabel}>Crop Seasons</div>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Wind size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
            {safeMonths.filter(m => m.data_confidence >= 80).length}
            </div>
            <div className={styles.statLabel}>High Confidence Data</div>
          </div>
        </div>
      </footer>
    </div>
  );
}