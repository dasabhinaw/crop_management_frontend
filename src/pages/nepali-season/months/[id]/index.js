// app/nepali-season/months/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchNepaliSeasons,
  autoFillWeatherData,
} from '@/features/nepaliSeasonSlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import WeatherChart from '@/components/nepali-season/WeatherChart';
import AgriculturalAdvisory from '@/components/nepali-season/AgriculturalAdvisory';
import FestivalList from '@/components/nepali-season/FestivalList';
import IntegrationStatus from '@/components/nepali-season/IntegrationStatus';
import styles from '@/styles/nepali-season/month-detail.module.css';
import {
  Calendar,
  ArrowLeft,
  Edit,
  Download,
  Share2,
  RefreshCw,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  CloudRain,
  Leaf,
  TrendingUp,
  BarChart3,
  FileText,
  MapPin,
  Users,
  Clock,
  Database,
  ChevronRight,
  ChevronLeft,
  Printer,
  Copy,
  Bookmark,
  MoreVertical,
} from 'lucide-react';

export default function MonthDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { nepaliMonths, loading, error } = useSelector((state) => state.nepaliSeason);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [month, setMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    dispatch(fetchNepaliSeasons());
  }, [dispatch]);

  useEffect(() => {
    if (nepaliMonths && params.id) {
      const foundMonth = nepaliMonths.find(m => m.id.toString() === params.id);
      setMonth(foundMonth);
      setIsLoading(false);
    }
  }, [nepaliMonths, params.id]);

  const handleAutoFill = () => {
    if (month) {
      dispatch(autoFillWeatherData(month.id));
    }
  };

  const getSeasonIcon = (seasonType) => {
    switch (seasonType) {
      case 'summer': return <Sun size={20} />;
      case 'monsoon': return <CloudRain size={20} />;
      case 'autumn': return <Leaf size={20} />;
      case 'winter': return <Moon size={20} />;
      case 'spring': return <TrendingUp size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  const getWeatherQuality = (month) => {
    if (!month.weather_data_source || month.weather_data_source === 'none') {
      return { label: 'No Data', color: '#f44336', icon: <XCircle size={20} /> };
    }
    
    const confidence = month.data_confidence || 0;
    if (confidence >= 80) return { label: 'High', color: '#4caf50', icon: <CheckCircle size={20} /> };
    if (confidence >= 50) return { label: 'Medium', color: '#ff9800', icon: <CheckCircle size={20} /> };
    return { label: 'Low', color: '#f44336', icon: <AlertTriangle size={20} /> };
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

  if (isLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (error || !month) {
    return (
      <Error 
        message={error || 'Month not found'} 
        onRetry={() => router.push('/nepali-season/months')}
      />
    );
  }

  const weatherQuality = getWeatherQuality(month);
  const hasWeatherData = month.weather_data_source !== 'none';

  return (
    <div className={styles.detailContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/nepali-season/months" className={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Months
          </Link>
          
          <div className={styles.headerActions}>
            <button className={styles.iconButton}>
              <Printer size={20} />
            </button>
            <button className={styles.iconButton}>
              <Download size={20} />
            </button>
            <button className={styles.iconButton}>
              <Share2 size={20} />
            </button>
            <button className={styles.iconButton}>
              <Copy size={20} />
            </button>
            <button 
              className={styles.iconButton}
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className={styles.headerMain}>
          <div className={styles.monthIdentity}>
            <div className={styles.monthNumber}>
              {month.month_number}
            </div>
            <div className={styles.monthNames}>
              <h1 className={`${styles.nepaliName} text-nepali`}>
                {month.nepali_name}
              </h1>
              <h2 className={styles.englishName}>
                {month.english_name}
              </h2>
            </div>
          </div>
          
          <div className={styles.monthMetadata}>
            <div className={styles.seasonBadge}>
              {getSeasonIcon(month.season_type)}
              <span>{month.season_type.charAt(0).toUpperCase() + month.season_type.slice(1)}</span>
            </div>
            
            <div className={`${styles.qualityBadge} ${styles[weatherQuality.label.toLowerCase()]}`}>
              {weatherQuality.icon}
              <span>{weatherQuality.label} Data Quality</span>
            </div>
            
            <div className={styles.dateRange}>
              <Calendar size={16} />
              <span>{formatDate(month.start_date_english)} - {formatDate(month.end_date_english)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Thermometer size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.avg_temperature ? `${month.avg_temperature}°C` : '--'}
            </div>
            <div className={styles.statLabel}>Avg Temperature</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Droplets size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.total_rainfall ? `${month.total_rainfall}mm` : '--'}
            </div>
            <div className={styles.statLabel}>Total Rainfall</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Cloud size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.avg_humidity ? `${month.avg_humidity}%` : '--'}
            </div>
            <div className={styles.statLabel}>Avg Humidity</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Wind size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.avg_wind_speed ? `${month.avg_wind_speed} m/s` : '--'}
            </div>
            <div className={styles.statLabel}>Avg Wind Speed</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Sun size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.sunshine_hours ? `${month.sunshine_hours} hrs` : '--'}
            </div>
            <div className={styles.statLabel}>Sunshine Hours</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Database size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {month.data_confidence || 0}%
            </div>
            <div className={styles.statLabel}>Data Confidence</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <Link href={`/nepali-season/months/${month.id}/edit`} className={styles.editButton}>
          <Edit size={18} />
          Edit Month
        </Link>
        
        {!hasWeatherData && (
          <button className={styles.autoFillButton} onClick={handleAutoFill}>
            <RefreshCw size={18} />
            Auto-fill Weather Data
          </button>
        )}
        
        <button className={styles.compareButton}>
          <BarChart3 size={18} />
          Compare with Other Months
        </button>
        
        <button className={styles.bookmarkButton}>
          <Bookmark size={18} />
          Bookmark
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className={styles.tabNavigation}>
        {['overview', 'weather', 'agriculture', 'festivals', 'integration', 'analytics'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <FileText size={18} />}
            {tab === 'weather' && <Cloud size={18} />}
            {tab === 'agriculture' && <Leaf size={18} />}
            {tab === 'festivals' && <Calendar size={18} />}
            {tab === 'integration' && <Database size={18} />}
            {tab === 'analytics' && <BarChart3 size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.overviewGrid}>
              {/* Weather Summary */}
              <div className={styles.sectionCard}>
                <h3>
                  <Cloud size={20} />
                  Weather Summary
                </h3>
                {hasWeatherData ? (
                  <div className={styles.weatherSummary}>
                    <p>
                      During {month.english_name}, temperatures average around {month.avg_temperature}°C 
                      with {month.total_rainfall}mm of rainfall. Humidity levels are typically around 
                      {month.avg_humidity}% with average wind speeds of {month.avg_wind_speed} m/s.
                    </p>
                    
                    <div className={styles.weatherChart}>
                      <WeatherChart month={month} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.noDataMessage}>
                    <AlertTriangle size={32} />
                    <p>No weather data available for this month.</p>
                    <button className={styles.addDataButton} onClick={handleAutoFill}>
                      <Cloud size={16} />
                      Add Weather Data
                    </button>
                  </div>
                )}
              </div>

              {/* Agricultural Information */}
              <div className={styles.sectionCard}>
                <h3>
                  <Leaf size={20} />
                  Agricultural Information
                </h3>
                <div className={styles.agriInfo}>
                  <div className={styles.agriSection}>
                    <h4>Suitable Crops</h4>
                    <div className={styles.cropsList}>
                      {month.suitable_crops?.map((crop, index) => (
                        <span key={index} className={styles.cropTag}>
                          {crop}
                        </span>
                      )) || (
                        <span className={styles.noData}>No crop data available</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.agriSection}>
                    <h4>Activities</h4>
                    <p className={styles.activities}>
                      {month.agricultural_activities || 'No activity data available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Festivals */}
              <div className={styles.sectionCard}>
                <h3>
                  <Calendar size={20} />
                  Festivals & Events
                </h3>
                <FestivalList festivals={month.festivals} />
              </div>

              {/* Special Notes */}
              <div className={styles.sectionCard}>
                <h3>
                  <FileText size={20} />
                  Special Notes
                </h3>
                <div className={styles.notesContent}>
                  {month.special_notes ? (
                    <p>{month.special_notes}</p>
                  ) : (
                    <p className={styles.noData}>No special notes available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className={styles.weatherContent}>
            <div className={styles.weatherHeader}>
              <h2>Detailed Weather Analysis</h2>
              {hasWeatherData ? (
                <div className={styles.dataSourceInfo}>
                  <span className={styles.sourceLabel}>Data Source:</span>
                  <span className={styles.sourceValue}>
                    {month.weather_data_source === 'auto_daily' ? 'Daily Weather API' :
                     month.weather_data_source === 'auto_hourly' ? 'Hourly Weather Data' :
                     month.weather_data_source === 'auto_current' ? 'Current Weather' :
                     month.weather_data_source === 'ml_prediction' ? 'ML Prediction' :
                     month.weather_data_source === 'manual' ? 'Manual Entry' : 'No Data'}
                  </span>
                  <span className={styles.updateInfo}>
                    <Clock size={14} />
                    Last updated: {month.last_weather_update 
                      ? new Date(month.last_weather_update).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
              ) : (
                <button className={styles.addWeatherButton} onClick={handleAutoFill}>
                  <Cloud size={16} />
                  Add Weather Data
                </button>
              )}
            </div>

            {hasWeatherData ? (
              <div className={styles.weatherGrid}>
                <div className={styles.weatherSection}>
                  <h3>Temperature Analysis</h3>
                  <div className={styles.temperatureMetrics}>
                    <div className={styles.tempMetric}>
                      <span className={styles.metricLabel}>Average:</span>
                      <span className={styles.metricValue}>{month.avg_temperature}°C</span>
                    </div>
                    <div className={styles.tempMetric}>
                      <span className={styles.metricLabel}>Minimum:</span>
                      <span className={styles.metricValue}>{month.avg_temp_min}°C</span>
                    </div>
                    <div className={styles.tempMetric}>
                      <span className={styles.metricLabel}>Maximum:</span>
                      <span className={styles.metricValue}>{month.avg_temp_max}°C</span>
                    </div>
                  </div>
                </div>

                <div className={styles.weatherSection}>
                  <h3>Precipitation Analysis</h3>
                  <div className={styles.precipitationMetrics}>
                    <div className={styles.precipMetric}>
                      <span className={styles.metricLabel}>Total Rainfall:</span>
                      <span className={styles.metricValue}>{month.total_rainfall} mm</span>
                    </div>
                    <div className={styles.precipMetric}>
                      <span className={styles.metricLabel}>Rain Days:</span>
                      <span className={styles.metricValue}>
                        {month.total_rainfall > 300 ? '20-25 days' :
                         month.total_rainfall > 150 ? '15-20 days' :
                         month.total_rainfall > 50 ? '10-15 days' :
                         '5-10 days'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.weatherSection}>
                  <h3>Wind & Sun Analysis</h3>
                  <div className={styles.windSunMetrics}>
                    <div className={styles.windSunMetric}>
                      <span className={styles.metricLabel}>Wind Speed:</span>
                      <span className={styles.metricValue}>{month.avg_wind_speed} m/s</span>
                    </div>
                    <div className={styles.windSunMetric}>
                      <span className={styles.metricLabel}>Sunshine Hours:</span>
                      <span className={styles.metricValue}>{month.sunshine_hours} hrs/day</span>
                    </div>
                  </div>
                </div>

                <div className={styles.chartSection}>
                  <h3>Weather Trends</h3>
                  <div className={styles.chartContainer}>
                    <WeatherChart month={month} detailed={true} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.noWeatherData}>
                <Cloud size={64} />
                <h3>No Weather Data Available</h3>
                <p>This month doesn't have any weather data yet. You can auto-fill from available sources or add data manually.</p>
                <div className={styles.noDataActions}>
                  <button className={styles.primaryAction} onClick={handleAutoFill}>
                    <RefreshCw size={18} />
                    Auto-fill from Sources
                  </button>
                  <button className={styles.secondaryAction}>
                    <Edit size={18} />
                    Add Manual Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agriculture' && (
          <AgriculturalAdvisory month={month} />
        )}

        {activeTab === 'festivals' && (
          <div className={styles.festivalsContent}>
            <FestivalList festivals={month.festivals} detailed={true} />
          </div>
        )}

        {activeTab === 'integration' && (
          <IntegrationStatus month={month} />
        )}

        {activeTab === 'analytics' && (
          <div className={styles.analyticsContent}>
            <h2>Analytics & Insights</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsSection}>
                <h3>Data Quality Analysis</h3>
                <div className={styles.qualityAnalysis}>
                  <div className={styles.qualityMetric}>
                    <span className={styles.metricLabel}>Confidence Score:</span>
                    <div className={styles.confidenceBar}>
                      <div 
                        className={styles.confidenceFill}
                        style={{ width: `${month.data_confidence || 0}%` }}
                      ></div>
                      <span className={styles.confidenceValue}>{month.data_confidence || 0}%</span>
                    </div>
                  </div>
                  
                  <div className={styles.qualityMetric}>
                    <span className={styles.metricLabel}>Data Coverage:</span>
                    <span className={styles.coverageValue}>
                      {month.weather_integration?.[0]?.data_coverage_percentage || 0}%
                    </span>
                  </div>
                  
                  <div className={styles.qualityMetric}>
                    <span className={styles.metricLabel}>Data Points:</span>
                    <span className={styles.dataPoints}>
                      {month.weather_integration?.[0]?.data_points_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.analyticsSection}>
                <h3>Seasonal Comparison</h3>
                <div className={styles.comparisonChart}>
                  {/* Add comparison chart here */}
                  <p>Comparison data will be available when more months have weather data.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Content */}
      <div className={styles.relatedContent}>
        <h3>Related Information</h3>
        <div className={styles.relatedGrid}>
          <div className={styles.relatedCard}>
            <h4>
              <Users size={20} />
              Created By
            </h4>
            <p>{month.created_by?.username || 'System'}</p>
            <span className={styles.relatedMeta}>
              {new Date(month.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className={styles.relatedCard}>
            <h4>
              <Clock size={20} />
              Last Updated
            </h4>
            <p>{new Date(month.updated_at).toLocaleString()}</p>
          </div>
          
          <div className={styles.relatedCard}>
            <h4>
              <MapPin size={20} />
              Geographical Data
            </h4>
            <p>Based on weather data for Morang, Nepal</p>
            <span className={styles.relatedMeta}>
              Latitude: 26.6522° N, Longitude: 87.2717° E
            </span>
          </div>
        </div>
      </div>

      {/* Navigation between months */}
      <div className={styles.monthNavigation}>
        <button className={styles.navButton}>
          <ChevronLeft size={20} />
          Previous Month
        </button>
        
        <div className={styles.currentMonth}>
          {month.english_name} ({month.nepali_name})
        </div>
        
        <button className={styles.navButton}>
          Next Month
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}