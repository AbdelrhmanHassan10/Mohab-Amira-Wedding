import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaHeart, FaTimes, FaCheck } from 'react-icons/fa';
import { reveal } from '../motion';
import { submitRsvp, isRsvpConfigured, type Attending } from '../firebase';
import './VenueRsvp.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const VenueRsvp: React.FC = () => {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<Attending | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please write your name.');
    if (!attending) return setError('Please let us know if you can come.');
    if (!isRsvpConfigured) {
      setStatus('error');
      return setError('RSVP is not connected yet. Please try again later.');
    }
    setError('');
    setStatus('sending');
    try {
      await submitRsvp({ name: name.trim(), attending, message: message.trim() });
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setName(''); setAttending(null); setMessage(''); setStatus('idle'); setError('');
  };

  return (
    <section className="venue-rsvp" id="rsvp">
      <div className="venue-rsvp-inner">
        {/* LEFT — Location */}
        <m.div className="venue-col" {...reveal()}>
          <div className="venue-image-wrap">
            <img src="/mosque.png" alt="The Grand Mosque, East Nile" loading="lazy" decoding="async" />
            <div className="venue-image-overlay" />
          </div>

          <div className="venue-info">
            <span className="section-tag">OUR LOCATION</span>
            <h2 className="venue-name">The Grand Mosque</h2>
            <h3 className="venue-area">East Nile</h3>
            <p className="venue-city">
              <FaMapMarkerAlt size={11} /> East Nile, Beni Suef
            </p>
            <a
              className="btn-outline venue-dir-btn"
              href="https://maps.app.goo.gl/hVFBWwnscnc2d8Du5?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>GET DIRECTIONS</span>
              <span>→</span>
            </a>
          </div>
        </m.div>

        {/* RIGHT — RSVP */}
        <m.div className="rsvp-col" {...reveal(0.15)}>
          <div className="rsvp-card">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <m.div
                  key="thanks"
                  className="rsvp-thanks"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="rsvp-thanks-icon">
                    <FaCheck size={20} />
                  </div>
                  <h3 className="rsvp-thanks-title">
                    Thank you{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}!
                  </h3>
                  <p className="rsvp-thanks-body">
                    {attending === 'yes'
                      ? "We've received your RSVP and can't wait to celebrate with you."
                      : "We've received your reply. You'll be missed, thank you for letting us know."}
                  </p>
                  <button type="button" className="rsvp-again" onClick={reset}>Send another response</button>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  className="rsvp-form"
                  onSubmit={submit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="rsvp-heading">WILL YOU BE JOINING US?</h3>
                  <p className="rsvp-sub">Your presence will make our day even more special.</p>

                  <div className="rsvp-divider" aria-hidden="true">
                    <span /><FaHeart size={8} /><span />
                  </div>

                  {/* Name */}
                  <label className="rsvp-field">
                    <span className="rsvp-label">Your Name</span>
                    <input
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      placeholder="e.g. Ahmed Mohamed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>

                  {/* Attendance buttons */}
                  <div className="rsvp-buttons-row">
                    <button
                      type="button"
                      className={`rsvp-attend-btn rsvp-attend-btn--yes${attending === 'yes' ? ' active' : ''}`}
                      onClick={() => setAttending('yes')}
                    >
                      <FaHeart size={10} />
                      YES, I'LL BE THERE
                    </button>
                    <button
                      type="button"
                      className={`rsvp-attend-btn rsvp-attend-btn--no${attending === 'no' ? ' active' : ''}`}
                      onClick={() => setAttending('no')}
                    >
                      <FaTimes size={10} />
                      SORRY, I CAN'T MAKE IT
                    </button>
                  </div>

                  {/* Message */}
                  <label className="rsvp-field">
                    <span className="rsvp-label">Message (Optional)</span>
                    <textarea
                      rows={2}
                      maxLength={1000}
                      placeholder="A wish for the couple..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </label>

                  {error && <p className="rsvp-error" role="alert">{error}</p>}

                  <m.button
                    type="submit"
                    className="rsvp-submit"
                    disabled={status === 'sending'}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === 'sending' ? 'Sending…' : 'SEND RSVP'}
                  </m.button>

                  <p className="rsvp-deadline">Please let us know by October 1, 2026.</p>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default VenueRsvp;
