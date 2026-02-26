// components/nepali-season/CropSeasonOverview.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/nepali-season/crop-season-overview.module.css';
import {
  Leaf,
  Calendar,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  RefreshCw,
  Download,
  Share2,
  Sprout,
  Wheat,
  Apple,
  Carrot,
  Coffee,
  Sun,
  CloudRain,
  Moon,
  Wind,
  Compass,
  Droplet,
  Shield,
  BookOpen,
  Eye,
  Edit,
  Plus,
  X,
  FilterX,
} from 'lucide-react';

export default function CropSeasonOverview({ seasons, currentMonth }) {
  const [filter, setFilter] = useState({
    seasonType: 'all',
    crop: 'all',
    region: 'all',
    hasWeather: 'all',
  });
  const [sortBy, setSortBy] = useState('start_month');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  // Helper functions
  const getSeasonIcon = (seasonType) => {
    switch (seasonType) {
      case 'summer': return <Sun size={18} />;
      case 'monsoon': return <CloudRain size={18} />;
      case 'autumn': return <Leaf size={18} />;
      case 'winter': return <Moon size={18} />;
      case 'spring': return <TrendingUp size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  const getCropIcon = (crop) => {
    if (crop.includes('Rice') || crop.includes('Paddy')) return '🌾';
    if (crop.includes('Maize') || crop.includes('Corn')) return '🌽';
    if (crop.includes('Wheat')) return '🌾';
    if (crop.includes('Vegetable')) return '🥦';
    if (crop.includes('Fruit')) return '🍎';
    if (crop.includes('Potato')) return '🥔';
    if (crop.includes('Soybean')) return '🫘';
    if (crop.includes('Coffee')) return '☕';
    if (crop.includes('Tea')) return '🍵';
    return '🌱';
  };

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

  const calculateSeasonProgress = (season) => {
    if (!currentMonth || !season.start_month || !season.end_month) return 0;
    
    const currentMonthNum = currentMonth.month_number;
    const startMonthNum = season.start_month.month_number;
    const endMonthNum = season.end_month.month_number;
    
    if (currentMonthNum >= startMonthNum && currentMonthNum <= endMonthNum) {
      const totalMonths = endMonthNum - startMonthNum + 1;
      const elapsedMonths = currentMonthNum - startMonthNum + 1;
      return (elapsedMonths / totalMonths) * 100;
    } else if (startMonthNum > endMonthNum) {
      // Crosses year boundary
      if (currentMonthNum >= startMonthNum || currentMonthNum <= endMonthNum) {
        const totalMonths = (12 - startMonthNum + 1) + endMonthNum;
        let elapsedMonths;
        if (currentMonthNum >= startMonthNum) {
          elapsedMonths = currentMonthNum - startMonthNum + 1;
        } else {
          elapsedMonths = (12 - startMonthNum + 1) + currentMonthNum;
        }
        return (elapsedMonths / totalMonths) * 100;
      }
    }
    return 0;
  };

  const getWaterRequirementStatus = (season) => {
    const requirement = season.water_requirement_mm || 0;
    if (requirement > 400) return { label: 'Very High', color: '#0984e3' };
    if (requirement > 300) return { label: 'High', color: '#4d96ff' };
    if (requirement > 200) return { label: 'Medium', color: '#4caf50' };
    if (requirement > 100) return { label: 'Low', color: '#ff9800' };
    return { label: 'Very Low', color: '#ff6b6b' };
  };

  const getYieldPotential = (season) => {
    const avgYield = ((season.expected_yield_min || 0) + (season.expected_yield_max || 0)) / 2;
    if (avgYield > 5) return { label: 'Excellent', color: '#4caf50' };
    if (avgYield > 3) return { label: 'Good', color: '#8bc34a' };
    if (avgYield > 2) return { label: 'Average', color: '#ff9800' };
    if (avgYield > 1) return { label: 'Below Average', color: '#ff5722' };
    return { label: 'Poor', color: '#f44336' };
  };

  // Filter and sort seasons
  const filteredSeasons = seasons?.filter(season => {
    // Search filter
    if (searchTerm && 
        !season.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !season.nepali_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !season.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !season.primary_crops?.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Season type filter
    if (filter.seasonType !== 'all' && season.season_type !== filter.seasonType) {
      return false;
    }

    // Crop filter
    if (filter.crop !== 'all') {
      const hasCrop = season.primary_crops?.includes(filter.crop) || 
                     season.secondary_crops?.includes(filter.crop);
      if (!hasCrop) return false;
    }

    // Region filter
    if (filter.region !== 'all' && season.suitable_regions) {
      if (!season.suitable_regions.includes(filter.region)) return false;
    }

    // Weather data filter
    if (filter.hasWeather !== 'all') {
      const hasWeather = season.weather_auto_filled;
      if (filter.hasWeather === 'yes' && !hasWeather) return false;
      if (filter.hasWeather === 'no' && hasWeather) return false;
    }

    return true;
  }) || [];

  // Sort seasons
  const sortedSeasons = [...filteredSeasons].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'start_month':
        comparison = (a.start_month?.month_number || 0) - (b.start_month?.month_number || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'duration':
        comparison = (a.duration_days || 0) - (b.duration_days || 0);
        break;
      case 'water_requirement':
        comparison = (a.water_requirement_mm || 0) - (b.water_requirement_mm || 0);
        break;
      case 'expected_yield':
        const avgA = ((a.expected_yield_min || 0) + (a.expected_yield_max || 0)) / 2;
        const avgB = ((b.expected_yield_min || 0) + (b.expected_yield_max || 0)) / 2;
        comparison = avgA - avgB;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Get unique values for filters
  const uniqueSeasonTypes = [...new Set(seasons?.map(s => s.season_type) || [])];
  const uniqueCrops = [...new Set(seasons?.flatMap(s => [...(s.primary_crops || []), ...(s.secondary_crops || [])]) || [])];
  const uniqueRegions = [...new Set(seasons?.flatMap(s => s.suitable_regions || []) || [])];

  // Calculate statistics
  const stats = {
    total: seasons?.length || 0,
    active: seasons?.filter(s => s.is_active).length || 0,
    withWeather: seasons?.filter(s => s.weather_auto_filled).length || 0,
    current: seasons?.filter(s => {
      if (!currentMonth) return false;
      const startNum = s.start_month?.month_number;
      const endNum = s.end_month?.month_number;
      const currentNum = currentMonth.month_number;
      
      if (startNum <= endNum) {
        return currentNum >= startNum && currentNum <= endNum;
      } else {
        return currentNum >= startNum || currentNum <= endNum;
      }
    }).length || 0,
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleSeasonExpansion = (seasonId) => {
    setExpandedSeason(expandedSeason === seasonId ? null : seasonId);
  };

  const clearFilters = () => {
    setFilter({
      seasonType: 'all',
      crop: 'all',
      region: 'all',
      hasWeather: 'all',
    });
    setSearchTerm('');
  };

  return (
    <div className={styles.overviewContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2>
            <Leaf size={28} />
            Crop Seasons Overview
          </h2>
          <p className={styles.subtitle}>
            Manage and monitor agricultural seasons, crops, and requirements
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Link href="/nepali-season/crop-seasons/new" className={styles.addButton}>
            <Plus size={18} />
            Add Season
          </Link>
          <button className={styles.exportButton}>
            <Download size={18} />
            Export
          </button>
          <button className={styles.refreshButton}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
            <Leaf size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Seasons</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#4caf5020', color: '#4caf50' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active Seasons</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#0984e320', color: '#0984e3' }}>
            <CloudRain size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withWeather}</div>
            <div className={styles.statLabel}>With Weather Data</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#ff980020', color: '#ff9800' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.current}</div>
            <div className={styles.statLabel}>Current Seasons</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search seasons, crops, regions..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className={styles.viewControls}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <div className={styles.gridIcon}>
                <div className={styles.gridSquare}></div>
                <div className={styles.gridSquare}></div>
                <div className={styles.gridSquare}></div>
                <div className={styles.gridSquare}></div>
              </div>
            </button>
            
            <button 
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <div className={styles.listIcon}>
                <div className={styles.listLine}></div>
                <div className={styles.listLine}></div>
                <div className={styles.listLine}></div>
              </div>
            </button>
          </div>
          
          <button 
            className={styles.filterButton}
            onClick={() => document.getElementById('filterPanel')?.classList.toggle(styles.show)}
          >
            <Filter size={18} />
            Filters
            {(filter.seasonType !== 'all' || filter.crop !== 'all' || filter.region !== 'all') && (
              <span className={styles.filterBadge}>
                {[
                  filter.seasonType !== 'all',
                  filter.crop !== 'all',
                  filter.region !== 'all'
                ].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div id="filterPanel" className={styles.filterPanel}>
        <div className={styles.filterHeader}>
          <h4>Filter Seasons</h4>
          <button 
            className={styles.clearFilters}
            onClick={clearFilters}
          >
            <FilterX size={16} />
            Clear All
          </button>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Season Type</label>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${filter.seasonType === 'all' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, seasonType: 'all'})}
            >
              All Seasons
            </button>
            {uniqueSeasonTypes.map(type => (
              <button
                key={type}
                className={`${styles.filterOption} ${filter.seasonType === type ? styles.active : ''}`}
                onClick={() => setFilter({...filter, seasonType: type})}
                style={{
                  backgroundColor: filter.seasonType === type ? getSeasonColor(type) + '20' : '',
                  borderColor: filter.seasonType === type ? getSeasonColor(type) : '',
                }}
              >
                {getSeasonIcon(type)}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Primary Crop</label>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${filter.crop === 'all' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, crop: 'all'})}
            >
              All Crops
            </button>
            {uniqueCrops.slice(0, 8).map(crop => (
              <button
                key={crop}
                className={`${styles.filterOption} ${filter.crop === crop ? styles.active : ''}`}
                onClick={() => setFilter({...filter, crop: crop})}
              >
                <span className={styles.cropIcon}>{getCropIcon(crop)}</span>
                {crop}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Region</label>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${filter.region === 'all' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, region: 'all'})}
            >
              All Regions
            </button>
            {uniqueRegions.slice(0, 6).map(region => (
              <button
                key={region}
                className={`${styles.filterOption} ${filter.region === region ? styles.active : ''}`}
                onClick={() => setFilter({...filter, region: region})}
              >
                <MapPin size={14} />
                {region}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Weather Data</label>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterOption} ${filter.hasWeather === 'all' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, hasWeather: 'all'})}
            >
              All
            </button>
            <button
              className={`${styles.filterOption} ${filter.hasWeather === 'yes' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, hasWeather: 'yes'})}
            >
              <CheckCircle size={14} />
              With Data
            </button>
            <button
              className={`${styles.filterOption} ${filter.hasWeather === 'no' ? styles.active : ''}`}
              onClick={() => setFilter({...filter, hasWeather: 'no'})}
            >
              <AlertTriangle size={14} />
              Without Data
            </button>
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Sort By</label>
          <div className={styles.sortOptions}>
            {[
              { id: 'start_month', label: 'Start Month' },
              { id: 'name', label: 'Name' },
              { id: 'duration', label: 'Duration' },
              { id: 'water_requirement', label: 'Water Need' },
              { id: 'expected_yield', label: 'Yield' },
            ].map(option => (
              <button
                key={option.id}
                className={`${styles.sortOption} ${sortBy === option.id ? styles.active : ''}`}
                onClick={() => handleSort(option.id)}
              >
                {option.label}
                {sortBy === option.id && (
                  <span className={styles.sortOrder}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seasons Grid/List */}
      <div className={`${styles.seasonsContent} ${viewMode === 'list' ? styles.listView : ''}`}>
        {viewMode === 'grid' ? (
          <div className={styles.seasonsGrid}>
            {sortedSeasons.map(season => {
              const progress = calculateSeasonProgress(season);
              const isCurrent = progress > 0 && progress < 100;
              const waterStatus = getWaterRequirementStatus(season);
              const yieldPotential = getYieldPotential(season);
              const isExpanded = expandedSeason === season.id;
              
              return (
                <div 
                  key={season.id} 
                  className={`${styles.seasonCard} ${isCurrent ? styles.current : ''}`}
                >
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.seasonBadge} style={{ backgroundColor: getSeasonColor(season.season_type) }}>
                      {getSeasonIcon(season.season_type)}
                      <span>{season.season_type.charAt(0).toUpperCase() + season.season_type.slice(1)}</span>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <Link href={`/nepali-season/crop-seasons/${season.id}`} className={styles.actionButton}>
                        <Eye size={16} />
                      </Link>
                      <Link href={`/nepali-season/crop-seasons/${season.id}/edit`} className={styles.actionButton}>
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.seasonName}>{season.name}</h3>
                    {season.nepali_name && (
                      <p className={`${styles.seasonNepaliName} text-nepali`}>
                        {season.nepali_name}
                      </p>
                    )}
                    
                    <div className={styles.dateRange}>
                      <Calendar size={14} />
                      <span>
                        {season.start_month?.nepali_name} to {season.end_month?.nepali_name}
                      </span>
                      {season.duration_days && (
                        <span className={styles.duration}>
                          ({season.duration_days} days)
                        </span>
                      )}
                    </div>
                    
                    {season.description && (
                      <p className={styles.description}>
                        {season.description.length > 100 && !isExpanded
                          ? `${season.description.substring(0, 100)}...`
                          : season.description}
                        {season.description.length > 100 && (
                          <button 
                            className={styles.readMore}
                            onClick={() => toggleSeasonExpansion(season.id)}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                  
                  {/* Primary Crops */}
                  <div className={styles.primaryCrops}>
                    <h4>Primary Crops</h4>
                    <div className={styles.cropsList}>
                      {season.primary_crops?.map((crop, index) => (
                        <span key={index} className={styles.cropTag}>
                          <span className={styles.cropIcon}>{getCropIcon(crop)}</span>
                          {crop}
                        </span>
                      )) || (
                        <span className={styles.noCrops}>No crops specified</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className={styles.keyMetrics}>
                    <div className={styles.metric}>
                      <div className={styles.metricHeader}>
                        <Droplet size={14} />
                        <span>Water Need</span>
                      </div>
                      <div 
                        className={styles.metricValue}
                        style={{ color: waterStatus.color }}
                      >
                        {season.water_requirement_mm ? `${season.water_requirement_mm} mm` : '--'}
                      </div>
                      <div className={styles.metricLabel}>
                        {waterStatus.label}
                      </div>
                    </div>
                    
                    <div className={styles.metric}>
                      <div className={styles.metricHeader}>
                        <BarChart3 size={14} />
                        <span>Yield Potential</span>
                      </div>
                      <div 
                        className={styles.metricValue}
                        style={{ color: yieldPotential.color }}
                      >
                        {season.expected_yield_min && season.expected_yield_max
                          ? `${season.expected_yield_min}-${season.expected_yield_max} t/ha`
                          : '--'
                        }
                      </div>
                      <div className={styles.metricLabel}>
                        {yieldPotential.label}
                      </div>
                    </div>
                    
                    <div className={styles.metric}>
                      <div className={styles.metricHeader}>
                        <Thermometer size={14} />
                        <span>Temp Range</span>
                      </div>
                      <div className={styles.metricValue}>
                        {season.optimal_temp_min && season.optimal_temp_max
                          ? `${season.optimal_temp_min}°-${season.optimal_temp_max}°C`
                          : '--'
                        }
                      </div>
                      <div className={styles.metricLabel}>
                        Optimal
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {isCurrent && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>Season Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: getSeasonColor(season.season_type)
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Weather Integration */}
                  <div className={styles.weatherIntegration}>
                    <div className={styles.weatherStatus}>
                      {season.weather_auto_filled ? (
                        <>
                          <CheckCircle size={14} className={styles.successIcon} />
                          <span>Weather data integrated</span>
                          {season.last_auto_fill && (
                            <span className={styles.lastUpdated}>
                              {new Date(season.last_auto_fill).toLocaleDateString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} className={styles.warningIcon} />
                          <span>Weather data needed</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className={styles.expandedContent}>
                      {/* Suitable Regions */}
                      {season.suitable_regions && season.suitable_regions.length > 0 && (
                        <div className={styles.expandedSection}>
                          <h5>
                            <MapPin size={14} />
                            Suitable Regions
                          </h5>
                          <div className={styles.regionsList}>
                            {season.suitable_regions.map((region, index) => (
                              <span key={index} className={styles.regionTag}>
                                {region}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Secondary Crops */}
                      {season.secondary_crops && season.secondary_crops.length > 0 && (
                        <div className={styles.expandedSection}>
                          <h5>
                            <Sprout size={14} />
                            Secondary Crops
                          </h5>
                          <div className={styles.cropsList}>
                            {season.secondary_crops.map((crop, index) => (
                              <span key={index} className={styles.cropTag}>
                                <span className={styles.cropIcon}>{getCropIcon(crop)}</span>
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Intercrop Options */}
                      {season.intercrop_options && season.intercrop_options.length > 0 && (
                        <div className={styles.expandedSection}>
                          <h5>
                            <Users size={14} />
                            Intercrop Options
                          </h5>
                          <div className={styles.intercropsList}>
                            {season.intercrop_options.map((option, index) => (
                              <span key={index} className={styles.intercropTag}>
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Rainfall Requirement */}
                      {season.total_rain_required && (
                        <div className={styles.expandedSection}>
                          <h5>
                            <CloudRain size={14} />
                            Rainfall Requirement
                          </h5>
                          <div className={styles.rainfallInfo}>
                            <span className={styles.rainfallValue}>
                              {season.total_rain_required} mm
                            </span>
                            <span className={styles.rainfallLabel}>
                              Total required rainfall
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.footerActions}>
                      <Link 
                        href={`/nepali-season/crop-seasons/${season.id}`}
                        className={styles.detailsButton}
                      >
                        View Details
                        <ChevronRight size={16} />
                      </Link>
                      
                      {!season.weather_auto_filled && (
                        <button className={styles.weatherButton}>
                          <CloudRain size={14} />
                          Add Weather
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className={styles.seasonsList}>
            <div className={styles.listHeader}>
              <div className={styles.listSeason}>Season</div>
              <div className={styles.listCrops}>Primary Crops</div>
              <div className={styles.listDuration}>Duration</div>
              <div className={styles.listWater}>Water Need</div>
              <div className={styles.listYield}>Yield Potential</div>
              <div className={styles.listWeather}>Weather</div>
              <div className={styles.listStatus}>Status</div>
              <div className={styles.listActions}>Actions</div>
            </div>
            
            {sortedSeasons.map(season => {
              const progress = calculateSeasonProgress(season);
              const isCurrent = progress > 0 && progress < 100;
              const waterStatus = getWaterRequirementStatus(season);
              const yieldPotential = getYieldPotential(season);
              
              return (
                <div key={season.id} className={`${styles.listRow} ${isCurrent ? styles.current : ''}`}>
                  <div className={styles.listSeason}>
                    <div className={styles.seasonInfo}>
                      <div 
                        className={styles.seasonDot}
                        style={{ backgroundColor: getSeasonColor(season.season_type) }}
                      ></div>
                      <div className={styles.seasonDetails}>
                        <div className={styles.seasonName}>{season.name}</div>
                        <div className={`${styles.seasonNepali} text-nepali`}>
                          {season.nepali_name}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.listCrops}>
                    <div className={styles.cropsList}>
                      {season.primary_crops?.slice(0, 2).map((crop, index) => (
                        <span key={index} className={styles.cropTag}>
                          {getCropIcon(crop)} {crop}
                        </span>
                      ))}
                      {season.primary_crops?.length > 2 && (
                        <span className={styles.moreCrops}>
                          +{season.primary_crops.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.listDuration}>
                    <div className={styles.durationInfo}>
                      <Calendar size={14} />
                      <span>{season.duration_days || '--'} days</span>
                    </div>
                  </div>
                  
                  <div className={styles.listWater}>
                    <div className={styles.waterInfo}>
                      <Droplet size={14} />
                      <span>{season.water_requirement_mm || '--'} mm</span>
                      <span 
                        className={styles.waterStatus}
                        style={{ color: waterStatus.color }}
                      >
                        {waterStatus.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.listYield}>
                    <div className={styles.yieldInfo}>
                      <BarChart3 size={14} />
                      <span>
                        {season.expected_yield_min && season.expected_yield_max
                          ? `${season.expected_yield_min}-${season.expected_yield_max}`
                          : '--'
                        }
                      </span>
                      <span 
                        className={styles.yieldStatus}
                        style={{ color: yieldPotential.color }}
                      >
                        {yieldPotential.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.listWeather}>
                    <div className={styles.weatherInfo}>
                      {season.weather_auto_filled ? (
                        <span className={styles.hasWeather}>
                          <CheckCircle size={14} />
                          Integrated
                        </span>
                      ) : (
                        <span className={styles.noWeather}>
                          <AlertTriangle size={14} />
                          Needed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.listStatus}>
                    {isCurrent ? (
                      <span className={styles.currentStatus}>
                        <div className={styles.progressMini}>
                          <div 
                            className={styles.progressFill}
                            style={{ 
                              width: `${progress}%`,
                              backgroundColor: getSeasonColor(season.season_type)
                            }}
                          ></div>
                        </div>
                        <span>{progress.toFixed(0)}%</span>
                      </span>
                    ) : progress >= 100 ? (
                      <span className={styles.completedStatus}>
                        Completed
                      </span>
                    ) : (
                      <span className={styles.upcomingStatus}>
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.listActions}>
                    <Link 
                      href={`/nepali-season/crop-seasons/${season.id}`}
                      className={styles.actionButton}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link 
                      href={`/nepali-season/crop-seasons/${season.id}/edit`}
                      className={styles.actionButton}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    {!season.weather_auto_filled && (
                      <button 
                        className={styles.actionButton}
                        title="Add Weather Data"
                      >
                        <CloudRain size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {sortedSeasons.length === 0 && (
        <div className={styles.emptyState}>
          <Leaf size={64} />
          <h3>No Crop Seasons Found</h3>
          <p>
            {searchTerm || Object.values(filter).some(f => f !== 'all')
              ? 'Try adjusting your search or filters'
              : 'No crop seasons have been added yet'
            }
          </p>
          {searchTerm || Object.values(filter).some(f => f !== 'all') ? (
            <button 
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              <FilterX size={18} />
              Clear All Filters
            </button>
          ) : (
            <Link href="/nepali-season/crop-seasons/new" className={styles.addFirstButton}>
              <Plus size={18} />
              Add First Season
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {sortedSeasons.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing <strong>{sortedSeasons.length}</strong> of{' '}
            <strong>{seasons?.length || 0}</strong> seasons
          </div>
          
          <div className={styles.paginationControls}>
            <button className={styles.pageButton} disabled>
              Previous
            </button>
            
            <div className={styles.pageNumbers}>
              <button className={`${styles.pageNumber} ${styles.active}`}>1</button>
              <button className={styles.pageNumber}>2</button>
              <button className={styles.pageNumber}>3</button>
              <span className={styles.pageEllipsis}>...</span>
              <button className={styles.pageNumber}>10</button>
            </div>
            
            <button className={styles.pageButton}>
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Current Season Summary */}
      {stats.current > 0 && (
        <div className={styles.currentSeasonSummary}>
          <div className={styles.summaryHeader}>
            <h3>
              <Clock size={20} />
              Currently Active Seasons ({stats.current})
            </h3>
            <button className={styles.summaryToggle}>
              <ChevronUp size={20} />
            </button>
          </div>
          
          <div className={styles.currentSeasonsList}>
            {sortedSeasons
              .filter(season => calculateSeasonProgress(season) > 0 && calculateSeasonProgress(season) < 100)
              .slice(0, 3)
              .map(season => (
                <div key={season.id} className={styles.currentSeasonCard}>
                  <div className={styles.currentSeasonInfo}>
                    <div className={styles.currentSeasonName}>
                      <div 
                        className={styles.currentSeasonDot}
                        style={{ backgroundColor: getSeasonColor(season.season_type) }}
                      ></div>
                      <h4>{season.name}</h4>
                      <span className={styles.currentProgress}>
                        {calculateSeasonProgress(season).toFixed(0)}% complete
                      </span>
                    </div>
                    
                    <div className={styles.currentSeasonActions}>
                      <Link 
                        href={`/nepali-season/crop-seasons/${season.id}`}
                        className={styles.viewButton}
                      >
                        View Details
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                  
                  <div className={styles.currentSeasonProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ 
                          width: `${calculateSeasonProgress(season)}%`,
                          backgroundColor: getSeasonColor(season.season_type)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}