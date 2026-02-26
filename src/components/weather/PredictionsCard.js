// components/weather/PredictionsCard.js
import React from 'react';
import styles from '@/styles/weather.module.css';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

const PredictionsCard = ({ predictions, mlModels }) => {
  if (!Array.isArray(predictions) || predictions.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4caf50';
    if (confidence >= 0.6) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className={`${styles.card} ${styles.predictionCard}`}>
      <div className={styles.predictionBadge}>
        <Brain size={16} /> AI Predictions
      </div>
      
      <div className={styles.predictionHeader}>
        <h3>ML Weather Predictions</h3>
        <div className={styles.modelInfo}>
          {mlModels?.map((model) => (
            <span key={model.id} className={styles.modelTag}>
              {model.name} (v{model.version})
            </span>
          ))}
        </div>
      </div>
      
      <div className={styles.predictionsGrid}>
        {predictions.map((prediction) => (
          <div key={prediction.id} className={styles.predictionItem}>
            <div className={styles.predictionDate}>
              {formatDate(prediction.prediction_for)}
            </div>
            
            <div className={styles.predictionTemp}>
              <div className={styles.tempPrediction}>
                <span>Day: </span>
                <strong>{Number(prediction.predicted_temp_day).toFixed(1)}°C</strong>
              </div>
              <div className={styles.tempRange}>
                <span className={styles.tempHigh}>
                  H: {Number(prediction.predicted_temp_max).toFixed(1)}°
                </span>
                <span className={styles.tempLow}>
                  L: {Number(prediction.predicted_temp_min).toFixed(1)}°
                </span>
              </div>
            </div>
            
            <div className={styles.predictionCondition}>
              <span>Condition:</span>
              <strong>{prediction.predicted_weather_main}</strong>
              <div
                className={styles.confidenceDot}
                style={{ backgroundColor: getConfidenceColor(prediction.confidence) }}
              />
              <span className={styles.confidenceText}>
                {(prediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className={styles.predictionDetails}>
              <div className={styles.detail}>
                <TrendingUp size={14} />
                <span>{prediction.predicted_humidity}% humidity</span>
              </div>
              <div className={styles.detail}>
                <TrendingUp size={14} />
                <span>{prediction.predicted_pressure} hPa</span>
              </div>
              <div className={styles.detail}>
                <TrendingUp size={14} />
                <span>{Number(prediction.predicted_wind_speed).toFixed(1)} m/s wind</span>
              </div>
            </div>
            
            {prediction.actual_temp_day && (
              <div className={styles.accuracySection}>
                <div className={styles.accuracyLabel}>
                  <AlertCircle size={14} />
                  <span>Actual vs Prediction:</span>
                </div>
                <div className={styles.accuracyValue}>
                  {Number(prediction.actual_temp_day).toFixed(1)}°C
                  <span className={styles.accuracyDiff}>
                    ({Number(prediction.actual_temp_day - prediction.predicted_temp_day).toFixed(1)}°)
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionsCard;