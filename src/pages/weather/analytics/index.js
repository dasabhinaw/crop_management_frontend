// app/weather/analytics/page.js
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
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  fetchWeatherCorrelations,
  fetchWeatherTrends,
  fetchPredictionAccuracy,
  fetchWeatherStats,
} from '@/features/weatherAnalyticsSlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import styles from '@/styles/analytics.module.css';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Cloud,
  Zap,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  Brain,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { 
    correlations, 
    trends, 
    accuracy, 
    stats,
    loading, 
    error 
  } = useSelector((state) => state.weatherAnalytics);
  
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedView, setSelectedView] = useState('overview');
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    dispatch(fetchWeatherCorrelations());
    dispatch(fetchWeatherTrends({ period: timeRange }));
    dispatch(fetchPredictionAccuracy({ period: timeRange }));
    dispatch(fetchWeatherStats({ period: timeRange }));
  }, [dispatch, timeRange]);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const prepareCorrelationData = () => {
    if (!correlations?.strongest_correlations) return [];
    
    return correlations.strongest_correlations.map(corr => ({
      name: `${corr.variable_1} vs ${corr.variable_2}`,
      value: Math.abs(corr.correlation) * 100,
      correlation: corr.correlation,
      direction: corr.direction,
      strength: corr.strength,
    }));
  };

  const prepareTrendData = () => {
    if (!trends?.monthly_trends) return [];
    
    return trends.monthly_trends.map(month => ({
      month: month.month,
      temperature: month.avg_temp,
      humidity: month.avg_humidity,
      pressure: month.avg_pressure,
      windSpeed: month.avg_wind_speed,
      season: month.season,
    }));
  };

  const prepareAccuracyData = () => {
    if (!accuracy?.accuracy_data) return [];
    
    return accuracy.accuracy_data.map(item => ({
      date: item.date,
      predicted: item.predicted_temp,
      actual: item.actual_temp,
      error: item.error,
      accuracy: item.accuracy_score,
      weatherCorrect: item.weather_correct ? 1 : 0,
    }));
  };

  const getMetricColor = (metric) => {
    const colors = {
      temperature: '#ff6b6b',
      humidity: '#4d96ff',
      pressure: '#6c5ce7',
      wind_speed: '#00b894',
      cloudiness: '#fd79a8',
      pop: '#0984e3',
    };
    return colors[metric] || '#333';
  };

  const exportAnalytics = () => {
    const analyticsData = {
      correlations,
      trends,
      accuracy,
      stats,
      generatedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `weather_analytics_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
    <div className={styles.analyticsContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            <BarChart3 size={32} />
            Weather Analytics
          </h1>
          <p>Advanced insights and predictive analytics for weather patterns</p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.timeRangeSelector}>
            <Calendar size={18} />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.timeSelect}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last year</option>
            </select>
          </div>
          
          <button className={styles.exportButton} onClick={exportAnalytics}>
            <Download size={18} />
            Export Data
          </button>
          
          <button 
            className={styles.refreshButton}
            onClick={() => {
              dispatch(fetchWeatherCorrelations());
              dispatch(fetchWeatherTrends({ period: timeRange }));
              dispatch(fetchPredictionAccuracy({ period: timeRange }));
              dispatch(fetchWeatherStats({ period: timeRange }));
            }}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </header>

      <nav className={styles.navigation}>
        {['overview', 'correlations', 'trends', 'accuracy', 'predictions'].map((view) => (
          <button
            key={view}
            className={`${styles.navButton} ${selectedView === view ? styles.active : ''}`}
            onClick={() => setSelectedView(view)}
          >
            {view === 'overview' && <BarChart3 size={18} />}
            {view === 'correlations' && <PieChartIcon size={18} />}
            {view === 'trends' && <TrendingUp size={18} />}
            {view === 'accuracy' && <Target size={18} />}
            {view === 'predictions' && <Brain size={18} />}
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>

      {selectedView === 'overview' && (
        <div className={styles.overviewGrid}>
          {/* Key Metrics Cards */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard} style={{ borderLeftColor: '#ff6b6b' }}>
              <div className={styles.metricIcon}>
                <Thermometer size={24} />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Temperature Trend</div>
                <div className={styles.metricValue}>
                  {trends?.temperature_trend === 'increasing' ? '↗ Increasing' : 
                   trends?.temperature_trend === 'decreasing' ? '↘ Decreasing' : '→ Stable'}
                </div>
                <div className={styles.metricSub}>
                  {stats?.temperature?.avg ? `${stats.temperature.avg}°C avg` : 'No data'}
                </div>
              </div>
            </div>

            <div className={styles.metricCard} style={{ borderLeftColor: '#4d96ff' }}>
              <div className={styles.metricIcon}>
                <Droplets size={24} />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Humidity Analysis</div>
                <div className={styles.metricValue}>
                  {stats?.humidity?.avg ? `${stats.humidity.avg}%` : '--'}
                </div>
                <div className={styles.metricSub}>
                  Range: {stats?.humidity?.min || '--'}% - {stats?.humidity?.max || '--'}%
                </div>
              </div>
            </div>

            <div className={styles.metricCard} style={{ borderLeftColor: '#00b894' }}>
              <div className={styles.metricIcon}>
                <Wind size={24} />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Wind Patterns</div>
                <div className={styles.metricValue}>
                  {stats?.wind?.avg ? `${stats.wind.avg} m/s` : '--'}
                </div>
                <div className={styles.metricSub}>
                  Max: {stats?.wind?.max ? `${stats.wind.max} m/s` : '--'}
                </div>
              </div>
            </div>

            <div className={styles.metricCard} style={{ borderLeftColor: '#6c5ce7' }}>
              <div className={styles.metricIcon}>
                <Target size={24} />
              </div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Prediction Accuracy</div>
                <div className={styles.metricValue}>
                  {accuracy?.statistics?.average_accuracy ? `${accuracy.statistics.average_accuracy}%` : '--'}
                </div>
                <div className={styles.metricSub}>
                  {accuracy?.statistics?.total_predictions || 0} predictions analyzed
                </div>
              </div>
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className={styles.sectionCard}>
            <h3>
              <PieChartIcon size={20} />
              Strongest Correlations
            </h3>
            <div className={styles.correlationMatrix}>
              {correlations?.strongest_correlations?.slice(0, 5).map((corr, index) => (
                <div key={index} className={styles.correlationItem}>
                  <div className={styles.correlationVariables}>
                    <span className={styles.variable}>{corr.variable_1}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.variable}>{corr.variable_2}</span>
                  </div>
                  <div className={styles.correlationValue}>
                    <div 
                      className={styles.correlationBar}
                      style={{
                        width: `${Math.abs(corr.correlation) * 100}%`,
                        backgroundColor: corr.correlation > 0 ? '#4caf50' : '#f44336'
                      }}
                    />
                    <span className={styles.correlationNumber}>
                      {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.correlationStrength}>
                    <span className={`${styles.strengthBadge} ${styles[corr.strength]}`}>
                      {corr.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Analysis */}
          <div className={styles.sectionCard}>
            <h3>
              <Calendar size={20} />
              Seasonal Patterns
            </h3>
            <div className={styles.seasonalGrid}>
              {trends?.seasonal_patterns && Object.entries(trends.seasonal_patterns).map(([season, data]) => (
                <div key={season} className={styles.seasonCard}>
                  <div className={styles.seasonHeader}>
                    <h4>{season}</h4>
                    <span className={styles.seasonIcon}>
                      {season === 'Winter' ? '❄️' : 
                       season === 'Spring' ? '🌱' : 
                       season === 'Summer' ? '☀️' : '🍂'}
                    </span>
                  </div>
                  <div className={styles.seasonMetrics}>
                    <div className={styles.seasonMetric}>
                      <Thermometer size={16} />
                      <span>{data.avg_temp || '--'}°C</span>
                    </div>
                    <div className={styles.seasonMetric}>
                      <Droplets size={16} />
                      <span>{data.avg_humidity || '--'}%</span>
                    </div>
                    <div className={styles.seasonMetric}>
                      <Gauge size={16} />
                      <span>{data.avg_pressure || '--'} hPa</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Trend */}
          <div className={styles.sectionCard}>
            <h3>
              <Target size={20} />
              Prediction Accuracy Trend
            </h3>
            <div className={styles.chartContainer}>
              {accuracy?.accuracy_data && accuracy.accuracy_data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareAccuracyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#4caf50" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="error" 
                      stroke="#f44336" 
                      strokeWidth={2}
                      name="Error"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className={styles.noData}>
                  <Target size={48} />
                  <p>No accuracy data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'correlations' && (
        <div className={styles.correlationsView}>
          <div className={styles.sectionCard}>
            <h3>
              <PieChartIcon size={24} />
              Correlation Matrix
            </h3>
            <p className={styles.sectionDescription}>
              Relationships between different weather metrics. Positive values indicate direct relationships, 
              negative values indicate inverse relationships.
            </p>
            
            {correlations?.correlation_matrix && (
              <div className={styles.correlationHeatmap}>
                <div className={styles.heatmapGrid}>
                  <div className={styles.heatmapHeader}></div>
                  {Object.keys(correlations.correlation_matrix).map(key => (
                    <div key={key} className={styles.heatmapHeader}>
                      {key.replace('_', ' ')}
                    </div>
                  ))}
                  
                  {Object.entries(correlations.correlation_matrix).map(([rowKey, row], rowIndex) => (
                    <React.Fragment key={rowKey}>
                      <div className={styles.heatmapRowHeader}>
                        {rowKey.replace('_', ' ')}
                      </div>
                      {Object.entries(row).map(([colKey, value], colIndex) => (
                        <div
                          key={`${rowKey}-${colKey}`}
                          className={styles.heatmapCell}
                          style={{
                            backgroundColor: `rgba(${value > 0 ? '76, 175, 80' : '244, 67, 54'}, ${Math.abs(value)})`,
                            color: Math.abs(value) > 0.5 ? 'white' : '#333'
                          }}
                          title={`${rowKey} vs ${colKey}: ${value}`}
                        >
                          {value.toFixed(2)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.insightsSection}>
            <h3>
              <Brain size={24} />
              Insights from Correlations
            </h3>
            <div className={styles.insightsGrid}>
              {correlations?.insights?.map((insight, index) => (
                <div key={index} className={styles.insightCard}>
                  <div className={styles.insightIcon}>
                    <AlertTriangle size={20} />
                  </div>
                  <p className={styles.insightText}>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'trends' && (
        <div className={styles.trendsView}>
          <div className={styles.trendsGrid}>
            <div className={styles.sectionCard}>
              <h3>
                <TrendingUp size={24} />
                Temperature Trends
              </h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={prepareTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff6b6b"
                      fill="#ff6b6b"
                      fillOpacity={0.3}
                      name="Temperature (°C)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h3>
                <Wind size={24} />
                Multi-Metric Trends
              </h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={prepareTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#4d96ff"
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#00b894"
                      strokeWidth={2}
                      name="Wind Speed (m/s)"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="pressure"
                      stroke="#6c5ce7"
                      strokeWidth={2}
                      name="Pressure (hPa)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={styles.seasonalAnalysis}>
            <h3>Seasonal Breakdown</h3>
            <div className={styles.seasonalCharts}>
              {trends?.monthly_trends && (
                <div className={styles.radarChart}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={prepareTrendData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="month" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Temperature"
                        dataKey="temperature"
                        stroke="#ff6b6b"
                        fill="#ff6b6b"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Humidity"
                        dataKey="humidity"
                        stroke="#4d96ff"
                        fill="#4d96ff"
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'accuracy' && (
        <div className={styles.accuracyView}>
          <div className={styles.accuracyStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#4caf5020', color: '#4caf50' }}>
                <Target size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Average Accuracy</div>
                <div className={styles.statValue}>
                  {accuracy?.statistics?.average_accuracy ? `${accuracy.statistics.average_accuracy}%` : '--'}
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#ff980020', color: '#ff9800' }}>
                <Thermometer size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Avg Temperature Error</div>
                <div className={styles.statValue}>
                  {accuracy?.statistics?.average_temperature_error ? `${accuracy.statistics.average_temperature_error}°C` : '--'}
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#2196f320', color: '#2196f3' }}>
                <Cloud size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Weather Condition Accuracy</div>
                <div className={styles.statValue}>
                  {accuracy?.statistics?.weather_condition_accuracy ? `${accuracy.statistics.weather_condition_accuracy}%` : '--'}
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: '#9c27b020', color: '#9c27b0' }}>
                <BarChart3 size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Predictions Analyzed</div>
                <div className={styles.statValue}>
                  {accuracy?.statistics?.total_predictions || 0}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.accuracyDetails}>
            <div className={styles.sectionCard}>
              <h3>Prediction vs Actual Comparison</h3>
              <div className={styles.chartContainer}>
                {accuracy?.accuracy_data && accuracy.accuracy_data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={prepareAccuracyData().slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="predicted" fill="#8884d8" name="Predicted" />
                      <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.noData}>
                    <Target size={48} />
                    <p>No accuracy data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h3>Error Distribution</h3>
              <div className={styles.errorAnalysis}>
                {accuracy?.accuracy_data && accuracy.accuracy_data.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="predicted" name="Predicted" />
                      <YAxis type="number" dataKey="actual" name="Actual" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Predictions" data={prepareAccuracyData()} fill="#8884d8" />
                      <Line type="monotone" dataKey="x" stroke="#ff7300" dot={false} />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.noData}>
                    <AlertTriangle size={48} />
                    <p>No error data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'predictions' && (
        <div className={styles.predictionsView}>
          <div className={styles.predictionInsights}>
            <h2>
              <Brain size={28} />
              Predictive Insights
            </h2>
            <p className={styles.insightsDescription}>
              Advanced machine learning models analyze historical patterns to provide accurate weather predictions.
            </p>
            
            <div className={styles.insightCards}>
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>
                  <Zap size={24} />
                </div>
                <h4>Model Performance</h4>
                <p>
                  Current ML models achieve {accuracy?.statistics?.average_accuracy || '--'}% accuracy 
                  for temperature predictions and {accuracy?.statistics?.weather_condition_accuracy || '--'}% 
                  for weather condition classification.
                </p>
              </div>

              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>
                  <TrendingUp size={24} />
                </div>
                <h4>Trend Accuracy</h4>
                <p>
                  Models are {trends?.temperature_trend === 'stable' ? 'most accurate' : 'continuously learning'} 
                  for {trends?.temperature_trend || 'current'} temperature trends. 
                  Seasonal patterns are incorporated into predictions.
                </p>
              </div>

              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>
                  <AlertTriangle size={24} />
                </div>
                <h4>Confidence Intervals</h4>
                <p>
                  Prediction confidence varies by metric. Temperature predictions typically have 
                  ±{accuracy?.statistics?.average_temperature_error || '--'}°C error margin, 
                  while weather condition predictions are more certain during stable patterns.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.modelRecommendations}>
            <h3>Model Improvement Recommendations</h3>
            <div className={styles.recommendationsList}>
              <div className={styles.recommendation}>
                <ChevronRight size={16} />
                <span>Increase training data diversity for improved accuracy</span>
              </div>
              <div className={styles.recommendation}>
                <ChevronRight size={16} />
                <span>Consider ensemble methods for extreme weather predictions</span>
              </div>
              <div className={styles.recommendation}>
                <ChevronRight size={16} />
                <span>Implement real-time model retraining based on new data</span>
              </div>
              <div className={styles.recommendation}>
                <ChevronRight size={16} />
                <span>Add more features like historical pressure patterns</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>
          Analytics generated using {accuracy?.statistics?.total_predictions || 0} prediction records 
          and {stats?.record_count || 0} historical data points.
        </p>
        <small>Last updated: {lastUpdated}</small>
      </footer>
    </div>
  );
}