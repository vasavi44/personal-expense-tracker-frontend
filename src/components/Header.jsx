import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const Header = ({ backendHealth, onRefresh, isRefreshing }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-badge">
          <Wallet className="logo-icon" size={24} />
        </div>
        <div className="brand-text">
          <div className="title-row">
            <h1 className="app-title">Expense Tracker</h1>
            <span className="badge-currency">INR (₹)</span>
          </div>
          <p className="welcome-message">
            Welcome! Manage, track, and analyze your everyday expenses with real-time accuracy.
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div
          className={`health-pill ${
            backendHealth === 'CONNECTED'
              ? 'health-online'
              : backendHealth === 'CHECKING'
              ? 'health-checking'
              : 'health-offline'
          }`}
          title={
            backendHealth === 'CONNECTED'
              ? 'Spring Boot REST API is connected and healthy'
              : backendHealth === 'CHECKING'
              ? 'Connecting to backend...'
              : 'Backend unreachable. Please verify Spring Boot is running.'
          }
        >
          {backendHealth === 'CONNECTED' ? (
            <>
              <CheckCircle2 size={15} />
              <span>API Online</span>
            </>
          ) : backendHealth === 'CHECKING' ? (
            <>
              <RefreshCw size={15} className="spin-icon" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <AlertCircle size={15} />
              <span>API Offline</span>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh expense records"
          aria-label="Refresh expenses"
        >
          <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
          <span className="btn-refresh-text">Sync</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
