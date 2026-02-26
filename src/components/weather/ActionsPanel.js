// components/weather/ActionsPanel.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '@/styles/weather.module.css';
import {
  RefreshCw,
  Brain,
  TrendingUp,
  Database,
  BarChart3,
  Settings,
  Cloud,
  Zap,
} from 'lucide-react';
import {
  updateWeatherData,
  trainMLModels,
  makePredictions,
  fetchWeatherDashboard,
  fetchSystemStatus,
} from '@/features/weatherDashboardSlice';

const ActionsPanel = () => {
  const dispatch = useDispatch();
  const [loadingAction, setLoadingAction] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = async (action, actionName) => {
    setLoadingAction(actionName);
    try {
      let result;
      switch (action) {
        case 'update':
          result = await dispatch(updateWeatherData()).unwrap();
          showNotification('Weather data updated successfully!');
          dispatch(fetchWeatherDashboard());
          break;
        case 'train':
          result = await dispatch(trainMLModels()).unwrap();
          showNotification('ML models trained successfully!');
          dispatch(fetchSystemStatus());
          break;
        case 'predict':
          result = await dispatch(makePredictions()).unwrap();
          showNotification(`Made ${result} predictions!`);
          dispatch(fetchWeatherDashboard());
          break;
        case 'refresh':
          await dispatch(fetchWeatherDashboard());
          await dispatch(fetchSystemStatus());
          showNotification('Data refreshed!');
          break;
        default:
          break;
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const actions = [
    {
      icon: <RefreshCw />,
      label: 'Refresh Data',
      description: 'Fetch latest weather data',
      action: () => handleAction('refresh', 'refresh'),
      color: '#2196f3',
    },
    {
      icon: <Cloud />,
      label: 'Update Weather',
      description: 'Pull new data from API',
      action: () => handleAction('update', 'update'),
      color: '#4caf50',
    },
    {
      icon: <Brain />,
      label: 'Train Models',
      description: 'Retrain ML models',
      action: () => handleAction('train', 'train'),
      color: '#9c27b0',
    },
    {
      icon: <TrendingUp />,
      label: 'Make Predictions',
      description: 'Generate new predictions',
      action: () => handleAction('predict', 'predict'),
      color: '#ff9800',
    },
    {
      icon: <Database />,
      label: 'View History',
      description: 'Historical data analysis',
      action: () => window.location.href = '/weather/history',
      color: '#607d8b',
    },
    {
      icon: <BarChart3 />,
      label: 'Analytics',
      description: 'Advanced analytics',
      action: () => window.location.href = '/weather/analytics',
      color: '#795548',
    },
    {
      icon: <Zap />,
      label: 'Hourly Forecast',
      description: 'Hourly predictions',
      action: () => window.location.href = '/weather/hourly',
      color: '#e91e63',
    },
    {
      icon: <Settings />,
      label: 'System Settings',
      description: 'Configure system',
      action: () => window.location.href = '/weather/settings',
      color: '#9e9e9e',
    },
  ];

  return (
    <>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={styles.actionButton}
            onClick={action.action}
            disabled={loadingAction === action.label.toLowerCase()}
            style={{ borderLeft: `4px solid ${action.color}` }}
          >
            <div className={styles.actionIcon} style={{ color: action.color }}>
              {loadingAction === action.label.toLowerCase() ? (
                <RefreshCw className={styles.spinning} />
              ) : (
                action.icon
              )}
            </div>
            <div className={styles.actionText}>{action.label}</div>
            <div className={styles.actionDescription}>{action.description}</div>
          </button>
        ))}
      </div>

      {notification && (
        <div
          className={styles.snackbar}
          style={{
            background: notification.type === 'error' ? '#f44336' : '#4caf50',
          }}
        >
          {notification.message}
        </div>
      )}
    </>
  );
};

export default ActionsPanel;