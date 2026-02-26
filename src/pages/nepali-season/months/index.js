// app/nepali-season/months/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchNepaliSeasons,
  autoFillWeatherData,
} from '@/features/nepaliSeasonSlice';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import MonthCard from '@/components/nepali-season/MonthCard';
import FilterPanel from '@/components/nepali-season/FilterPanel';
import BulkActions from '@/components/nepali-season/BulkActions';
import styles from '@/styles/nepali-season/months.module.css';
import {
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  Plus,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Upload,
  Moon,
  Sun,
  CloudRain,
  Leaf,
  TrendingUp,
} from 'lucide-react';

export default function NepaliMonthsPage() {
  const dispatch = useDispatch();
  const { nepaliMonths, loading, error } = useSelector((state) => state.nepaliSeason);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    season: 'all',
    hasWeatherData: 'all',
    confidence: 'all',
  });
  const [sortBy, setSortBy] = useState('month_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    dispatch(fetchNepaliSeasons());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedMonths.length === filteredMonths.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(filteredMonths.map(month => month.id));
    }
  };

  const handleMonthSelect = (monthId) => {
    setSelectedMonths(prev =>
      prev.includes(monthId)
        ? prev.filter(id => id !== monthId)
        : [...prev, monthId]
    );
  };

  const handleAutoFill = (monthId) => {
    dispatch(autoFillWeatherData(monthId));
  };

  // Filter and sort months
  const filteredMonths = nepaliMonths?.filter(month => {
    // Search filter
    if (searchTerm && !month.nepali_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !month.english_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !month.agricultural_activities?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Season filter
    if (filters.season !== 'all' && month.season_type !== filters.season) {
      return false;
    }

    // Weather data filter
    if (filters.hasWeatherData !== 'all') {
      const hasData = month.weather_data_source !== 'none';
      if (filters.hasWeatherData === 'yes' && !hasData) return false;
      if (filters.hasWeatherData === 'no' && hasData) return false;
    }

    // Confidence filter
    if (filters.confidence !== 'all') {
      const confidence = month.data_confidence || 0;
      if (filters.confidence === 'high' && confidence < 80) return false;
      if (filters.confidence === 'medium' && (confidence < 50 || confidence >= 80)) return false;
      if (filters.confidence === 'low' && confidence >= 50) return false;
      if (filters.confidence === 'none' && confidence > 0) return false;
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'month_number':
        comparison = a.month_number - b.month_number;
        break;
      case 'english_name':
        comparison = a.english_name.localeCompare(b.english_name);
        break;
      case 'avg_temperature':
        comparison = (a.avg_temperature || 0) - (b.avg_temperature || 0);
        break;
      case 'data_confidence':
        comparison = (a.data_confidence || 0) - (b.data_confidence || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const stats = {
    total: nepaliMonths?.length || 0,
    withWeatherData: nepaliMonths?.filter(m => m.weather_data_source !== 'none').length || 0,
    highConfidence: nepaliMonths?.filter(m => (m.data_confidence || 0) >= 80).length || 0,
    needsData: nepaliMonths?.filter(m => m.weather_data_source === 'none').length || 0,
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
    <div className={styles.monthsContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1>
            <Calendar size={32} />
            Nepali Months
          </h1>
          <p className={styles.subtitle}>
            Manage and view detailed information about Nepali calendar months
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Link href="/nepali-season/months/new" className={styles.addButton}>
            <Plus size={18} />
            Add New Month
          </Link>
          
          <button className={styles.exportButton}>
            <Download size={18} />
            Export Data
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Months</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#4caf5020', color: '#4caf50' }}>
            <Cloud size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withWeatherData}</div>
            <div className={styles.statLabel}>With Weather Data</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#ff980020', color: '#ff9800' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.highConfidence}</div>
            <div className={styles.statLabel}>High Confidence Data</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f4433620', color: '#f44336' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.needsData}</div>
            <div className={styles.statLabel}>Need Weather Data</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search months by name, activities..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
        
        <div className={styles.viewControls}>
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
          
          <button 
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            className={styles.refreshButton}
            onClick={() => dispatch(fetchNepaliSeasons())}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMonths.length > 0 && (
        <BulkActions
          selectedCount={selectedMonths.length}
          onDeselectAll={() => setSelectedMonths([])}
          onAutoFill={() => {
            selectedMonths.forEach(monthId => handleAutoFill(monthId));
          }}
        />
      )}

      {/* Filters Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Months Grid/List */}
      <div className={`${styles.monthsContent} ${viewMode === 'list' ? styles.listView : ''}`}>
        {viewMode === 'grid' ? (
          <div className={styles.monthsGrid}>
            {filteredMonths.map((month) => (
              <MonthCard
                key={month.id}
                month={month}
                isSelected={selectedMonths.includes(month.id)}
                onSelect={() => handleMonthSelect(month.id)}
                onAutoFill={() => handleAutoFill(month.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.monthsList}>
            <div className={styles.listHeader}>
              <div className={styles.listCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedMonths.length === filteredMonths.length && filteredMonths.length > 0}
                  onChange={handleSelectAll}
                  className={styles.checkbox}
                />
              </div>
              <div className={styles.listMonth}>Month</div>
              <div className={styles.listSeason}>Season</div>
              <div className={styles.listWeather}>Weather Data</div>
              <div className={styles.listConfidence}>Confidence</div>
              <div className={styles.listCrops}>Suitable Crops</div>
              <div className={styles.listActions}>Actions</div>
            </div>
            
            {filteredMonths.map((month) => (
              <div key={month.id} className={styles.listRow}>
                <div className={styles.listCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(month.id)}
                    onChange={() => handleMonthSelect(month.id)}
                    className={styles.checkbox}
                  />
                </div>
                
                <div className={styles.listMonth}>
                  <div className={styles.monthInfo}>
                    <div className={styles.monthNumber}>
                      {month.month_number}
                    </div>
                    <div className={styles.monthNames}>
                      <div className={`${styles.nepaliName} text-nepali`}>
                        {month.nepali_name}
                      </div>
                      <div className={styles.englishName}>
                        {month.english_name}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.listSeason}>
                  <div className={`${styles.seasonBadge} ${styles[month.season_type]}`}>
                    {month.season_type === 'summer' && <Sun size={14} />}
                    {month.season_type === 'monsoon' && <CloudRain size={14} />}
                    {month.season_type === 'autumn' && <Leaf size={14} />}
                    {month.season_type === 'winter' && <Moon size={14} />}
                    {month.season_type === 'spring' && <TrendingUp size={14} />}
                    {month.season_type.charAt(0).toUpperCase() + month.season_type.slice(1)}
                  </div>
                </div>
                
                <div className={styles.listWeather}>
                  <div className={styles.weatherStatus}>
                    {month.weather_data_source !== 'none' ? (
                      <span className={styles.hasData}>
                        <Cloud size={14} />
                        Available
                      </span>
                    ) : (
                      <span className={styles.noData}>
                        <AlertTriangle size={14} />
                        No Data
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={styles.listConfidence}>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill}
                      style={{ width: `${month.data_confidence || 0}%` }}
                    ></div>
                    <span className={styles.confidenceValue}>
                      {month.data_confidence || 0}%
                    </span>
                  </div>
                </div>
                
                <div className={styles.listCrops}>
                  <div className={styles.cropsList}>
                    {month.suitable_crops?.slice(0, 2).map((crop, index) => (
                      <span key={index} className={styles.cropTag}>
                        {crop}
                      </span>
                    ))}
                    {month.suitable_crops?.length > 2 && (
                      <span className={styles.moreCrops}>
                        +{month.suitable_crops.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={styles.listActions}>
                  <Link href={`/nepali-season/months/${month.id}`} className={styles.actionButton}>
                    <Eye size={16} />
                  </Link>
                  
                  <Link href={`/nepali-season/months/${month.id}/edit`} className={styles.actionButton}>
                    <Edit size={16} />
                  </Link>
                  
                  {month.weather_data_source === 'none' && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleAutoFill(month.id)}
                      title="Auto-fill weather data"
                    >
                      <Upload size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredMonths.length === 0 && (
        <div className={styles.emptyState}>
          <Calendar size={64} />
          <h3>No Months Found</h3>
          <p>
            {searchTerm || Object.values(filters).some(f => f !== 'all')
              ? 'Try adjusting your search or filters'
              : 'No Nepali months have been added yet'
            }
          </p>
          {searchTerm || Object.values(filters).some(f => f !== 'all') ? (
            <button 
              className={styles.clearFiltersButton}
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  season: 'all',
                  hasWeatherData: 'all',
                  confidence: 'all',
                });
              }}
            >
              Clear All Filters
            </button>
          ) : (
            <Link href="/nepali-season/months/new" className={styles.addFirstButton}>
              <Plus size={18} />
              Add First Month
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredMonths.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing <strong>{filteredMonths.length}</strong> of{' '}
            <strong>{nepaliMonths?.length}</strong> months
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
    </div>
  );
}