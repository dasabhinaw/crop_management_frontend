// app/weather/history/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
} from 'recharts';
import {
  fetchHistoricalData,
  fetchWeatherStats,
  fetchPredictionAccuracy,
} from '@/features/weatherHistorySlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import styles from '@/styles/history.module.css';
import {
  Calendar,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  BarChart3,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { 
    historicalData, 
    stats, 
    accuracyData, 
    loading, 
    error 
  } = useSelector((state) => state.weatherHistory);
  
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedMetrics, setSelectedMetrics] = useState([
    'temperature', 'humidity', 'pressure', 'wind_speed'
  ]);
  const [chartType, setChartType] = useState('line');
  const [timeGranularity, setTimeGranularity] = useState('daily');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
  dispatch(fetchHistoricalData({
    start_date: dateRange.start,  // Use start_date instead of startDate
    end_date: dateRange.end,      // Use end_date instead of endDate
    granularity: timeGranularity
  }));
  dispatch(fetchWeatherStats({
    start_date: dateRange.start,  // Use start_date
    end_date: dateRange.end       // Use end_date
  }));
  dispatch(fetchPredictionAccuracy({
    start_date: dateRange.start,  // Use start_date
    end_date: dateRange.end       // Use end_date
  }));
}, [dispatch, dateRange, timeGranularity]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const prepareChartData = () => {
    if (!Array.isArray(historicalData)) return [];
    
    return historicalData.map(item => ({
      date: new Date(item.weather_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      fullDate: item.weather_date,
      temperature: Number(item.temperature.avg),
      temp_min: Number(item.temperature.min),
      temp_max: Number(item.temperature.max),
      humidity: item.humidity,
      pressure: item.pressure,
      wind_speed: Number(item.wind_speed),
      cloudiness: item.cloudiness,
      pop: item.pop * 100,
    }));
  };

  const prepareAccuracyData = () => {
    if (!accuracyData) return [];
    
    return accuracyData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      predicted: Number(item.predicted_temp),
      actual: Number(item.actual_temp),
      error: Math.abs(Number(item.predicted_temp) - Number(item.actual_temp)),
      accuracy: item.accuracy_score,
    }));
  };

  const getMetricConfig = (metric) => {
    const configs = {
      temperature: {
        color: '#ff6b6b',
        name: 'Temperature (°C)',
        icon: <Thermometer size={16} />,
        unit: '°C',
      },
      humidity: {
        color: '#4d96ff',
        name: 'Humidity (%)',
        icon: <Droplets size={16} />,
        unit: '%',
      },
      pressure: {
        color: '#6c5ce7',
        name: 'Pressure (hPa)',
        icon: <Gauge size={16} />,
        unit: 'hPa',
      },
      wind_speed: {
        color: '#00b894',
        name: 'Wind Speed (m/s)',
        icon: <Wind size={16} />,
        unit: 'm/s',
      },
      cloudiness: {
        color: '#fd79a8',
        name: 'Cloudiness (%)',
        icon: <Cloud size={16} />,
        unit: '%',
      },
      pop: {
        color: '#0984e3',
        name: 'Precipitation (%)',
        icon: '💧',
        unit: '%',
      },
    };
    return configs[metric] || { color: '#333', name: metric };
  };

  const renderChart = () => {
    const data = prepareChartData();
    const metricConfigs = selectedMetrics.map(getMetricConfig);

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              {metricConfigs.map((config, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={selectedMetrics[index]}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  name={config.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metricConfigs.map((config, index) => (
                <Bar
                  key={index}
                  dataKey={selectedMetrics[index]}
                  fill={config.color}
                  name={config.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metricConfigs.map((config, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={selectedMetrics[index]}
                  stroke={config.color}
                  fill={config.color}
                  fillOpacity={0.3}
                  name={config.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const exportData = () => {
    const data = prepareChartData();
    const csv = [
      ['Date', ...selectedMetrics.map(m => getMetricConfig(m).name)],
      ...data.map(row => [
        row.fullDate,
        ...selectedMetrics.map(metric => row[metric])
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_history_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <div className={styles.historyContainer}>
      <header className={styles.header}>
        <div>
          <h1>Historical Weather Analysis</h1>
          <p>Analyze weather patterns and trends over time</p>
        </div>
        <button 
          className={styles.exportButton}
          onClick={exportData}
        >
          <Download size={18} />
          Export Data
        </button>
      </header>

      <div className={styles.controls}>
        <button 
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
        </button>

        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.dateRange}>
              <div className={styles.inputGroup}>
                <label>
                  <Calendar size={16} />
                  Start Date
                </label>
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  max={dateRange.end}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>
                  <Calendar size={16} />
                  End Date
                </label>
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  min={dateRange.start}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className={styles.granularity}>
              <label>Time Granularity:</label>
              <div className={styles.granularityButtons}>
                {['daily', 'weekly', 'monthly'].map((gran) => (
                  <button
                    key={gran}
                    className={`${styles.granButton} ${
                      timeGranularity === gran ? styles.active : ''
                    }`}
                    onClick={() => setTimeGranularity(gran)}
                  >
                    {gran.charAt(0).toUpperCase() + gran.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.chartType}>
              <label>Chart Type:</label>
              <div className={styles.chartButtons}>
                {['line', 'bar', 'area'].map((type) => (
                  <button
                    key={type}
                    className={`${styles.chartButton} ${
                      chartType === type ? styles.active : ''
                    }`}
                    onClick={() => setChartType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.metricsSelector}>
        <h3>Select Metrics to Display:</h3>
        <div className={styles.metricsGrid}>
          {Object.entries({
            temperature: 'Temperature',
            humidity: 'Humidity',
            pressure: 'Pressure',
            wind_speed: 'Wind Speed',
            cloudiness: 'Cloudiness',
            pop: 'Precipitation',
          }).map(([key, label]) => {
            const config = getMetricConfig(key);
            const isSelected = selectedMetrics.includes(key);
            
            return (
              <button
                key={key}
                className={`${styles.metricButton} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() => handleMetricToggle(key)}
                style={{
                  borderLeftColor: config.color,
                  backgroundColor: isSelected ? `${config.color}15` : 'white',
                }}
              >
                <div className={styles.metricIcon}>
                  {config.icon}
                </div>
                <span className={styles.metricLabel}>{label}</span>
                {isSelected && (
                  <div className={styles.checkmark}>✓</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2>
            <BarChart3 size={24} />
            Weather Trends
            <span className={styles.dateRangeLabel}>
              {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
            </span>
          </h2>
          <button 
            className={styles.refreshButton}
            onClick={() => dispatch(fetchHistoricalData({
              startDate: dateRange.start,
              endDate: dateRange.end,
              granularity: timeGranularity
            }))}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
        
        <div className={styles.chartWrapper}>
          {renderChart()}
        </div>
      </div>

      {accuracyData && accuracyData.length > 0 && (
        <div className={styles.accuracyContainer}>
          <h2>
            <TrendingUp size={24} />
            Prediction Accuracy Analysis
          </h2>
          
          <div className={styles.accuracyGrid}>
            <div className={styles.accuracyChart}>
              <h3>Predicted vs Actual Temperatures</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={prepareAccuracyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predicted" fill="#8884d8" name="Predicted" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                  <Line 
                    type="monotone" 
                    dataKey="error" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    name="Error"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.accuracyStats}>
              <h3>Accuracy Statistics</h3>
              <div className={styles.statsGrid}>
                {prepareAccuracyData().map((item, index) => (
                  <div key={index} className={styles.accuracyCard}>
                    <div className={styles.accuracyDate}>{item.date}</div>
                    <div className={styles.accuracyValues}>
                      <div className={styles.valuePair}>
                        <span className={styles.label}>Predicted:</span>
                        <span className={styles.value}>{item.predicted}°C</span>
                      </div>
                      <div className={styles.valuePair}>
                        <span className={styles.label}>Actual:</span>
                        <span className={styles.value}>{item.actual}°C</span>
                      </div>
                      <div className={styles.valuePair}>
                        <span className={styles.label}>Error:</span>
                        <span 
                          className={`${styles.errorValue} ${
                            item.error > 3 ? styles.highError : 
                            item.error > 1 ? styles.mediumError : 
                            styles.lowError
                          }`}
                        >
                          {item.error.toFixed(1)}°C
                        </span>
                      </div>
                      <div className={styles.valuePair}>
                        <span className={styles.label}>Accuracy:</span>
                        <span className={styles.accuracyScore}>
                          {item.accuracy?.toFixed(1) || 'N/A'}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className={styles.summaryStats}>
          <h2>
            <BarChart3 size={24} />
            Summary Statistics
          </h2>
          
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#ff6b6b' }}>
                <Thermometer size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Temperature</div>
                <div className={styles.statValues}>
                  <div>
                    <span className={styles.statValue}>
                      {stats.temperature.avg?.toFixed(1)}°C
                    </span>
                    <span className={styles.statSub}>Average</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.temperature.min?.toFixed(1)}°C
                    </span>
                    <span className={styles.statSub}>Min</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.temperature.max?.toFixed(1)}°C
                    </span>
                    <span className={styles.statSub}>Max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#4d96ff' }}>
                <Droplets size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Humidity</div>
                <div className={styles.statValues}>
                  <div>
                    <span className={styles.statValue}>
                      {stats.humidity.avg?.toFixed(0)}%
                    </span>
                    <span className={styles.statSub}>Average</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.humidity.min}%
                    </span>
                    <span className={styles.statSub}>Min</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.humidity.max}%
                    </span>
                    <span className={styles.statSub}>Max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#6c5ce7' }}>
                <Gauge size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Pressure</div>
                <div className={styles.statValues}>
                  <div>
                    <span className={styles.statValue}>
                      {stats.pressure.avg?.toFixed(0)} hPa
                    </span>
                    <span className={styles.statSub}>Average</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.pressure.min} hPa
                    </span>
                    <span className={styles.statSub}>Min</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.pressure.max} hPa
                    </span>
                    <span className={styles.statSub}>Max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#00b894' }}>
                <Wind size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Wind Speed</div>
                <div className={styles.statValues}>
                  <div>
                    <span className={styles.statValue}>
                      {stats.wind.avg?.toFixed(1)} m/s
                    </span>
                    <span className={styles.statSub}>Average</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.wind.min?.toFixed(1)} m/s
                    </span>
                    <span className={styles.statSub}>Min</span>
                  </div>
                  <div>
                    <span className={styles.statValue}>
                      {stats.wind.max?.toFixed(1)} m/s
                    </span>
                    <span className={styles.statSub}>Max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.insights}>
        <h2>
          <TrendingUp size={24} />
          Key Insights
        </h2>
        
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightIcon} style={{ background: '#ff6b6b20', color: '#ff6b6b' }}>
              <Thermometer size={20} />
            </div>
            <div className={styles.insightContent}>
              <h3>Temperature Trends</h3>
              <p>
                Average temperature over selected period: {stats?.temperature.avg?.toFixed(1)}°C
              </p>
              {stats?.temperature_max && stats.temperature_min && (
                <p>
                  Temperature range: {stats.temperature.min.toFixed(1)}°C to {stats.temperature.max.toFixed(1)}°C
                </p>
              )}
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon} style={{ background: '#4d96ff20', color: '#4d96ff' }}>
              <Droplets size={20} />
            </div>
            <div className={styles.insightContent}>
              <h3>Humidity Patterns</h3>
              <p>
                Average humidity: {stats?.humidity.avg?.toFixed(0)}%
              </p>
              {stats?.humidity.avg > 70 ? (
                <p className={styles.highHumidity}>High humidity period detected</p>
              ) : stats?.humidity_avg < 40 ? (
                <p className={styles.lowHumidity}>Low humidity period detected</p>
              ) : (
                <p>Normal humidity levels</p>
              )}
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon} style={{ background: '#00b89420', color: '#00b894' }}>
              <Wind size={20} />
            </div>
            <div className={styles.insightContent}>
              <h3>Wind Analysis</h3>
              <p>
                Average wind speed: {stats?.wind.avg?.toFixed(1)} m/s
              </p>
              {stats?.wind.avg > 5 ? (
                <p className={styles.highWind}>Windy conditions detected</p>
              ) : (
                <p>Calm wind conditions</p>
              )}
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightIcon} style={{ background: '#6c5ce720', color: '#6c5ce7' }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.insightContent}>
              <h3>ML Prediction Accuracy</h3>
              <p>
                {accuracyData && accuracyData.length > 0 
                  ? `Average accuracy: ${(accuracyData.reduce((sum, item) => sum + (item.accuracy_score || 0), 0) / accuracyData.length).toFixed(1)}%`
                  : 'No accuracy data available'
                }
              </p>
              {accuracyData && accuracyData.length > 0 && (
                <p>
                  Based on {accuracyData.length} prediction comparisons
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}