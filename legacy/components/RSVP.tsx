import React, { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { reveal } from '../motion';
import { FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import './RSVP.css';
import { submitRsvp, isRsvpConfigured, type Attending } from '../firebase';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const RSVP: React.FC = () => {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<Attending | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      setError('Something went wrong. Please check your connection and try again.');
    }
  };

  const reset = () => {
    setName('');
    setAttending(null);
    setMessage('');
    setStatus('idle');
  };

  return (
    <section id="rsvp" className="rsvp-section">
      <div className="rsvp-container">

        {/* LEFT COLUMN: Location */}
        <m.div
          className="rsvp-location"
          {...reveal()}
        >
          <p className="rsvp-subtitle">Our Location</p>
          <h2 className="rsvp-location-title">Grand Festival</h2>
          <p className="rsvp-location-city">Beni-Suef · Egypt</p>

          <div className="location-image-wrapper">
            <img src="/grand.webp" alt="Grand Festival venue" className="location-img" width={1400} height={625} loading="lazy" decoding="async" />
          </div>

          <a
            className="get-directions-btn"
            href="https://maps.app.goo.gl/DLxN9ELs4N3Y6EAC9?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaMapMarkerAlt size={13} />
            Get Directions <span className="arrow">→</span>
          </a>
        </m.div>

        {/* RIGHT COLUMN: RSVP Form */}
        <m.div
          className="rsvp-form-panel"
          {...reveal(0.15)}
        >
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <m.div
                key="thanks"
                className="rsvp-thanks"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FaHeart className="rsvp-thanks-heart" />
                <h2 className="rsvp-form-title">Thank you{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}!</h2>
                <p className="rsvp-deadline">
                  {attending === 'yes'
                    ? "We've received your RSVP and can't wait to celebrate with you."
                    : "We've received your reply. You'll be missed, thank you for letting us know."}
                </p>
                <button type="button" className="rsvp-link-btn" onClick={reset}>
                  Send another response
                </button>
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
                <p className="rsvp-subtitle">RSVP</p>
                <h2 className="rsvp-form-title">Will you celebrate with us?</h2>
                <div className="rsvp-heart-divider" aria-hidden="true">
                  <span />
                  <FaHeart size={10} />
                  <span />
                </div>
                <p className="rsvp-deadline">Kindly let us know if you can join us</p>

                <label className="rsvp-field">
                  <span className="rsvp-field-label">Your name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="e.g. Ahmed Mohamed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <div className="rsvp-choice" role="radiogroup" aria-label="Will you attend?">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={attending === 'yes'}
                    className={attending === 'yes' ? 'selected' : ''}
                    onClick={() => setAttending('yes')}
                  >
                    <FaHeart size={10} /> Joyfully accepts
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={attending === 'no'}
                    className={attending === 'no' ? 'selected' : ''}
                    onClick={() => setAttending('no')}
                  >
                    Regretfully declines
                  </button>
                </div>

                <label className="rsvp-field">
                  <span className="rsvp-field-label">A message for the couple</span>
                  <textarea
                    name="message"
                    rows={2}
                    maxLength={1000}
                    placeholder="e.g. Can't wait to celebrate with you!"
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
                  {status === 'sending' ? 'Sending…' : 'Send RSVP'}
                </m.button>
              </m.form>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
};

export default RSVP;
