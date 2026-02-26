// components/nepali-season/AgriculturalAdvisory.js
'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/nepali-season/agricultural-advisory.module.css';
import {
  Leaf,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle,
  CloudRain,
  Sun,
  Wind,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Info,
  Droplet,
  Sprout,
  Shield,
  CloudSun,
  Cloud,
  ThermometerSun,
  Compass,
  BarChart3,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  BookOpen,
  Coffee,
  Wheat,
  Apple,
  Carrot,
} from 'lucide-react';

export default function AgriculturalAdvisory({ month, weatherData, currentMonth }) {
  const [expandedSections, setExpandedSections] = useState(['crops', 'activities', 'alerts']);
  const [selectedRegion, setSelectedRegion] = useState('Morang');
  const [timeHorizon, setTimeHorizon] = useState('current');

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Generate advisory based on weather data
  const generateAdvisory = () => {
    if (!month && !currentMonth) {
      return {
        severity: 'info',
        title: 'No Month Selected',
        message: 'Select a month to view agricultural advisory',
      };
    }

    const targetMonth = month || currentMonth;
    const hasWeatherData = targetMonth?.weather_data_source !== 'none';

    if (!hasWeatherData) {
      return {
        severity: 'warning',
        title: 'Limited Data Available',
        message: 'Weather data is not available for advisory generation',
      };
    }

    const temp = targetMonth.avg_temperature;
    const rainfall = targetMonth.total_rainfall;
    const humidity = targetMonth.avg_humidity;

    // Generate alerts based on conditions
    const alerts = [];

    if (temp > 35) {
      alerts.push({
        type: 'heat_stress',
        severity: 'high',
        title: 'Heat Stress Alert',
        message: 'High temperatures may stress crops. Increase irrigation frequency and consider shade management.',
        icon: <ThermometerSun size={20} />,
        recommendations: [
          'Water crops early morning or late evening',
          'Use mulch to retain soil moisture',
          'Consider temporary shade structures',
          'Monitor for pest outbreaks',
        ],
      });
    }

    if (temp < 5) {
      alerts.push({
        type: 'frost',
        severity: 'medium',
        title: 'Frost Risk',
        message: 'Low temperatures may damage sensitive crops. Take protective measures.',
        icon: <Thermometer size={20} />,
        recommendations: [
          'Cover sensitive plants overnight',
          'Use frost blankets or row covers',
          'Water soil before frost (helps retain heat)',
          'Avoid fertilizing during cold periods',
        ],
      });
    }

    if (rainfall > 300) {
      alerts.push({
        type: 'heavy_rain',
        severity: 'high',
        title: 'Heavy Rainfall Expected',
        message: 'Excessive rainfall may cause waterlogging and nutrient leaching.',
        icon: <CloudRain size={20} />,
        recommendations: [
          'Ensure proper drainage in fields',
          'Delay fertilizer application',
          'Monitor for fungal diseases',
          'Consider rainwater harvesting',
        ],
      });
    }

    if (rainfall < 50 && temp > 25) {
      alerts.push({
        type: 'drought',
        severity: 'high',
        title: 'Drought Conditions',
        message: 'Low rainfall with high temperatures increases water stress.',
        icon: <Droplets size={20} />,
        recommendations: [
          'Implement drip irrigation',
          'Use drought-resistant crop varieties',
          'Reduce planting density',
          'Apply water-retaining polymers',
        ],
      });
    }

    if (humidity > 80) {
      alerts.push({
        type: 'high_humidity',
        severity: 'medium',
        title: 'High Humidity Alert',
        message: 'High humidity increases risk of fungal diseases.',
        icon: <CloudSun size={20} />,
        recommendations: [
          'Ensure proper spacing for air circulation',
          'Apply preventive fungicides',
          'Water at soil level, not foliage',
          'Monitor for mildew and rust',
        ],
      });
    }

    // Generate overall advisory
    let overallSeverity = 'info';
    if (alerts.some(a => a.severity === 'high')) overallSeverity = 'high';
    else if (alerts.some(a => a.severity === 'medium')) overallSeverity = 'medium';

    const overallMessage = alerts.length > 0 
      ? `${alerts.length} weather alerts require attention`
      : 'Favorable conditions for most agricultural activities';

    return {
      severity: overallSeverity,
      title: getSeasonAdvisoryTitle(targetMonth.season_type),
      message: overallMessage,
      alerts,
      recommendations: generateRecommendations(targetMonth),
      waterAdvice: generateWaterAdvice(targetMonth),
      pestManagement: generatePestManagement(targetMonth),
    };
  };

  const getSeasonAdvisoryTitle = (seasonType) => {
    const titles = {
      'summer': 'Summer Crop Management',
      'monsoon': 'Monsoon Season Preparation',
      'autumn': 'Autumn Harvest Planning',
      'winter': 'Winter Crop Protection',
      'spring': 'Spring Planting Guidance',
    };
    return titles[seasonType] || 'Agricultural Advisory';
  };

  const generateRecommendations = (month) => {
    const recommendations = [];

    // Based on temperature
    if (month.avg_temperature > 30) {
      recommendations.push({
        icon: <Sun size={16} />,
        text: 'Focus on heat-tolerant crops like maize, millet, and cotton',
        priority: 'high',
      });
    }

    if (month.avg_temperature >= 20 && month.avg_temperature <= 30) {
      recommendations.push({
        icon: <Leaf size={16} />,
        text: 'Ideal conditions for vegetables and most field crops',
        priority: 'medium',
      });
    }

    if (month.avg_temperature < 15) {
      recommendations.push({
        icon: <Thermometer size={16} />,
        text: 'Suitable for cool-season crops like wheat, barley, and potatoes',
        priority: 'high',
      });
    }

    // Based on rainfall
    if (month.total_rainfall > 200) {
      recommendations.push({
        icon: <CloudRain size={16} />,
        text: 'Good for paddy cultivation and water-intensive crops',
        priority: 'medium',
      });
    }

    if (month.total_rainfall < 100) {
      recommendations.push({
        icon: <Droplet size={16} />,
        text: 'Consider drought-resistant crops and efficient irrigation',
        priority: 'high',
      });
    }

    // Based on season
    const seasonRecs = {
      'summer': [
        { icon: <Sprout size={16} />, text: 'Start summer vegetable planting', priority: 'medium' },
        { icon: <Shield size={16} />, text: 'Implement pest control measures', priority: 'high' },
      ],
      'monsoon': [
        { icon: <CloudRain size={16} />, text: 'Prepare for paddy transplantation', priority: 'high' },
        { icon: <Droplet size={16} />, text: 'Ensure proper drainage systems', priority: 'high' },
      ],
      'autumn': [
        { icon: <Coffee size={16} />, text: 'Harvest summer crops', priority: 'medium' },
        { icon: <Wheat size={16} />, text: 'Prepare land for winter crops', priority: 'medium' },
      ],
      'winter': [
        { icon: <Thermometer size={16} />, text: 'Protect crops from frost', priority: 'high' },
        { icon: <Carrot size={16} />, text: 'Plant winter vegetables', priority: 'medium' },
      ],
      'spring': [
        { icon: <Apple size={16} />, text: 'Start fruit tree maintenance', priority: 'medium' },
        { icon: <Sprout size={16} />, text: 'Begin spring planting', priority: 'high' },
      ],
    };

    if (seasonRecs[month.season_type]) {
      recommendations.push(...seasonRecs[month.season_type]);
    }

    return recommendations;
  };

  const generateWaterAdvice = (month) => {
    const rainfall = month.total_rainfall || 0;
    const temp = month.avg_temperature || 25;
    
    let irrigationFrequency, waterRequirement;
    
    if (rainfall > 300) {
      irrigationFrequency = 'Supplemental only';
      waterRequirement = 'Minimal additional water needed';
    } else if (rainfall > 150) {
      irrigationFrequency = 'Every 5-7 days';
      waterRequirement = `${Math.max(0, 200 - rainfall)} mm/month additional`;
    } else if (rainfall > 50) {
      irrigationFrequency = 'Every 3-4 days';
      waterRequirement = `${Math.max(0, 250 - rainfall)} mm/month additional`;
    } else {
      irrigationFrequency = 'Every 2-3 days';
      waterRequirement = `${Math.max(0, 300 - rainfall)} mm/month additional`;
    }

    // Adjust for temperature
    if (temp > 30) {
      waterRequirement += ' (Increase by 20% due to heat)';
    }

    return {
      irrigationFrequency,
      waterRequirement,
      efficiencyTips: [
        'Use drip irrigation for water-intensive crops',
        'Water during early morning or late evening',
        'Apply mulch to reduce evaporation',
        'Monitor soil moisture regularly',
      ],
    };
  };

  const generatePestManagement = (month) => {
    const pests = {
      'summer': ['Aphids', 'Whiteflies', 'Mites', 'Cutworms'],
      'monsoon': ['Rice stem borers', 'Leaf folders', 'Brown plant hoppers', 'Blight'],
      'autumn': ['Pod borers', 'Stem borers', 'Thrips', 'Rust'],
      'winter': ['Aphids', 'Cabbage worms', 'Mildew', 'Rodents'],
      'spring': ['Caterpillars', 'Beetles', 'Mites', 'Leaf miners'],
    };

    const controls = {
      'summer': [
        'Use yellow sticky traps',
        'Apply neem-based insecticides',
        'Introduce beneficial insects',
        'Maintain field sanitation',
      ],
      'monsoon': [
        'Ensure proper drainage',
        'Use resistant varieties',
        'Apply preventive fungicides',
        'Monitor field regularly',
      ],
      'winter': [
        'Use row covers',
        'Apply horticultural oils',
        'Practice crop rotation',
        'Maintain clean cultivation',
      ],
    };

    return {
      commonPests: pests[month.season_type] || ['Varies by crop and region'],
      controlMeasures: controls[month.season_type] || [
        'Regular monitoring',
        'Integrated pest management',
        'Use of resistant varieties',
        'Proper field sanitation',
      ],
      preventiveActions: [
        'Crop rotation',
        'Companion planting',
        'Soil health management',
        'Timely harvesting',
      ],
    };
  };

  const advisory = generateAdvisory();

  return (
    <div className={styles.advisoryContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2>
            <Leaf size={28} />
            Agricultural Advisory
          </h2>
          <div className={styles.regionSelector}>
            <MapPin size={16} />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={styles.regionSelect}
            >
              <option value="Morang">Morang District</option>
              <option value="Jhapa">Jhapa</option>
              <option value="Sunsari">Sunsari</option>
              <option value="Illam">Illam</option>
              <option value="Chitwan">Chitwan</option>
            </select>
          </div>
        </div>
        
        <div className={styles.timeHorizon}>
          {['current', '7day', '30day'].map((horizon) => (
            <button
              key={horizon}
              className={`${styles.horizonButton} ${timeHorizon === horizon ? styles.active : ''}`}
              onClick={() => setTimeHorizon(horizon)}
            >
              {horizon === 'current' && 'Current'}
              {horizon === '7day' && '7-Day'}
              {horizon === '30day' && '30-Day'}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Advisory Alert */}
      <div 
        className={`${styles.overallAlert} ${styles[advisory.severity]}`}
      >
        <div className={styles.alertHeader}>
          <div className={styles.alertIcon}>
            {advisory.severity === 'high' ? <AlertTriangle size={24} /> :
             advisory.severity === 'medium' ? <AlertTriangle size={24} /> :
             <Info size={24} />}
          </div>
          <div className={styles.alertContent}>
            <h3>{advisory.title}</h3>
            <p>{advisory.message}</p>
            <div className={styles.alertMeta}>
              <span className={styles.metaItem}>
                <Calendar size={14} />
                {month?.english_name || currentMonth?.english_name || 'No month selected'}
              </span>
              <span className={styles.metaItem}>
                <Clock size={14} />
                Updated: {new Date().toLocaleDateString()}
              </span>
              <span className={styles.metaItem}>
                <MapPin size={14} />
                {selectedRegion} District
              </span>
            </div>
          </div>
        </div>
        
        {(advisory.severity === 'high' || advisory.severity === 'medium') && (
          <div className={styles.alertActions}>
            <button className={styles.primaryAction}>
              <Share2 size={16} />
              Share with Farmers
            </button>
            <button className={styles.secondaryAction}>
              <Download size={16} />
              Download Advisory
            </button>
            <button className={styles.tertiaryAction}>
              <RefreshCw size={16} />
              Update Data
            </button>
          </div>
        )}
      </div>

      {/* Main Content Sections */}
      <div className={styles.sectionsContainer}>
        {/* Weather Alerts */}
        {advisory.alerts && advisory.alerts.length > 0 && (
          <div className={styles.section}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection('alerts')}
            >
              <h3>
                <AlertTriangle size={20} />
                Weather Alerts ({advisory.alerts.length})
              </h3>
              <div className={styles.sectionToggle}>
                {expandedSections.includes('alerts') ? 
                  <ChevronUp size={20} /> : 
                  <ChevronDown size={20} />
                }
              </div>
            </div>
            
            {expandedSections.includes('alerts') && (
              <div className={styles.alertsGrid}>
                {advisory.alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`${styles.alertCard} ${styles[alert.severity]}`}
                  >
                    <div className={styles.alertCardHeader}>
                      <div className={styles.alertCardIcon}>
                        {alert.icon}
                      </div>
                      <div className={styles.alertCardTitle}>
                        <h4>{alert.title}</h4>
                        <span className={styles.alertSeverity}>
                          {alert.severity === 'high' ? 'High Priority' :
                           alert.severity === 'medium' ? 'Medium Priority' :
                           'Information'}
                        </span>
                      </div>
                    </div>
                    
                    <p className={styles.alertCardMessage}>{alert.message}</p>
                    
                    {alert.recommendations && (
                      <div className={styles.alertRecommendations}>
                        <h5>Recommended Actions:</h5>
                        <ul>
                          {alert.recommendations.map((rec, recIndex) => (
                            <li key={recIndex}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Crop Recommendations */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('crops')}
          >
            <h3>
              <Sprout size={20} />
              Crop Recommendations
            </h3>
            <div className={styles.sectionToggle}>
              {expandedSections.includes('crops') ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </div>
          </div>
          
          {expandedSections.includes('crops') && (
            <div className={styles.recommendationsGrid}>
              {/* Suitable Crops */}
              <div className={styles.recommendationCard}>
                <div className={styles.cardHeader}>
                  <h4>
                    <CheckCircle size={18} />
                    Recommended Crops
                  </h4>
                  <span className={styles.cardBadge}>
                    {month?.suitable_crops?.length || 0} options
                  </span>
                </div>
                
                <div className={styles.cropsList}>
                  {month?.suitable_crops?.map((crop, index) => (
                    <div key={index} className={styles.cropItem}>
                      <div className={styles.cropIcon}>
                        {crop.includes('Rice') ? '🌾' :
                         crop.includes('Maize') ? '🌽' :
                         crop.includes('Wheat') ? '🌾' :
                         crop.includes('Vegetable') ? '🥦' :
                         crop.includes('Fruit') ? '🍎' : '🌱'}
                      </div>
                      <div className={styles.cropInfo}>
                        <span className={styles.cropName}>{crop}</span>
                        <span className={styles.cropType}>
                          {crop.includes('Rice') ? 'Staple grain' :
                           crop.includes('Maize') ? 'Cereal crop' :
                           crop.includes('Wheat') ? 'Winter cereal' :
                           crop.includes('Vegetable') ? 'Short-season' :
                           crop.includes('Fruit') ? 'Perennial' : 'General'}
                        </span>
                      </div>
                      <div className={styles.cropDetails}>
                        <span className={styles.cropDetail}>
                          <Thermometer size={12} />
                          {getCropTempRange(crop)}
                        </span>
                        <span className={styles.cropDetail}>
                          <Droplets size={12} />
                          {getCropWaterNeed(crop)}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <div className={styles.noData}>
                      No specific crop data available
                    </div>
                  )}
                </div>
              </div>

              {/* Planting Calendar */}
              <div className={styles.recommendationCard}>
                <div className={styles.cardHeader}>
                  <h4>
                    <Calendar size={18} />
                    Planting Timeline
                  </h4>
                </div>
                
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <h5>Immediate Actions (This Week)</h5>
                      <ul>
                        <li>Prepare seedbeds</li>
                        <li>Purchase quality seeds</li>
                        <li>Test soil moisture</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <h5>Short-term (Next 2-4 Weeks)</h5>
                      <ul>
                        <li>Start sowing/transplanting</li>
                        <li>Apply basal fertilizer</li>
                        <li>Establish irrigation system</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <h5>Mid-term (1-2 Months)</h5>
                      <ul>
                        <li>First weeding and thinning</li>
                        <li>Top dressing fertilizer</li>
                        <li>Pest monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Water Management */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('water')}
          >
            <h3>
              <Droplet size={20} />
              Water Management
            </h3>
            <div className={styles.sectionToggle}>
              {expandedSections.includes('water') ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </div>
          </div>
          
          {expandedSections.includes('water') && (
            <div className={styles.waterManagement}>
              <div className={styles.waterMetrics}>
                <div className={styles.waterMetric}>
                  <div className={styles.metricIcon}>
                    <Droplets size={24} />
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricValue}>
                      {advisory.waterAdvice?.waterRequirement || 'Calculate based on rainfall'}
                    </div>
                    <div className={styles.metricLabel}>
                      Additional Water Needed
                    </div>
                  </div>
                </div>
                
                <div className={styles.waterMetric}>
                  <div className={styles.metricIcon}>
                    <Clock size={24} />
                  </div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricValue}>
                      {advisory.waterAdvice?.irrigationFrequency || 'Based on conditions'}
                    </div>
                    <div className={styles.metricLabel}>
                      Irrigation Frequency
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.efficiencyTips}>
                <h4>Water Efficiency Tips</h4>
                <div className={styles.tipsGrid}>
                  {advisory.waterAdvice?.efficiencyTips?.map((tip, index) => (
                    <div key={index} className={styles.tipCard}>
                      <div className={styles.tipNumber}>{index + 1}</div>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pest & Disease Management */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('pests')}
          >
            <h3>
              <Shield size={20} />
              Pest & Disease Management
            </h3>
            <div className={styles.sectionToggle}>
              {expandedSections.includes('pests') ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </div>
          </div>
          
          {expandedSections.includes('pests') && (
            <div className={styles.pestManagement}>
              <div className={styles.pestSection}>
                <h4>Common Pests This Season</h4>
                <div className={styles.pestList}>
                  {advisory.pestManagement?.commonPests?.map((pest, index) => (
                    <span key={index} className={styles.pestTag}>
                      {pest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.pestSection}>
                <h4>Control Measures</h4>
                <ul className={styles.controlList}>
                  {advisory.pestManagement?.controlMeasures?.map((measure, index) => (
                    <li key={index}>
                      <CheckCircle size={14} />
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.pestSection}>
                <h4>Preventive Actions</h4>
                <div className={styles.preventiveActions}>
                  {advisory.pestManagement?.preventiveActions?.map((action, index) => (
                    <div key={index} className={styles.actionCard}>
                      <h5>{action}</h5>
                      <p>Reduces pest pressure and improves crop health</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market Information */}
        <div className={styles.section}>
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection('market')}
          >
            <h3>
              <TrendingUp size={20} />
              Market Information
            </h3>
            <div className={styles.sectionToggle}>
              {expandedSections.includes('market') ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </div>
          </div>
          
          {expandedSections.includes('market') && (
            <div className={styles.marketInfo}>
              <div className={styles.marketCard}>
                <div className={styles.marketHeader}>
                  <h4>Expected Prices</h4>
                  <span className={styles.trendBadge}>
                    <TrendingUp size={14} />
                    +15% from last season
                  </span>
                </div>
                <div className={styles.priceList}>
                  {[
                    { crop: 'Rice', price: 'NPR 45/kg', trend: 'up' },
                    { crop: 'Maize', price: 'NPR 32/kg', trend: 'stable' },
                    { crop: 'Wheat', price: 'NPR 38/kg', trend: 'up' },
                    { crop: 'Vegetables', price: 'NPR 28-65/kg', trend: 'variable' },
                  ].map((item, index) => (
                    <div key={index} className={styles.priceItem}>
                      <span className={styles.cropName}>{item.crop}</span>
                      <span className={styles.cropPrice}>{item.price}</span>
                      <span className={`${styles.priceTrend} ${styles[item.trend]}`}>
                        {item.trend === 'up' ? '↗' : 
                         item.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footerActions}>
        <div className={styles.actionButtons}>
          <button className={styles.primaryButton}>
            <Share2 size={18} />
            Share Full Advisory
          </button>
          <button className={styles.secondaryButton}>
            <Download size={18} />
            Download PDF Report
          </button>
          <button className={styles.tertiaryButton}>
            <BookOpen size={18} />
            View Detailed Guide
          </button>
          <button className={styles.tertiaryButton}>
            <Users size={18} />
            Contact Agricultural Officer
          </button>
        </div>
        
        <div className={styles.disclaimer}>
          <HelpCircle size={16} />
          <p>
            This advisory is based on weather data and historical patterns. 
            Always consult local agricultural experts for specific recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const getCropTempRange = (crop) => {
  const ranges = {
    'Rice': '20-35°C',
    'Maize': '18-32°C',
    'Wheat': '12-25°C',
    'Vegetables': '15-30°C',
    'Fruits': '10-28°C',
  };
  return ranges[crop] || '15-30°C';
};

const getCropWaterNeed = (crop) => {
  const needs = {
    'Rice': 'High',
    'Maize': 'Medium',
    'Wheat': 'Medium',
    'Vegetables': 'High',
    'Fruits': 'Medium',
  };
  return needs[crop] || 'Medium';
};