// app/weather/settings/page.js
'use client';

import React, { useState } from 'react';
import styles from '@/styles/settings.module.css';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Bell,
  Database,
  Cpu,
  Shield,
  User,
  Globe,
  Zap,
  Clock,
  Cloud,
  Download,
  Upload,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  Thermometer,
  Target,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General settings
    location: 'Morang, Nepal',
    units: 'metric',
    timezone: 'Asia/Kathmandu',
    language: 'en',
    
    // Alert settings
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    alertSound: true,
    criticalAlertsOnly: false,
    
    // Data settings
    autoRefresh: true,
    refreshInterval: 5,
    dataRetention: 365,
    enableAnalytics: true,
    
    // ML settings
    autoTrainModels: true,
    trainingFrequency: 'weekly',
    predictionHorizon: 7,
    modelAccuracyThreshold: 80,
    
    // API settings
    apiKey: '••••••••••••••••',
    showApiKey: false,
    rateLimit: 1000,
    cacheEnabled: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1000);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        location: 'Morang, Nepal',
        units: 'metric',
        timezone: 'Asia/Kathmandu',
        language: 'en',
        emailNotifications: true,
        pushNotifications: true,
        smsAlerts: false,
        alertSound: true,
        criticalAlertsOnly: false,
        autoRefresh: true,
        refreshInterval: 5,
        dataRetention: 365,
        enableAnalytics: true,
        autoTrainModels: true,
        trainingFrequency: 'weekly',
        predictionHorizon: 7,
        modelAccuracyThreshold: 80,
        apiKey: '••••••••••••••••',
        showApiKey: false,
        rateLimit: 1000,
        cacheEnabled: true,
      });
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `weather_settings_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        if (confirm('Import these settings? This will overwrite your current settings.')) {
          setSettings(importedSettings);
          setSaveStatus('imported');
          
          setTimeout(() => {
            setSaveStatus(null);
          }, 3000);
        }
      } catch (error) {
        alert('Error importing settings: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={20} /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={20} /> },
    { id: 'data', label: 'Data', icon: <Database size={20} /> },
    { id: 'ml', label: 'ML Models', icon: <Cpu size={20} /> },
    { id: 'api', label: 'API', icon: <Key size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  ];

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1>
            <SettingsIcon size={32} />
            System Settings
          </h1>
          <p>Configure your weather monitoring system preferences</p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.saveButton}
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className={styles.spinning} size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
          
          <button 
            className={styles.resetButton}
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </button>
        </div>
      </header>

      {saveStatus && (
        <div className={`${styles.statusMessage} ${styles[saveStatus]}`}>
          {saveStatus === 'success' ? (
            <>
              <Check size={20} />
              Settings saved successfully!
            </>
          ) : saveStatus === 'imported' ? (
            <>
              <Check size={20} />
              Settings imported successfully!
            </>
          ) : (
            <>
              <X size={20} />
              Failed to save settings
            </>
          )}
        </div>
      )}

      <div className={styles.settingsLayout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <div className={styles.sidebarActions}>
            <button className={styles.sidebarAction} onClick={handleExportSettings}>
              <Download size={18} />
              Export Settings
            </button>
            
            <label className={styles.sidebarAction}>
              <Upload size={18} />
              Import Settings
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                style={{ display: 'none' }}
              />
            </label>
            
            <button className={`${styles.sidebarAction} ${styles.danger}`}>
              <Trash2 size={18} />
              Clear All Data
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          {activeTab === 'general' && (
            <div className={styles.settingsSection}>
              <h2>
                <SettingsIcon size={24} />
                General Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label>
                    <Globe size={18} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => handleSettingChange('general', 'location', e.target.value)}
                    className={styles.textInput}
                  />
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Thermometer size={18} />
                    Temperature Units
                  </label>
                  <select
                    value={settings.units}
                    onChange={(e) => handleSettingChange('general', 'units', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="metric">°C (Metric)</option>
                    <option value="imperial">°F (Imperial)</option>
                  </select>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Clock size={18} />
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="Asia/Kathmandu">Asia/Kathmandu (GMT+5:45)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                  </select>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Globe size={18} />
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="en">English</option>
                    <option value="ne">Nepali</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className={styles.settingsSection}>
              <h2>
                <Bell size={24} />
                Alert Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Bell size={18} />
                      Email Notifications
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('alerts', 'emailNotifications', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Receive weather alerts via email
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Bell size={18} />
                      Push Notifications
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('alerts', 'pushNotifications', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Receive push notifications on your devices
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Bell size={18} />
                      SMS Alerts
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.smsAlerts}
                        onChange={(e) => handleSettingChange('alerts', 'smsAlerts', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Receive critical alerts via SMS (may incur charges)
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Bell size={18} />
                      Alert Sound
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.alertSound}
                        onChange={(e) => handleSettingChange('alerts', 'alertSound', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Play sound when new alerts arrive
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Shield size={18} />
                      Critical Alerts Only
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.criticalAlertsOnly}
                        onChange={(e) => handleSettingChange('alerts', 'criticalAlertsOnly', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Only receive critical severity alerts
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className={styles.settingsSection}>
              <h2>
                <Database size={24} />
                Data Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <RefreshCw size={18} />
                      Auto-refresh Data
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => handleSettingChange('data', 'autoRefresh', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Automatically refresh weather data
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Clock size={18} />
                    Refresh Interval (minutes)
                  </label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={settings.refreshInterval}
                      onChange={(e) => handleSettingChange('data', 'refreshInterval', parseInt(e.target.value))}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeValue}>{settings.refreshInterval} min</span>
                  </div>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Database size={18} />
                    Data Retention (days)
                  </label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('data', 'dataRetention', parseInt(e.target.value))}
                    className={styles.selectInput}
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="730">2 years</option>
                  </select>
                  <p className={styles.settingDescription}>
                    How long to keep historical data
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Zap size={18} />
                      Enable Analytics
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.enableAnalytics}
                        onChange={(e) => handleSettingChange('data', 'enableAnalytics', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Collect anonymous usage data for improvement
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ml' && (
            <div className={styles.settingsSection}>
              <h2>
                <Cpu size={24} />
                ML Model Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Cpu size={18} />
                      Auto-train Models
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.autoTrainModels}
                        onChange={(e) => handleSettingChange('ml', 'autoTrainModels', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Automatically retrain ML models with new data
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Clock size={18} />
                    Training Frequency
                  </label>
                  <select
                    value={settings.trainingFrequency}
                    onChange={(e) => handleSettingChange('ml', 'trainingFrequency', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className={styles.settingDescription}>
                    How often to retrain models
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Cloud size={18} />
                    Prediction Horizon (days)
                  </label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={settings.predictionHorizon}
                      onChange={(e) => handleSettingChange('ml', 'predictionHorizon', parseInt(e.target.value))}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeValue}>{settings.predictionHorizon} days</span>
                  </div>
                  <p className={styles.settingDescription}>
                    How many days ahead to predict
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Target size={18} />
                    Model Accuracy Threshold (%)
                  </label>
                  <div className={styles.rangeContainer}>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={settings.modelAccuracyThreshold}
                      onChange={(e) => handleSettingChange('ml', 'modelAccuracyThreshold', parseInt(e.target.value))}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeValue}>{settings.modelAccuracyThreshold}%</span>
                  </div>
                  <p className={styles.settingDescription}>
                    Minimum accuracy required for model deployment
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className={styles.settingsSection}>
              <h2>
                <Key size={24} />
                API Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label>
                    <Key size={18} />
                    API Key
                  </label>
                  <div className={styles.apiKeyContainer}>
                    <input
                      type={settings.showApiKey ? "text" : "password"}
                      value={settings.apiKey}
                      readOnly
                      className={styles.textInput}
                    />
                    <button
                      className={styles.toggleButton}
                      onClick={() => handleSettingChange('api', 'showApiKey', !settings.showApiKey)}
                    >
                      {settings.showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className={styles.settingDescription}>
                    Your unique API key for accessing weather data
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <label>
                    <Zap size={18} />
                    Rate Limit (requests/hour)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.rateLimit}
                    onChange={(e) => handleSettingChange('api', 'rateLimit', parseInt(e.target.value))}
                    className={styles.numberInput}
                  />
                  <p className={styles.settingDescription}>
                    Maximum API requests per hour
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Database size={18} />
                      Enable Caching
                    </label>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={settings.cacheEnabled}
                        onChange={(e) => handleSettingChange('api', 'cacheEnabled', e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Cache API responses for better performance
                  </p>
                </div>
              </div>
              
              <div className={styles.apiInfo}>
                <h3>API Documentation</h3>
                <div className={styles.apiEndpoints}>
                  <div className={styles.endpoint}>
                    <code>GET /api/weather/current/</code>
                    <span>Current weather data</span>
                  </div>
                  <div className={styles.endpoint}>
                    <code>GET /api/weather/historical/</code>
                    <span>Historical weather data</span>
                  </div>
                  <div className={styles.endpoint}>
                    <code>GET /api/weather/predictions/</code>
                    <span>Weather predictions</span>
                  </div>
                  <div className={styles.endpoint}>
                    <code>GET /api/weather/alerts/</code>
                    <span>Weather alerts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.settingsSection}>
              <h2>
                <Shield size={24} />
                Security Settings
              </h2>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <label>
                    <User size={18} />
                    Change Password
                  </label>
                  <div className={styles.passwordFields}>
                    <input
                      type="password"
                      placeholder="Current password"
                      className={styles.textInput}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className={styles.textInput}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className={styles.textInput}
                    />
                  </div>
                  <button className={styles.updatePasswordButton}>
                    Update Password
                  </button>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Shield size={18} />
                      Two-Factor Authentication
                    </label>
                    <label className={styles.switch}>
                      <input type="checkbox" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                
                <div className={styles.settingItem}>
                  <div className={styles.switchContainer}>
                    <label>
                      <Shield size={18} />
                      Session Timeout
                    </label>
                    <label className={styles.switch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <p className={styles.settingDescription}>
                    Automatically log out after 30 minutes of inactivity
                  </p>
                </div>
              </div>
              
              <div className={styles.securityInfo}>
                <h3>Active Sessions</h3>
                <div className={styles.sessionsList}>
                  <div className={styles.session}>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionDevice}>
                        <strong>Chrome on Windows</strong>
                        <span>Current session</span>
                      </div>
                      <div className={styles.sessionDetails}>
                        <span>Last active: Just now</span>
                        <span>IP: 192.168.1.1</span>
                      </div>
                    </div>
                    <button className={styles.logoutButton}>
                      Log Out
                    </button>
                  </div>
                  
                  <div className={styles.session}>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionDevice}>
                        <strong>Safari on iPhone</strong>
                        <span>Active 2 hours ago</span>
                      </div>
                      <div className={sessionDetails}>
                        <span>Last active: 2 hours ago</span>
                        <span>IP: 192.168.1.2</span>
                      </div>
                    </div>
                    <button className={styles.logoutButton}>
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.systemInfo}>
          <div className={styles.infoItem}>
            <span>System Version:</span>
            <strong>v2.1.0</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Last Updated:</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Database Size:</span>
            <strong>245 MB</strong>
          </div>
          <div className={styles.infoItem}>
            <span>Active Models:</span>
            <strong>4</strong>
          </div>
        </div>
        
        <div className={styles.footerActions}>
          <button className={styles.systemButton}>
            <RefreshCw size={16} />
            Check for Updates
          </button>
          <button className={styles.systemButton}>
            <Database size={16} />
            Backup Database
          </button>
          <button className={`${styles.systemButton} ${styles.danger}`}>
            <Trash2 size={16} />
            Clear Cache
          </button>
        </div>
      </footer>
    </div>
  );
}