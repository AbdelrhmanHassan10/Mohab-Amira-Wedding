import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import Wave from './Wave';
import { CheckIcon, CloseIcon, HeartIcon } from './Icons';
import { FloralCorner, FloralEmblem } from './Florals';
import { submitRsvp, isRsvpConfigured, type Attending } from '../firebase';
import { COUPLE, RSVP_COPY } from '../content/wedding';
import { EASE_SOFT, reveal } from '../motion';
import './Rsvp.css';

type Status = 'idle' | 'sending' | 'sent';

interface SentReply {
  name: string;
  attending: Attending;
  sentAt: number;
}

// Remembers a reply that the database actually accepted, so a returning guest
// sees their answer instead of sending it twice by accident.
const STORAGE_KEY = 'mahab-amira-rsvp';

const readSaved = (): SentReply | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SentReply) : null;
  } catch {
    return null;
  }
};

const save = (reply: SentReply | null) => {
  try {
    if (reply) localStorage.setItem(STORAGE_KEY, JSON.stringify(reply));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode: the reply is still sent, it just isn't remembered on this device */
  }
};

const Rsvp: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [choice, setChoice] = useState<Attending | null>(null);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(false);
  const [sent, setSent] = useState<SentReply | null>(null);
  const sendingRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = readSaved();
    if (saved) { setSent(saved); setStatus('sent'); }
  }, []);

  const reply = async (attending: Attending) => {
    if (sendingRef.current) return; // ignore double taps while a reply is on its way
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(true);
      setError('');
      nameRef.current?.focus();
      return;
    }
    if (!isRsvpConfigured) {
      setError(`Online RSVP isn't connected yet, so your reply was not sent. Please let ${COUPLE.first} & ${COUPLE.second} know directly.`);
      return;
    }

    sendingRef.current = true;
    setChoice(attending);
    setError('');
    setStatus('sending');
    try {
      await submitRsvp({ name: trimmed, attending, message: message.trim() });
      const record = { name: trimmed, attending, sentAt: Date.now() };
      save(record);
      setSent(record);
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError("We couldn't send your reply. Please check your connection and try again — nothing was saved.");
    } finally {
      sendingRef.current = false;
    }
  };

  // focus the confirmation so screen readers announce it
  useEffect(() => {
    if (status === 'sent' && choice) doneRef.current?.focus();
  }, [status, choice]);

  const startOver = () => {
    save(null);
    setSent(null);
    setName('');
    setMessage('');
    setChoice(null);
    setStatus('idle');
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const sending = status === 'sending';
  const firstName = sent?.name.split(/\s+/)[0];

  return (
    <section className="rsvp on-dark" id="rsvp" aria-labelledby="rsvp-title">
      <Wave position="top" shape="swell" fill="var(--forest)" />

      {/* large, faint floral sprays at the section edges */}
      <FloralCorner className="rsvp__bloom rsvp__bloom--left" />
      <FloralCorner className="rsvp__bloom rsvp__bloom--right" />

      <div className="rsvp__inner container">
        <m.div className="rsvp__card" {...reveal()}>
          {/* rose bouquets on the two top corners */}
          <FloralCorner className="rsvp__corner rsvp__corner--left" />
          <FloralCorner className="rsvp__corner rsvp__corner--right" />
          <span className="rsvp__frame" aria-hidden="true" />

          <div className="rsvp__intro">
            <FloralEmblem className="rsvp__emblem" />
            <span className="eyebrow">RSVP</span>
            <h2 id="rsvp-title" className="rsvp__title">{RSVP_COPY.heading}</h2>
            <p className="rsvp__sub">{RSVP_COPY.sub}</p>
            <div className="ornament" aria-hidden="true"><HeartIcon /></div>
            {/* desktop: large bouquet growing up from the bottom of the intro column */}
            <FloralCorner className="rsvp__bouquet" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' && sent ? (
              <m.div
                key="done"
                ref={doneRef}
                tabIndex={-1}
                className="rsvp__done"
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_SOFT }}
              >
                <span className="rsvp__done-icon" aria-hidden="true">
                  {sent.attending === 'yes' ? <HeartIcon /> : <CheckIcon />}
                </span>
                <h3 className="rsvp__done-title">Thank you, {firstName}!</h3>
                <p>
                  {sent.attending === 'yes'
                    ? "We've received your reply — we can't wait to celebrate with you."
                    : "We've received your reply. You'll be missed — thank you for letting us know."}
                </p>
                <p className="rsvp__done-meta">
                  Replied as <strong>{sent.name}</strong> ·{' '}
                  {sent.attending === 'yes' ? 'Attending' : 'Not attending'}
                </p>
                <button type="button" className="rsvp__again" onClick={startOver}>
                  Replying for someone else? Send another response
                </button>
              </m.div>
            ) : (
              <m.form
                key="form"
                className="rsvp__form"
                noValidate
                onSubmit={(e) => e.preventDefault()}
                aria-busy={sending}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="rsvp__field">
                  <label htmlFor="rsvp-name">Your name</label>
                  <input
                    ref={nameRef}
                    id="rsvp-name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="e.g. Ahmed Mohamed"
                    value={name}
                    disabled={sending}
                    aria-invalid={nameError || undefined}
                    aria-describedby={nameError ? 'rsvp-name-error' : undefined}
                    onChange={(e) => { setName(e.target.value); if (nameError) setNameError(false); }}
                  />
                  {nameError && (
                    <p id="rsvp-name-error" className="rsvp__field-error">
                      Please add your name so we know who is replying.
                    </p>
                  )}
                </div>

                <div className="rsvp__field">
                  <label htmlFor="rsvp-message">A note for the couple</label>
                  <textarea
                    id="rsvp-message"
                    rows={2}
                    maxLength={1000}
                    placeholder="Your wishes…"
                    value={message}
                    disabled={sending}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="rsvp__choices" role="group" aria-label="Will you attend?">
                  <button
                    type="button"
                    className="btn btn--gold rsvp__choice"
                    disabled={sending}
                    onClick={() => reply('yes')}
                  >
                    <HeartIcon />
                    {sending && choice === 'yes' ? 'Sending…' : 'Yes, I’ll Be There'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline-light rsvp__choice"
                    disabled={sending}
                    onClick={() => reply('no')}
                  >
                    <CloseIcon />
                    {sending && choice === 'no' ? 'Sending…' : 'Sorry, I Can’t Make It'}
                  </button>
                </div>

                <p className="rsvp__error" role="alert">{error}</p>
              </m.form>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  );
};

export default Rsvp;
