import React from 'react';
import { m } from 'framer-motion';
import { reveal } from '../motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Events.css';

const Events: React.FC = () => {
  const textDark = '#382350';

  return (
    <section className="events-section">
      <div className="events-container">
        {/* LEFT COLUMN: Header + Cards */}
        <m.div
          className="events-left"
          {...reveal()}
        >
          <div className="events-header">
            <p className="events-subtitle">The Events</p>
            <h2 className="events-title">
              Join us for two <span className="events-title-cursive">special celebrations</span>
            </h2>
          </div>

          <div className="events-cards-wrapper">
            {/* ENGAGEMENT CARD */}
            <div className="event-card">
              <div className="event-card-inner">
                {/* Custom Image Icon (Engagement) */}
                <div className="event-icon-custom engagement-icon" />

                <h3>Katb El-Ketab</h3>

                {/* Decorative divider */}
                <div className="card-divider">
                  <span className="divider-line" />
                  <span className="divider-dot">❖</span>
                  <span className="divider-line" />
                </div>

                <div className="event-info-list">
                  <div className="event-info-row">
                    <FaCalendarAlt size={13} color={textDark} />
                    <span>3 · 10 · 2026</span>
                  </div>
                  <div className="event-info-row">
                    <FaClock size={13} color={textDark} />
                    <span>8:00 PM</span>
                  </div>
                  <div className="event-info-row">
                    <FaMapMarkerAlt size={13} color={textDark} />
                    <span>Ammar Ibn Yasser Mosque.</span>
                  </div>
                </div>

                <a
                  className="event-map-btn"
                  href="https://maps.app.goo.gl/hVFBWwnscnc2d8Du5?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  View on Map <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>

            {/* WEDDING CARD */}
            <div className="event-card">
              <div className="event-card-inner">
                {/* Custom Image Icon (Wedding) */}
                <div className="event-icon-custom wedding-icon" />

                <h3>Wedding</h3>

                {/* Decorative divider */}
                <div className="card-divider">
                  <span className="divider-line" />
                  <span className="divider-dot">❖</span>
                  <span className="divider-line" />
                </div>

                <div className="event-info-list">
                  <div className="event-info-row">
                    <FaCalendarAlt size={13} color={textDark} />
                    <span>10 · 10 · 2026</span>
                  </div>
                  <div className="event-info-row">
                    <FaClock size={13} color={textDark} />
                    <span>8:00 PM</span>
                  </div>
                  <div className="event-info-row">
                    <FaMapMarkerAlt size={13} color={textDark} />
                    <span>Grand Festival, Beni-Suef.</span>
                  </div>
                </div>

                <a
                  className="event-map-btn"
                  href="https://maps.app.goo.gl/DLxN9ELs4N3Y6EAC9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  View on Map <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </m.div>

        {/* RIGHT COLUMN: Arch Image */}
        {/* <div className="events-right">
          <div className="arch-image-wrapper">
            <img src="/board-clean.png" alt="Floral Frame" className="board-frame" />
            <img src="/1.jpeg" alt="Mahmoud and Salma" className="board-photo" />
            
            <div className="arch-badge">
              <FaHeart size={10} />
              <span>Celebrate with us</span>
              <span className="btn-arrow">→</span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Events;
