// app/weather/hourly/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Bar,
  ComposedChart,
} from 'recharts';
import { fetchHourlyWeather } from '@/features/weatherHourlySlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import styles from '@/styles/hourly.module.css';
import {
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Zap,
  Sunrise,
  Sunset,
  Navigation,
  Eye,
  CloudRain,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function HourlyPage() {
  const dispatch = useDispatch();
  const { 
    hourlyData, 
    loading, 
    error 
  } = useSelector((state) => state.weatherHourly);
  
  const [hoursAhead, setHoursAhead] = useState(48);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [viewMode, setViewMode] = useState('chart');

  useEffect(() => {
    dispatch(fetchHourlyWeather({ hours: hoursAhead }));
    
    // Update current hour every minute
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [dispatch, hoursAhead]);

  const prepareChartData = () => {
    if (!Array.isArray(hourlyData)) return [];
    
    return hourlyData.map(item => ({
      time: new Date(item.forecast_time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      hour: new Date(item.forecast_time).getHours(),
      date: new Date(item.forecast_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      temperature: Number(item.temperature),
      feels_like: Number(item.feels_like),
      humidity: item.humidity,
      pressure: item.pressure,
      wind_speed: Number(item.wind_speed),
      cloudiness: item.cloudiness,
      pop: item.pop * 100,
      weather_main: item.weather_main,
      weather_icon: item.weather_icon,
    }));
  };

  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌁',
    };
    return icons[weatherMain] || '🌤️';
  };

  const getMetricDetails = (metric) => {
    const details = {
      temperature: {
        label: 'Temperature',
        unit: '°C',
        icon: <Thermometer size={20} />,
        color: '#ff6b6b',
        description: 'Air temperature',
      },
      feels_like: {
        label: 'Feels Like',
        unit: '°C',
        icon: <Thermometer size={20} />,
        color: '#ff9800',
        description: 'Perceived temperature',
      },
      humidity: {
        label: 'Humidity',
        unit: '%',
        icon: <Droplets size={20} />,
        color: '#4d96ff',
        description: 'Relative humidity',
      },
      pressure: {
        label: 'Pressure',
        unit: 'hPa',
        icon: <Gauge size={20} />,
        color: '#6c5ce7',
        description: 'Atmospheric pressure',
      },
      wind_speed: {
        label: 'Wind Speed',
        unit: 'm/s',
        icon: <Wind size={20} />,
        color: '#00b894',
        description: 'Wind speed',
      },
      cloudiness: {
        label: 'Cloudiness',
        unit: '%',
        icon: <Cloud size={20} />,
        color: '#fd79a8',
        description: 'Cloud coverage',
      },
      pop: {
        label: 'Precipitation',
        unit: '%',
        icon: <CloudRain size={20} />,
        color: '#0984e3',
        description: 'Probability of precipitation',
      },
    };
    return details[metric] || details.temperature;
  };

  const getCurrentReading = () => {
    const data = prepareChartData();
    if (data.length === 0) return null;
    
    // Find the closest hour to current time
    const now = new Date();
    const currentData = data.find(item => {
      const itemHour = new Date(item.forecast_time || now).getHours();
      return Math.abs(itemHour - currentHour) <= 1;
    }) || data[0];
    
    return currentData;
  };

  const renderChart = () => {
    const data = prepareChartData();
    const metricDetails = getMetricDetails(selectedMetric);

    return (
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ 
                value: `${metricDetails.label} (${metricDetails.unit})`, 
                angle: -90, 
                position: 'insideLeft',
                fontSize: 12 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`${value} ${metricDetails.unit}`, metricDetails.label]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              fill={metricDetails.color}
              fillOpacity={0.1}
              stroke={metricDetails.color}
              strokeWidth={2}
              name={metricDetails.label}
            />
            <Bar
              dataKey="pop"
              fill="#0984e3"
              fillOpacity={0.3}
              name="Precipitation %"
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderHourlyGrid = () => {
    const data = prepareChartData();
    
    // Group by date
    const groupedByDate = {};
    data.forEach(item => {
      const date = item.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });

    return (
      <div className={styles.hourlyGrid}>
        {Object.entries(groupedByDate).map(([date, hours]) => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateHeader}>
              <h4>{date}</h4>
              <div className={styles.dateSummary}>
                <span>
                  {Math.min(...hours.map(h => h.temperature)).toFixed(1)}° - 
                  {Math.max(...hours.map(h => h.temperature)).toFixed(1)}°
                </span>
                <span className={styles.weatherIcon}>
                  {getWeatherIcon(hours[0]?.weather_main)}
                </span>
              </div>
            </div>
            
            <div className={styles.hoursGrid}>
              {hours.map((hour, index) => (
                <div 
                  key={index} 
                  className={`${styles.hourCard} ${
                    hour.hour === currentHour ? styles.currentHour : ''
                  }`}
                >
                  <div className={styles.hourTime}>
                    <Clock size={14} />
                    <span>{hour.time}</span>
                  </div>
                  
                  <div className={styles.hourWeather}>
                    <span className={styles.weatherIcon}>
                      {getWeatherIcon(hour.weather_main)}
                    </span>
                    <span className={styles.temperature}>
                      {hour.temperature.toFixed(1)}°
                    </span>
                  </div>
                  
                  <div className={styles.hourDetails}>
                    <div className={styles.detailItem}>
                      <Droplets size={12} />
                      <span>{hour.humidity}%</span>
                    </div>
                    <div className={styles.detailItem}>
                      <Wind size={12} />
                      <span>{hour.wind_speed.toFixed(1)}</span>
                    </div>
                    {hour.pop > 0 && (
                      <div className={styles.detailItem}>
                        <CloudRain size={12} />
                        <span>{hour.pop.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
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

  const currentReading = getCurrentReading();
  const metricDetails = getMetricDetails(selectedMetric);

  return (
    <div className={styles.hourlyContainer}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1>
            <Clock size={32} />
            Hourly Forecast
          </h1>
          <div className={styles.location}>
            <MapPin size={18} />
            <span>Morang, Nepal</span>
          </div>
        </div>
        
        <div className={styles.headerControls}>
          <div className={styles.timeRange}>
            <button
              className={`${styles.timeButton} ${hoursAhead === 24 ? styles.active : ''}`}
              onClick={() => setHoursAhead(24)}
            >
              24 Hours
            </button>
            <button
              className={`${styles.timeButton} ${hoursAhead === 48 ? styles.active : ''}`}
              onClick={() => setHoursAhead(48)}
            >
              48 Hours
            </button>
            <button
              className={`${styles.timeButton} ${hoursAhead === 72 ? styles.active : ''}`}
              onClick={() => setHoursAhead(72)}
            >
              72 Hours
            </button>
          </div>
          
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'chart' ? styles.active : ''}`}
              onClick={() => setViewMode('chart')}
            >
              Chart View
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
          </div>
        </div>
      </header>

      {currentReading && (
        <div className={styles.currentOverview}>
          <div className={styles.currentWeather}>
            <div className={styles.currentTemp}>
              <h2>{currentReading.temperature.toFixed(1)}°C</h2>
              <p>Feels like {currentReading.feels_like.toFixed(1)}°C</p>
            </div>
            <div className={styles.currentCondition}>
              <span className={styles.weatherIconLarge}>
                {getWeatherIcon(currentReading.weather_main)}
              </span>
              <span className={styles.weatherText}>
                {currentReading.weather_main}
              </span>
            </div>
          </div>
          
          <div className={styles.currentDetails}>
            <div className={styles.detailCard}>
              <Droplets size={20} />
              <div>
                <span className={styles.detailLabel}>Humidity</span>
                <span className={styles.detailValue}>{currentReading.humidity}%</span>
              </div>
            </div>
            
            <div className={styles.detailCard}>
              <Wind size={20} />
              <div>
                <span className={styles.detailLabel}>Wind Speed</span>
                <span className={styles.detailValue}>{currentReading.wind_speed.toFixed(1)} m/s</span>
              </div>
            </div>
            
            <div className={styles.detailCard}>
              <Gauge size={20} />
              <div>
                <span className={styles.detailLabel}>Pressure</span>
                <span className={styles.detailValue}>{currentReading.pressure} hPa</span>
              </div>
            </div>
            
            <div className={styles.detailCard}>
              <Cloud size={20} />
              <div>
                <span className={styles.detailLabel}>Cloudiness</span>
                <span className={styles.detailValue}>{currentReading.cloudiness}%</span>
              </div>
            </div>
            
            {currentReading.pop > 0 && (
              <div className={styles.detailCard}>
                <CloudRain size={20} />
                <div>
                  <span className={styles.detailLabel}>Precipitation</span>
                  <span className={styles.detailValue}>{currentReading.pop.toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.metricsSelector}>
        <div className={styles.metricButtons}>
          {['temperature', 'humidity', 'wind_speed', 'pressure', 'cloudiness', 'pop'].map(metric => {
            const details = getMetricDetails(metric);
            return (
              <button
                key={metric}
                className={`${styles.metricButton} ${selectedMetric === metric ? styles.active : ''}`}
                onClick={() => setSelectedMetric(metric)}
                style={{
                  borderColor: details.color,
                  backgroundColor: selectedMetric === metric ? `${details.color}15` : 'white',
                }}
              >
                <div className={styles.metricIcon} style={{ color: details.color }}>
                  {details.icon}
                </div>
                <span className={styles.metricName}>{details.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className={styles.mainContent}>
        {viewMode === 'chart' ? (
          <div className={styles.chartSection}>
            <div className={styles.chartHeader}>
              <h3>
                {metricDetails.icon}
                {metricDetails.label} Forecast
                <span className={styles.chartSubtitle}>{metricDetails.description}</span>
              </h3>
            </div>
            {renderChart()}
          </div>
        ) : (
          <div className={styles.gridSection}>
            <div className={styles.gridHeader}>
              <h3>
                <Calendar size={24} />
                Hour-by-Hour Forecast
              </h3>
              <div className={styles.currentIndicator}>
                <div className={styles.currentDot} />
                <span>Current hour</span>
              </div>
            </div>
            {renderHourlyGrid()}
          </div>
        )}
      </main>

      <div className={styles.insights}>
        <h3>
          <Zap size={24} />
          Hourly Insights
        </h3>
        <div className={styles.insightsGrid}>
          {prepareChartData().filter((_, i) => i % 6 === 0).slice(0, 4).map((hour, index) => (
            <div key={index} className={styles.insightCard}>
              <div className={styles.insightTime}>
                <span className={styles.insightHour}>{hour.time}</span>
                <span className={styles.insightDate}>{hour.date}</span>
              </div>
              <div className={styles.insightWeather}>
                <span className={styles.insightIcon}>
                  {getWeatherIcon(hour.weather_main)}
                </span>
                <div className={styles.insightTemp}>
                  <span className={styles.tempValue}>{hour.temperature.toFixed(1)}°</span>
                  <span className={styles.tempFeels}>Feels {hour.feels_like.toFixed(1)}°</span>
                </div>
              </div>
              <div className={styles.insightDetails}>
                <div className={styles.insightDetail}>
                  <span>Humidity:</span>
                  <strong>{hour.humidity}%</strong>
                </div>
                <div className={styles.insightDetail}>
                  <span>Wind:</span>
                  <strong>{hour.wind_speed.toFixed(1)} m/s</strong>
                </div>
                {hour.pop > 0 && (
                  <div className={styles.insightDetail}>
                    <span>Precip:</span>
                    <strong className={styles.precipitation}>{hour.pop.toFixed(0)}%</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          Hourly forecast updated every hour. Next update: {
            new Date(Date.now() + 3600000).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        </p>
        <small>
          Showing {hoursAhead} hours ahead • Current time: {
            new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        </small>
      </footer>
    </div>
  );
}