import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">Personal Expense Tracker</span>
          <span className="footer-separator">•</span>
          <span className="footer-desc">
            Full-stack financial recording system built with React.js, Java Spring Boot REST API, and MySQL persistence.
          </span>
        </div>
        <div className="footer-right">
          <span className="tech-tag">React + Vite</span>
          <span className="tech-tag">Spring Boot 3</span>
          <span className="tech-tag">MySQL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
