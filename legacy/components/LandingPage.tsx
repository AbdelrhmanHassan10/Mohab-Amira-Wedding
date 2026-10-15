import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { FaHeart, FaMusic, FaVolumeMute } from 'react-icons/fa';
import OurStory from './OurStory';
import Events from './Events';
import RSVP from './RSVP';
import Footer from './Footer';
import InvitationCover from './InvitationCover';
import SectionDivider from './SectionDivider';
import FlyingPetals from './FlyingPetals';
import { scrollToElement } from './SmoothScroll';
import './LandingPage.css';

interface LandingPageProps {
  isOpened: boolean;
  musicPlaying: boolean;
  onToggleMusic: () => void;
}


const LandingPage: React.FC<LandingPageProps> = ({ isOpened, musicPlaying, onToggleMusic }) => (
  <div className="landing-page">
    {/* petals tossed in from the sides, behind the content (start once the envelope has opened) */}
    {isOpened && <FlyingPetals />}

    {/* Music button stays fixed at the bottom of the screen */}
    <button
      className={`music-fab${musicPlaying ? ' is-playing' : ''}`}
      type="button"
      onClick={onToggleMusic}
      aria-label={musicPlaying ? 'Pause music' : 'Play music'}
      aria-pressed={musicPlaying}
    >
      {musicPlaying ? <FaMusic size={16} /> : <FaVolumeMute size={17} />}
    </button>

    {/* FIRST SECTION: invitation card (left, where the envelope lands) + card (center) + countdown (right) */}
    <section className="hero-section">


      <div className="hero-content">
        <div className="hero-col-left">
          <InvitationCover
            showNames={isOpened}
            showButton={false}
            onExplore={() => {
              if (window.innerWidth <= 900) {
                scrollToElement(document.querySelector('.invitation-text'));
              } else {
                scrollToElement(document.getElementById('our-story'));
              }
            }}
          />
        </div>

        {/* Plain invitation wording, no frame (names are already on the card at the left) */}
        <div className="hero-col-center invitation-text">
          <p className="invitation-text-eyebrow">Together with their families</p>
          <h2 className="invitation-text-script">We're getting married</h2>
          <div className="invitation-text-divider" aria-hidden="true">
            <span />
            <FaHeart />
            <span />
          </div>
          <p className="invitation-text-body">
            With joyful hearts, we invite you to share in our happiness
            as we celebrate our marriage and begin our new life together.
          </p>
          <p className="invitation-text-day">Saturday</p>
          <p className="invitation-text-date">10 · 10 · 2026</p>
          <p className="invitation-text-place"></p>
          <m.button
            className="invitation-text-rsvp"
            type="button"
            onClick={() => scrollToElement(document.getElementById('rsvp'))}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            RSVP <span aria-hidden="true">→</span>
          </m.button>
        </div>

        <div className="hero-col-right countdown-card">
          <span className="countdown-ornament" aria-hidden="true">❖</span>
          <p className="countdown-title">The Big Day</p>
          <div className="countdown-divider" aria-hidden="true">
            <span />
            <FaHeart />
            <span />
          </div>

          <HeroCountdown />

          <WeddingCalendar />

          <p className="countdown-script">
            A beautiful journey is<br />about to begin...
          </p>
          <div className="countdown-divider" aria-hidden="true">
            <span />
            <FaHeart />
            <span />
          </div>
        </div>
      </div>
    </section>

    <SectionDivider />

    {/* OUR STORY SECTION */}
    <OurStory />

    <SectionDivider />

    {/* EVENTS SECTION */}
    <Events />

    {/* GALLERY SECTION
    <Gallery />
    */}

    <SectionDivider />

    {/* RSVP SECTION */}
    <RSVP />

    {/* FOOTER */}
    <Footer />
  </div>
);

/* Own component so the per-second tick re-renders only the numbers, not the whole page */
// same time as the wedding card in the Events section (8:00 PM)
const WEDDING_START = new Date('2026-10-10T20:00:00');

const HeroCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let interval = 0;
    const tick = () => {
      const diff = WEDDING_START.getTime() - Date.now();
      if (diff <= 0) {
        setStarted(true);
        window.clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (started) {
    return (
      <div className="countdown-done">
        <FaHeart className="countdown-done-heart" aria-hidden="true" />
        <p className="countdown-done-title">Today is the day</p>
        <p className="countdown-done-note">Thank you for celebrating with us</p>
      </div>
    );
  }

  return (
    <div className="countdown-rings">
      {[
        { val: timeLeft.days, label: 'Days' },
        { val: timeLeft.hours, label: 'Hours' },
        { val: timeLeft.minutes, label: 'Minutes' },
        { val: timeLeft.seconds, label: 'Seconds' },
      ].map(({ val, label }) => (
        <div className="countdown-ring" key={label}>
          <span className="countdown-value">{String(val).padStart(2, '0')}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

const WEDDING_DAY = new Date(2026, 9, 10);
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/* Month of the wedding, weeks starting Monday, wedding day marked with a heart */
const WeddingCalendar: React.FC = () => {
  const year = WEDDING_DAY.getFullYear();
  const month = WEDDING_DAY.getMonth();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const monthName = WEDDING_DAY.toLocaleString('en-US', { month: 'long' });

  return (
    <div className="wedding-calendar">
      <p className="calendar-month">{monthName} {year}</p>
      <div className="calendar-grid calendar-weekdays">
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {cells.map((day, i) =>
          day === WEDDING_DAY.getDate() ? (
            <span key={i} className="calendar-day is-wedding" aria-label={`${day} - wedding day`}>
              <FaHeart className="calendar-heart" aria-hidden="true" />
              <span>{day}</span>
            </span>
          ) : (
            <span key={i} className="calendar-day">{day ?? ''}</span>
          )
        )}
      </div>
    </div>
  );
};

export default LandingPage;
