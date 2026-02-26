// app/nepali-season/months/new/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MonthForm from '@/components/nepali-season/MonthForm';
import styles from '@/styles/nepali-season/create-month.module.css';
import {
  Calendar,
  ArrowLeft,
  Save,
  X,
  Upload,
  Cloud,
  Leaf,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function CreateMonthPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, make API call here
      // const response = await api.post('/api/nepali-season/months/', formData);
      
      console.log('Form submitted:', formData);
      
      // Redirect to the new month's page
      router.push('/nepali-season/months/');
    } catch (error) {
      console.error('Error creating month:', error);
      setErrors({ general: 'Failed to create month. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData = {
    month_number: '',
    nepali_name: '',
    english_name: '',
    season_type: '',
    start_date_english: '',
    end_date_english: '',
    suitable_crops: [],
    agricultural_activities: '',
    festivals: [],
    special_notes: '',
    weather_data_source: 'none',
    data_confidence: 0,
  };

  return (
    <div className={styles.createContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
            Cancel
          </button>
          
          <h1>
            <Calendar size={32} />
            Add New Nepali Month
          </h1>
          
          <div className={styles.headerActions}>
            <button 
              type="submit"
              form="month-form"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Month
                </>
              )}
            </button>
          </div>
        </div>
        
        <p className={styles.subtitle}>
          Fill in the details for the new Nepali calendar month. All fields marked with * are required.
        </p>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <MonthForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            formId="month-form"
          />
        </div>
        
        <div className={styles.sidebar}>
          {/* Tips & Guidelines */}
          <div className={styles.tipsCard}>
            <h3>
              <CheckCircle size={20} />
              Tips & Guidelines
            </h3>
            <ul className={styles.tipsList}>
              <li>Month numbers should be unique (1-12)</li>
              <li>Provide both Nepali and English names</li>
              <li>Select appropriate season type</li>
              <li>Add relevant agricultural information</li>
              <li>Include festivals and special events</li>
              <li>Weather data can be auto-filled later</li>
            </ul>
          </div>
          
          {/* Weather Data Info */}
          <div className={styles.weatherCard}>
            <h3>
              <Cloud size={20} />
              Weather Data
            </h3>
            <p>
              Weather data can be auto-filled after creating the month. The system will fetch data from:
            </p>
            <ul className={styles.weatherSources}>
              <li>Daily Weather API</li>
              <li>Hourly Weather Data</li>
              <li>Current Weather</li>
              <li>ML Predictions</li>
            </ul>
          </div>
          
          {/* Agricultural Info */}
          <div className={styles.agricultureCard}>
            <h3>
              <Leaf size={20} />
              Agricultural Data
            </h3>
            <p>
              Provide detailed agricultural information to help farmers plan their activities:
            </p>
            <ul className={styles.agricultureTips}>
              <li>List suitable crops for planting</li>
              <li>Describe key agricultural activities</li>
              <li>Include irrigation recommendations</li>
              <li>Note any special considerations</li>
            </ul>
          </div>
          
          {/* Validation Status */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.errorCard}>
              <h3>
                <AlertTriangle size={20} />
                Issues Found
              </h3>
              <ul className={styles.errorList}>
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}