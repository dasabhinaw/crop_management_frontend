// components/nepali-season/MonthlySummary.js
'use client';

import React, { useState } from 'react';
import styles from '@/styles/nepali-season/monthly-summary.module.css';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Cloud,
  AlertTriangle,
  Calendar,
  Leaf,
  Droplet,
  ThermometerSun,
  CloudSnow,
  WindIcon,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';

export default function MonthlySummary({ month }) {
  const [activeTab, setActiveTab] = useState('weather');

  if (!month) {
    return (
      <div className={styles.emptyState}>
        <Calendar size={48} />
        <h3>Select a Month</h3>
        <p>Click on any month in the calendar to view detailed information</p>
      </div>
    );
  }

  const getSeasonColor = (seasonType) => {
    const colors = {
      'summer': '#ff6b6b',
      'monsoon': '#0984e3',
      'autumn': '#ff9800',
      'winter': '#4d96ff',
      'spring': '#4caf50',
    };
    return colors[seasonType] || '#6c757d';
  };

  const getWeatherDataQuality = () => {
    if (!month.weather_data_source || month.weather_data_source === 'none') {
      return {
        label: 'No Weather Data',
        color: '#f44336',
        icon: <AlertTriangle size={20} />,
        description: 'No weather data available for this month'
      };
    }
    
    const confidence = month.data_confidence || 0;
    if (confidence >= 80) {
      return {
        label: 'High Confidence',
        color: '#4caf50',
        icon: <Cloud size={20} />,
        description: 'Weather data is highly reliable'
      };
    }
    if (confidence >= 50) {
      return {
        label: 'Medium Confidence',
        color: '#ff9800',
        icon: <Cloud size={20} />,
        description: 'Weather data is moderately reliable'
      };
    }
    return {
      label: 'Low Confidence',
      color: '#f44336',
      icon: <Cloud size={20} />,
      description: 'Weather data reliability is low'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const weatherQuality = getWeatherDataQuality();

  return (
    <div className={styles.summaryContainer}>
      {/* Header */}
      <div 
        className={styles.header}
        style={{ borderLeftColor: getSeasonColor(month.season_type) }}
      >
        <div className={styles.headerMain}>
          <h2>{month.nepali_name} ({month.english_name})</h2>
          <div className={styles.seasonBadge} style={{ backgroundColor: getSeasonColor(month.season_type) }}>
            {month.season_type.charAt(0).toUpperCase() + month.season_type.slice(1)}
          </div>
        </div>
        
        <div className={styles.dateRange}>
          <Calendar size={16} />
          <span>{formatDate(month.start_date_english)} - {formatDate(month.end_date_english)}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        {['weather', 'agriculture', 'festivals', 'details'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'weather' && <Thermometer size={18} />}
            {tab === 'agriculture' && <Leaf size={18} />}
            {tab === 'festivals' && <Calendar size={18} />}
            {tab === 'details' && <BarChart3 size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === 'weather' && (
          <div className={styles.weatherContent}>
            {/* Data Quality Banner */}
            <div 
              className={styles.qualityBanner}
              style={{ backgroundColor: `${weatherQuality.color}20`, borderColor: weatherQuality.color }}
            >
              <div className={styles.qualityHeader}>
                {weatherQuality.icon}
                <h3>Weather Data Quality: {weatherQuality.label}</h3>
              </div>
              <p className={styles.qualityDescription}>
                {weatherQuality.description}
              </p>
              <div className={styles.dataSource}>
                <span className={styles.sourceLabel}>Data Source:</span>
                <span className={styles.sourceValue}>
                  {month.weather_data_source === 'none' ? 'No Data' : 
                   month.weather_data_source === 'auto_daily' ? 'Daily Weather API' :
                   month.weather_data_source === 'auto_hourly' ? 'Hourly Weather Data' :
                   month.weather_data_source === 'auto_current' ? 'Current Weather' :
                   month.weather_data_source === 'ml_prediction' ? 'ML Prediction' :
                   month.weather_data_source === 'manual' ? 'Manual Entry' : 'Unknown'}
                </span>
              </div>
              <div className={styles.confidenceScore}>
                <span className={styles.confidenceLabel}>Confidence Score:</span>
                <div className={styles.confidenceBar}>
                  <div 
                    className={styles.confidenceFill}
                    style={{ 
                      width: `${month.data_confidence || 0}%`,
                      backgroundColor: weatherQuality.color
                    }}
                  ></div>
                </div>
                <span className={styles.confidenceValue}>{month.data_confidence || 0}%</span>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className={styles.weatherMetrics}>
              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <ThermometerSun size={24} />
                  <h4>Temperature</h4>
                </div>
                <div className={styles.metricValues}>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Average:</span>
                    <span className={styles.valueNumber}>
                      {month.avg_temperature ? `${month.avg_temperature}°C` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Min:</span>
                    <span className={styles.valueNumber}>
                      {month.avg_temp_min ? `${month.avg_temp_min}°C` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Max:</span>
                    <span className={styles.valueNumber}>
                      {month.avg_temp_max ? `${month.avg_temp_max}°C` : '--'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <Droplets size={24} />
                  <h4>Precipitation & Humidity</h4>
                </div>
                <div className={styles.metricValues}>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Total Rainfall:</span>
                    <span className={styles.valueNumber}>
                      {month.total_rainfall ? `${month.total_rainfall} mm` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Avg Humidity:</span>
                    <span className={styles.valueNumber}>
                      {month.avg_humidity ? `${month.avg_humidity}%` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Rain Days:</span>
                    <span className={styles.valueNumber}>
                      {month.weather_data_source !== 'none' ? 'Calculated from data' : '--'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <WindIcon size={24} />
                  <h4>Wind & Sun</h4>
                </div>
                <div className={styles.metricValues}>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Wind Speed:</span>
                    <span className={styles.valueNumber}>
                      {month.avg_wind_speed ? `${month.avg_wind_speed} m/s` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Sunshine Hours:</span>
                    <span className={styles.valueNumber}>
                      {month.sunshine_hours ? `${month.sunshine_hours} hrs/day` : '--'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Cloud Cover:</span>
                    <span className={styles.valueNumber}>
                      {month.weather_data_source !== 'none' ? 'Available in detailed view' : '--'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <CloudSnow size={24} />
                  <h4>Additional Data</h4>
                </div>
                <div className={styles.metricValues}>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Last Updated:</span>
                    <span className={styles.valueNumber}>
                      {month.last_weather_update 
                        ? new Date(month.last_weather_update).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Data Points:</span>
                    <span className={styles.valueNumber}>
                      {month.weather_integration?.[0]?.data_points_count || 'N/A'}
                    </span>
                  </div>
                  <div className={styles.metricValue}>
                    <span className={styles.valueLabel}>Coverage:</span>
                    <span className={styles.valueNumber}>
                      {month.weather_integration?.[0]?.data_coverage_percentage 
                        ? `${month.weather_integration[0].data_coverage_percentage}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            {month.avg_temp_max > 35 && (
              <div className={styles.weatherAlert}>
                <AlertTriangle size={20} />
                <div>
                  <h4>Heat Alert</h4>
                  <p>High temperatures expected. Ensure proper irrigation for crops.</p>
                </div>
              </div>
            )}
            
            {month.total_rainfall > 300 && (
              <div className={styles.weatherAlert} style={{ backgroundColor: '#e3f2fd', borderColor: '#2196f3' }}>
                <CloudRain size={20} />
                <div>
                  <h4>Heavy Rainfall Alert</h4>
                  <p>High precipitation expected. Ensure proper drainage systems.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agriculture' && (
          <div className={styles.agricultureContent}>
            <div className={styles.agSection}>
              <h3>
                <Leaf size={20} />
                Suitable Crops
              </h3>
              <div className={styles.cropsList}>
                {month.suitable_crops && month.suitable_crops.length > 0 ? (
                  month.suitable_crops.map((crop, index) => (
                    <div key={index} className={styles.cropItem}>
                      <div className={styles.cropIcon}>🌱</div>
                      <span className={styles.cropName}>{crop}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>No crop data available</p>
                )}
              </div>
            </div>

            <div className={styles.agSection}>
              <h3>
                <Calendar size={20} />
                Agricultural Activities
              </h3>
              <div className={styles.activities}>
                {month.agricultural_activities ? (
                  <p>{month.agricultural_activities}</p>
                ) : (
                  <p className={styles.noData}>No activity data available</p>
                )}
              </div>
            </div>

            <div className={styles.agSection}>
              <h3>
                <Droplet size={20} />
                Water Requirements
              </h3>
              <div className={styles.waterInfo}>
                <div className={styles.waterMetric}>
                  <span className={styles.waterLabel}>Estimated Need:</span>
                  <span className={styles.waterValue}>
                    {month.total_rainfall 
                      ? `${Math.max(0, 100 - month.total_rainfall)} mm irrigation needed`
                      : 'Calculate based on rainfall'
                    }
                  </span>
                </div>
                <div className={styles.waterMetric}>
                  <span className={styles.waterLabel}>Irrigation Frequency:</span>
                  <span className={styles.waterValue}>
                    {month.avg_temperature > 25 ? 'Every 2-3 days' :
                     month.avg_temperature > 15 ? 'Every 4-5 days' :
                     'Weekly'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'festivals' && (
          <div className={styles.festivalsContent}>
            <h3>
              <Calendar size={20} />
              Festivals & Events
            </h3>
            <div className={styles.festivalsList}>
              {month.festivals && month.festivals.length > 0 ? (
                month.festivals.map((festival, index) => (
                  <div key={index} className={styles.festivalItem}>
                    <div className={styles.festivalIcon}>🎉</div>
                    <div className={styles.festivalContent}>
                      <h4>{festival}</h4>
                      <p className={styles.festivalDescription}>
                        {festival.includes('Jatra') ? 'Traditional chariot festival' :
                         festival.includes('Purnima') ? 'Full moon festival' :
                         festival.includes('Sankranti') ? 'Solar transition festival' :
                         'Cultural celebration'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noFestivals}>
                  <Calendar size={48} />
                  <p>No festivals recorded for this month</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className={styles.detailsContent}>
            <div className={styles.detailSection}>
              <h3>Month Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nepali Name:</span>
                  <span className={styles.detailValue}>{month.nepali_name}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>English Name:</span>
                  <span className={styles.detailValue}>{month.english_name}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Month Number:</span>
                  <span className={styles.detailValue}>{month.month_number}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Season Type:</span>
                  <span className={styles.detailValue}>
                    {month.season_type.charAt(0).toUpperCase() + month.season_type.slice(1)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created By:</span>
                  <span className={styles.detailValue}>
                    {month.created_by?.username || 'System'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Updated:</span>
                  <span className={styles.detailValue}>
                    {new Date(month.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Special Notes</h3>
              <div className={styles.notesContent}>
                {month.special_notes ? (
                  <p>{month.special_notes}</p>
                ) : (
                  <p className={styles.noNotes}>No special notes available</p>
                )}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3>Weather Integration</h3>
              {month.weather_integration && month.weather_integration.length > 0 ? (
                month.weather_integration.map((integration, index) => (
                  <div key={index} className={styles.integrationDetails}>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLabel}>Integration Method:</span>
                      <span className={styles.integrationValue}>
                        {integration.integration_method.replace('_', ' ')}
                      </span>
                    </div>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLabel}>Last Integration:</span>
                      <span className={styles.integrationValue}>
                        {new Date(integration.last_integration_date).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLabel}>Data Points:</span>
                      <span className={styles.integrationValue}>
                        {integration.data_points_count}
                      </span>
                    </div>
                    <div className={styles.integrationItem}>
                      <span className={styles.integrationLabel}>Coverage:</span>
                      <span className={styles.integrationValue}>
                        {integration.data_coverage_percentage}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noIntegration}>No weather integration data</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.primaryButton}>
          <RefreshCw size={18} />
          Update Weather Data
        </button>
        <button className={styles.secondaryButton}>
          <Download size={18} />
          Export Month Data
        </button>
      </div>
    </div>
  );
}