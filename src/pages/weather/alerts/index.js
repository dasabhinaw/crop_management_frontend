// app/weather/alerts/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherAlerts } from '@/features/weatherAlertsSlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import styles from '@/styles/alerts.module.css';
import {
  AlertTriangle,
  Bell,
  BellOff,
  Filter,
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export default function AlertsPage() {
  const dispatch = useDispatch();
  const { 
    alerts, 
    loading, 
    error 
  } = useSelector((state) => state.weatherAlerts);
  
  const [filter, setFilter] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchWeatherAlerts());
    
    // Refresh alerts every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchWeatherAlerts());
    }, 300000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  const getAlertIcon = (type) => {
    const icons = {
      'frost': '❄️',
      'heat': '🔥',
      'rain': '🌧️',
      'wind': '💨',
      'drought': '🏜️',
      'irrigation': '💧',
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'low': '#4caf50',
      'medium': '#ff9800',
      'high': '#f44336',
      'critical': '#9c27b0',
    };
    return colors[severity] || '#6c757d';
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      'frost': '#4d96ff',
      'heat': '#ff6b6b',
      'rain': '#0984e3',
      'wind': '#00b894',
      'drought': '#ff9800',
      'irrigation': '#9c27b0',
    };
    return colors[type] || '#6c757d';
  };

  const getConditionIcon = (type) => {
    const icons = {
      'frost': <Thermometer size={18} />,
      'heat': <Thermometer size={18} />,
      'rain': <CloudRain size={18} />,
      'wind': <Wind size={18} />,
      'drought': <Droplets size={18} />,
      'irrigation': <Droplets size={18} />,
    };
    return icons[type] || <AlertTriangle size={18} />;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return alert.is_active;
    if (filter === 'inactive') return !alert.is_active;
    return alert.alert_type === filter;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by severity first (critical -> high -> medium -> low)
    const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    if (severityDiff !== 0) return severityDiff;
    
    // Then by start time (most recent first)
    return new Date(b.start_time) - new Date(a.start_time);
  });

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.is_active).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffHours = Math.round((endDate - startDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.round((endDate - startDate) / (1000 * 60));
      return `${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.round(diffHours / 24);
      return `${diffDays} days`;
    }
  };

  const getRecommendations = (alert) => {
    const recommendations = {
      'frost': [
        'Cover sensitive plants with frost cloth',
        'Water plants before frost to insulate roots',
        'Move potted plants indoors',
        'Apply mulch to protect plant roots',
      ],
      'heat': [
        'Water plants deeply in the morning',
        'Provide shade for sensitive plants',
        'Mulch to retain soil moisture',
        'Avoid fertilizing during heat stress',
      ],
      'rain': [
        'Ensure proper drainage in garden beds',
        'Harvest ripe produce before heavy rain',
        'Check for soil erosion',
        'Cover young plants if rain is too heavy',
      ],
      'wind': [
        'Stake tall plants and young trees',
        'Secure greenhouse covers and shade cloth',
        'Harvest ripe fruits before wind damage',
        'Check irrigation systems for damage',
      ],
      'drought': [
        'Implement drip irrigation system',
        'Mulch heavily to retain moisture',
        'Water early morning or late evening',
        'Consider drought-resistant crops',
      ],
      'irrigation': [
        'Check soil moisture levels regularly',
        'Adjust irrigation schedule as needed',
        'Monitor plant health indicators',
        'Consider rainwater harvesting',
      ],
    };
    
    return recommendations[alert.alert_type] || [
      'Monitor weather conditions',
      'Check local advisories',
      'Take necessary precautions',
    ];
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
    <div className={styles.alertsContainer}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1>
            <AlertTriangle size={32} />
            Weather Alerts
          </h1>
          <p>Real-time weather warnings and agricultural advisories</p>
        </div>
        
        <div className={styles.headerStats}>
          <div className={styles.statBadge}>
            <Bell size={20} />
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total Alerts</span>
          </div>
          
          <div className={styles.statBadge}>
            <Bell size={20} style={{ color: '#4caf50' }} />
            <span className={styles.statNumber} style={{ color: '#4caf50' }}>
              {stats.active}
            </span>
            <span className={styles.statLabel}>Active</span>
          </div>
          
          <div className={styles.statBadge}>
            <AlertTriangle size={20} style={{ color: '#f44336' }} />
            <span className={styles.statNumber} style={{ color: '#f44336' }}>
              {stats.critical}
            </span>
            <span className={styles.statLabel}>Critical</span>
          </div>
        </div>
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
            <div className={styles.filterGroup}>
              <label>Filter by Status:</label>
              <div className={styles.filterButtons}>
                {['all', 'active', 'inactive'].map(status => (
                  <button
                    key={status}
                    className={`${styles.filterButton} ${filter === status ? styles.active : ''}`}
                    onClick={() => setFilter(status)}
                  >
                    {status === 'active' ? <Bell size={16} /> : 
                     status === 'inactive' ? <BellOff size={16} /> : 
                     <Filter size={16} />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Filter by Type:</label>
              <div className={styles.filterButtons}>
                {['all', 'frost', 'heat', 'rain', 'wind', 'drought', 'irrigation'].map(type => (
                  <button
                    key={type}
                    className={`${styles.filterButton} ${filter === type ? styles.active : ''}`}
                    onClick={() => setFilter(type)}
                    style={{
                      borderColor: getAlertTypeColor(type),
                      backgroundColor: filter === type ? `${getAlertTypeColor(type)}15` : 'white',
                    }}
                  >
                    <span className={styles.typeIcon}>
                      {getAlertIcon(type)}
                    </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Filter by Severity:</label>
              <div className={styles.filterButtons}>
                {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                  <button
                    key={severity}
                    className={`${styles.filterButton} ${filter === severity ? styles.active : ''}`}
                    onClick={() => setFilter(severity)}
                    style={{
                      borderColor: getSeverityColor(severity),
                      backgroundColor: filter === severity ? `${getSeverityColor(severity)}15` : 'white',
                    }}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
        className={styles.refreshButton}
        onClick={() => dispatch(fetchWeatherAlerts())}
      >
        <RefreshCw size={18} />
        Refresh Alerts
      </button>

      {sortedAlerts.length === 0 ? (
        <div className={styles.noAlerts}>
          <div className={styles.noAlertsIcon}>
            <CheckCircle size={64} />
          </div>
          <h3>No Alerts Found</h3>
          <p>There are currently no weather alerts matching your filters.</p>
          <button 
            className={styles.clearFiltersButton}
            onClick={() => setFilter('all')}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.alertsGrid}>
          {sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`${styles.alertCard} ${
                !alert.is_active ? styles.inactive : ''
              }`}
              style={{
                borderLeftColor: getSeverityColor(alert.severity),
                borderLeftWidth: '6px',
              }}
            >
              <div className={styles.alertHeader}>
                <div className={styles.alertType}>
                  <span className={styles.typeIcon}>
                    {getAlertIcon(alert.alert_type)}
                  </span>
                  <div>
                    <h3>{alert.title}</h3>
                    <div className={styles.alertMeta}>
                      <span className={styles.alertTypeBadge}>
                        {alert.alert_type.charAt(0).toUpperCase() + alert.alert_type.slice(1)}
                      </span>
                      <span 
                        className={styles.severityBadge}
                        style={{
                          backgroundColor: `${getSeverityColor(alert.severity)}20`,
                          color: getSeverityColor(alert.severity),
                        }}
                      >
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                      {alert.is_active ? (
                        <span className={styles.activeBadge}>
                          <Bell size={12} />
                          Active
                        </span>
                      ) : (
                        <span className={styles.inactiveBadge}>
                          <BellOff size={12} />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  className={styles.expandButton}
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                >
                  {expandedAlert === alert.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              <div className={styles.alertContent}>
                <p className={styles.alertDescription}>{alert.description}</p>
                
                <div className={styles.alertDetails}>
                  <div className={styles.detailItem}>
                    <Clock size={16} />
                    <div>
                      <span className={styles.detailLabel}>Start Time</span>
                      <span className={styles.detailValue}>
                        {formatTime(alert.start_time)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <Clock size={16} />
                    <div>
                      <span className={styles.detailLabel}>End Time</span>
                      <span className={styles.detailValue}>
                        {formatTime(alert.end_time)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <Calendar size={16} />
                    <div>
                      <span className={styles.detailLabel}>Duration</span>
                      <span className={styles.detailValue}>
                        {formatDuration(alert.start_time, alert.end_time)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    {getConditionIcon(alert.alert_type)}
                    <div>
                      <span className={styles.detailLabel}>Trigger Condition</span>
                      <span className={styles.detailValue}>
                        {alert.condition_type}: {alert.condition_operator} {alert.condition_value}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedAlert === alert.id && (
                  <div className={styles.alertExpanded}>
                    <div className={styles.affectedCrops}>
                      <h4>
                        <MapPin size={18} />
                        Affected Crops
                      </h4>
                      <div className={styles.cropsList}>
                        {alert.affected_crops?.map((crop, index) => (
                          <span key={index} className={styles.cropTag}>
                            {crop}
                          </span>
                        )) || (
                          <span className={styles.noCrops}>No specific crops affected</span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.recommendations}>
                      <h4>
                        <Shield size={18} />
                        Recommended Actions
                      </h4>
                      <ul className={styles.recommendationsList}>
                        {getRecommendations(alert).map((rec, index) => (
                          <li key={index}>
                            <CheckCircle size={16} />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.alertFooter}>
                      <span className={styles.createdAt}>
                        Alert created: {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                      {alert.is_active && (
                        <span className={styles.timeRemaining}>
                          <Clock size={14} />
                          Ends in {formatDuration(new Date(), alert.end_time)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.alertStats}>
        <h3>Alert Statistics</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#ff6b6b' }}>
              <Thermometer size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Temperature Alerts</div>
              <div className={styles.statValue}>
                {alerts.filter(a => ['frost', 'heat'].includes(a.alert_type)).length}
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#0984e3' }}>
              <CloudRain size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Precipitation Alerts</div>
              <div className={styles.statValue}>
                {alerts.filter(a => ['rain', 'drought', 'irrigation'].includes(a.alert_type)).length}
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#00b894' }}>
              <Wind size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Wind Alerts</div>
              <div className={styles.statValue}>
                {alerts.filter(a => a.alert_type === 'wind').length}
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: '#9c27b0' }}>
              <Zap size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Active Critical Alerts</div>
              <div className={styles.statValue}>
                {alerts.filter(a => a.is_active && a.severity === 'critical').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <AlertTriangle size={20} />
            <p>
              Alerts are generated based on weather conditions and agricultural thresholds. 
              Monitor regularly for updates.
            </p>
          </div>
          
          <div className={styles.footerActions}>
            <button className={styles.actionButton}>
              <ExternalLink size={16} />
              View Full Alert History
            </button>
            <button className={styles.actionButton}>
              <Bell size={16} />
              Configure Alert Settings
            </button>
          </div>
        </div>
        
        <div className={styles.footerMeta}>
          <small>
            Last updated: {new Date().toLocaleString()} • 
            Showing {sortedAlerts.length} of {alerts.length} alerts
          </small>
        </div>
      </footer>
    </div>
  );
}