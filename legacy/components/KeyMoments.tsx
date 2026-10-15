import React from 'react';
import { m } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import { reveal } from '../motion';
import './KeyMoments.css';

const KeyMoments: React.FC = () => (
  <section className="moments" id="events">
    <div className="moments-inner">
      {/* Header */}
      <m.div className="moments-header" {...reveal()}>
        <span className="section-tag">THE DETAILS</span>
        <h2 className="moments-title">Key Moments</h2>
        <div className="gold-line" style={{ margin: '1rem auto 0' }} />
      </m.div>

      {/* Cards grid */}
      <div className="moments-grid">
        {/* Marriage Contract Card */}
        <m.div className="moment-card" {...reveal(0.1)}>
          <div className="moment-card-image">
            <img src="/mosque.png" alt="The Grand Mosque" loading="lazy" decoding="async" />
            <div className="moment-card-image-overlay" />
          </div>
          <div className="moment-card-body">
            <div className="moment-icon-wrap">
              <FaStar size={18} />
            </div>
            <h3 className="moment-card-title">Marriage Contract</h3>
            <div className="moment-details">
              <div className="moment-detail">
                <FaCalendarAlt size={12} />
                <span>Friday, 16 October 2026</span>
              </div>
              <div className="moment-detail">
                <FaClock size={12} />
                <span>After Maghrib Prayer</span>
              </div>
              <div className="moment-detail">
                <FaMapMarkerAlt size={12} />
                <span>The Grand Mosque</span>
              </div>
              <p className="moment-area">East Nile</p>
            </div>
            <a
              className="btn-outline moment-map-btn"
              href="https://maps.app.goo.gl/hVFBWwnscnc2d8Du5?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ON MAP
              <span>→</span>
            </a>
          </div>
        </m.div>

        {/* Wedding Celebration Card */}
        <m.div className="moment-card moment-card--featured" {...reveal(0.2)}>
          <div className="moment-card-image">
            <img src="/grand.webp" alt="Grand Festival Hall" loading="lazy" decoding="async" />
            <div className="moment-card-image-overlay" />
          </div>
          <div className="moment-card-body">
            <div className="moment-icon-wrap moment-icon-wrap--gold">
              <FaHeart size={18} />
            </div>
            <h3 className="moment-card-title">Wedding Celebration</h3>
            <div className="moment-details">
              <div className="moment-detail">
                <FaCalendarAlt size={12} />
                <span>October 2026</span>
              </div>
              <div className="moment-detail">
                <FaClock size={12} />
                <span>To be confirmed</span>
              </div>
              <div className="moment-detail">
                <FaMapMarkerAlt size={12} />
                <span>Grand Festival Hall</span>
              </div>
              <p className="moment-area">East Nile, Beni Suef</p>
            </div>
            <a
              className="btn-outline moment-map-btn"
              href="https://maps.app.goo.gl/DLxN9ELs4N3Y6EAC9?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ON MAP
              <span>→</span>
            </a>
          </div>

          {/* Decorative script text */}
          <p className="moment-script" aria-hidden="true">
            With you,<br/>every moment<br/>is a beautiful<br/>beginning...
          </p>
        </m.div>
      </div>
    </div>

    {/* Bottom botanical decoration */}
    <div className="moments-botanical" aria-hidden="true">
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" opacity="0.12">
        <path d="M60 58 C50 40 20 35 5 15 C20 30 45 28 60 48 C75 28 100 30 115 15 C100 35 70 40 60 58Z" stroke="var(--gold)" strokeWidth="0.8" />
        <path d="M60 58 L60 20" stroke="var(--gold)" strokeWidth="0.6" />
        <circle cx="60" cy="15" r="3" fill="none" stroke="var(--gold)" strokeWidth="0.6" />
      </svg>
    </div>
  </section>
);

export default KeyMoments;
