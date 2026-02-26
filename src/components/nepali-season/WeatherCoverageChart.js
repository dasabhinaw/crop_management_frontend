// components/nepali-season/WeatherCoverageChart.js
'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import styles from '@/styles/nepali-season/weather-coverage-chart.module.css';
import {
  TrendingUp,
  TrendingDown,
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  Droplets,
  BarChart3,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';

export default function WeatherCoverageChart({ coverage }) {
  const [timeRange, setTimeRange] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [selectedSeason, setSelectedSeason] = useState('all');

  // Process coverage data
  const processCoverageData = () => {
    if (!coverage) {
      return {
        monthlyData: [],
        seasonalData: [],
        sourceData: [],
        confidenceData: [],
      };
    }

    // Monthly coverage data
    const monthlyData = coverage.monthly_coverage?.map(month => ({
      name: month.month,
      monthNumber: month.month_number,
      hasData: month.has_weather_data,
      confidence: month.confidence,
      temperature: month.temperature,
      rainfall: month.rainfall,
      season: month.season,
      fillColor: getSeasonColor(month.season),
    })) || [];

    // Seasonal summary
    const seasons = ['summer', 'monsoon', 'autumn', 'winter', 'spring'];
    const seasonalData = seasons.map(season => {
      const seasonMonths = monthlyData.filter(m => m.season.toLowerCase().includes(season.toLowerCase()));
      const withData = seasonMonths.filter(m => m.hasData);
      
      return {
        name: season.charAt(0).toUpperCase() + season.slice(1),
        total: seasonMonths.length,
        withData: withData.length,
        coverage: seasonMonths.length > 0 ? (withData.length / seasonMonths.length) * 100 : 0,
        avgConfidence: withData.length > 0 
          ? withData.reduce((sum, m) => sum + (m.confidence || 0), 0) / withData.length 
          : 0,
        avgTemp: withData.length > 0 
          ? withData.reduce((sum, m) => sum + (m.temperature || 0), 0) / withData.length 
          : null,
        color: getSeasonColor(season),
      };
    });

    // Data source distribution
    const sourceData = Object.entries(coverage.by_data_source || {}).map(([source, count]) => ({
      name: source,
      value: count,
      percentage: (count / coverage.summary?.total_months) * 100,
      color: getSourceColor(source),
    }));

    // Confidence distribution
    const confidenceData = [
      {
        name: 'High (≥80%)',
        value: coverage.by_confidence_level?.high || 0,
        color: '#4caf50',
      },
      {
        name: 'Medium (50-79%)',
        value: coverage.by_confidence_level?.medium || 0,
        color: '#ff9800',
      },
      {
        name: 'Low (<50%)',
        value: coverage.by_confidence_level?.low || 0,
        color: '#ff5722',
      },
      {
        name: 'No Data',
        value: coverage.by_confidence_level?.none || 0,
        color: '#9e9e9e',
      },
    ];

    return {
      monthlyData,
      seasonalData,
      sourceData,
      confidenceData,
    };
  };

  const getSeasonColor = (season) => {
    const colors = {
      'summer': '#ff6b6b',
      'monsoon': '#0984e3',
      'autumn': '#ff9800',
      'winter': '#4d96ff',
      'spring': '#4caf50',
    };
    return colors[season.toLowerCase()] || '#6c757d';
  };

  const getSourceColor = (source) => {
    const colors = {
      'Daily Weather API': '#4caf50',
      'Hourly Weather Data': '#2196f3',
      'Current Weather': '#ff9800',
      'ML Prediction': '#9c27b0',
      'Manual Entry': '#795548',
      'No Data': '#9e9e9e',
    };
    return colors[source] || '#607d8b';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <span 
                className={styles.tooltipDot} 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className={styles.tooltipName}>{entry.dataKey}: </span>
              <span className={styles.tooltipValue}>
                {entry.dataKey === 'coverage' || entry.dataKey === 'percentage' 
                  ? `${entry.value.toFixed(1)}%` 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const {
    monthlyData,
    seasonalData,
    sourceData,
    confidenceData,
  } = processCoverageData();

  const summary = coverage?.summary || {};

  return (
    <div className={styles.chartContainer}>
      {/* Header with Stats */}
      <div className={styles.chartHeader}>
        <div className={styles.headerMain}>
          <h3>
            <BarChart3 size={24} />
            Weather Data Coverage
          </h3>
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {summary.coverage_percentage ? `${summary.coverage_percentage.toFixed(1)}%` : '--'}
              </div>
              <div className={styles.statLabel}>Overall Coverage</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {summary.with_weather_data || '--'}
              </div>
              <div className={styles.statLabel}>Months with Data</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {summary.total_months || '--'}
              </div>
              <div className={styles.statLabel}>Total Months</div>
            </div>
          </div>
        </div>
        
        <div className={styles.chartControls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Time Range:</span>
            <div className={styles.controlButtons}>
              {['all', 'year', 'season'].map((range) => (
                <button
                  key={range}
                  className={`${styles.controlButton} ${timeRange === range ? styles.active : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range === 'all' && 'All'}
                  {range === 'year' && 'This Year'}
                  {range === 'season' && 'Current Season'}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Chart Type:</span>
            <div className={styles.controlButtons}>
              {['bar', 'line', 'area'].map((type) => (
                <button
                  key={type}
                  className={`${styles.controlButton} ${chartType === type ? styles.active : ''}`}
                  onClick={() => setChartType(type)}
                >
                  {type === 'bar' && 'Bar'}
                  {type === 'line' && 'Line'}
                  {type === 'area' && 'Area'}
                </button>
              ))}
            </div>
          </div>
          
          <button className={styles.exportButton}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Main Chart - Seasonal Coverage */}
      <div className={styles.mainChartSection}>
        <div className={styles.chartTitle}>
          <h4>Seasonal Weather Data Coverage</h4>
          <div className={styles.seasonFilters}>
            <button 
              className={`${styles.seasonFilter} ${selectedSeason === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedSeason('all')}
            >
              All Seasons
            </button>
            {['summer', 'monsoon', 'autumn', 'winter', 'spring'].map((season) => (
              <button
                key={season}
                className={`${styles.seasonFilter} ${selectedSeason === season ? styles.active : ''}`}
                onClick={() => setSelectedSeason(season)}
                style={{ 
                  backgroundColor: selectedSeason === season ? getSeasonColor(season) + '20' : '',
                  borderColor: selectedSeason === season ? getSeasonColor(season) : '',
                }}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Coverage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#666' }
                  }}
                  tick={{ fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="coverage" 
                  name="Data Coverage %"
                  radius={[4, 4, 0, 0]}
                >
                  {seasonalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="coverage" 
                    position="top"
                    formatter={(value) => `${value.toFixed(0)}%`}
                    fill="#666"
                  />
                </Bar>
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#666' }} />
                <YAxis 
                  label={{ 
                    value: 'Coverage (%)', 
                    angle: -90, 
                    position: 'insideLeft'
                  }}
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="coverage"
                  name="Data Coverage"
                  stroke="#667eea"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  name="Avg Confidence"
                  stroke="#4caf50"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#666' }} />
                <YAxis 
                  label={{ 
                    value: 'Coverage (%)', 
                    angle: -90, 
                    position: 'insideLeft'
                  }}
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="coverage"
                  name="Data Coverage"
                  stroke="#667eea"
                  fill="#667eea"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="avgConfidence"
                  name="Avg Confidence"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className={styles.secondaryCharts}>
        {/* Data Source Distribution */}
        <div className={styles.secondaryChart}>
          <div className={styles.chartTitle}>
            <h5>
              <Cloud size={16} />
              Data Sources
            </h5>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} months`, 'Count']}
                  labelFormatter={(label) => `Source: ${label}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right"
                    fill="#666"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className={styles.secondaryChart}>
          <div className={styles.chartTitle}>
            <h5>
              <CheckCircle size={16} />
              Confidence Levels
            </h5>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={confidenceData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#666' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: '#666' }} />
                <Tooltip 
                  formatter={(value) => [`${value} months`, 'Count']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top"
                    fill="#666"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Quality Indicators */}
      <div className={styles.qualityIndicators}>
        <div className={styles.indicatorCard}>
          <div className={styles.indicatorHeader}>
            <div className={styles.indicatorIcon}>
              <TrendingUp size={20} />
            </div>
            <h5>Coverage Trend</h5>
          </div>
          <div className={styles.indicatorContent}>
            <div className={styles.trendValue} style={{ color: '#4caf50' }}>
              +12.5%
            </div>
            <div className={styles.trendLabel}>
              Improvement from last month
            </div>
          </div>
        </div>

        <div className={styles.indicatorCard}>
          <div className={styles.indicatorHeader}>
            <div className={styles.indicatorIcon}>
              <AlertTriangle size={20} />
            </div>
            <h5>Needs Attention</h5>
          </div>
          <div className={styles.indicatorContent}>
            <div className={styles.trendValue} style={{ color: '#f44336' }}>
              {summary.without_weather_data || '--'}
            </div>
            <div className={styles.trendLabel}>
              Months without data
            </div>
          </div>
        </div>

        <div className={styles.indicatorCard}>
          <div className={styles.indicatorHeader}>
            <div className={styles.indicatorIcon}>
              <Sun size={20} />
            </div>
            <h5>Best Covered Season</h5>
          </div>
          <div className={styles.indicatorContent}>
            <div className={styles.trendValue} style={{ color: '#0984e3' }}>
              Monsoon
            </div>
            <div className={styles.trendLabel}>
              100% coverage
            </div>
          </div>
        </div>

        <div className={styles.indicatorCard}>
          <div className={styles.indicatorHeader}>
            <div className={styles.indicatorIcon}>
              <Moon size={20} />
            </div>
            <h5>Least Covered Season</h5>
          </div>
          <div className={styles.indicatorContent}>
            <div className={styles.trendValue} style={{ color: '#ff6b6b' }}>
              Winter
            </div>
            <div className={styles.trendLabel}>
              50% coverage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}