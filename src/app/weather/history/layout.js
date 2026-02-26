
// app/weather/history/layout.js
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Clock,
  TrendingUp,
  Settings,
  Cloud,
} from 'lucide-react';
import styles from '@/styles/historyLayout.module.css';

export default function HistoryLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { href: '/weather/history', icon: <Clock size={20} />, label: 'History' },
    { href: '/weather/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { href: '/weather/hourly', icon: <Cloud size={20} />, label: 'Hourly' },
    { href: '/weather/predictions', icon: <TrendingUp size={20} />, label: 'Predictions' },
    { href: '/weather/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Weather Analytics</h2>
          <p>Historical Data & Analysis</p>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.infoCard}>
            <h4>About Historical Data</h4>
            <p>
              View and analyze weather patterns over time. Compare predictions
              with actual data and identify trends.
            </p>
          </div>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}