import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTimesCircle, FaSignOutAlt, FaEnvelopeOpen, FaUserCheck, FaUserTimes, FaQuoteLeft } from 'react-icons/fa';
import { signIn, fetchRsvps, UnauthorizedError, type Rsvp, type Session } from '../firebase';
import './ResponsesPage.css';

const ResponsesPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [logging, setLogging] = useState(false);

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLogging(true);
    try {
      const s = await signIn(email, password);
      setSession(s);
    } catch (err: any) {
      setLoginError(err.message ?? 'Login failed');
    } finally {
      setLogging(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setRsvps([]);
  };

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    setLoading(true);
    setFetchError('');
    fetchRsvps(session.idToken)
      .then((data) => { if (!cancelled) setRsvps(data); })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof UnauthorizedError) {
            setFetchError('Session expired. Please log in again.');
            setSession(null);
          } else {
            setFetchError(err.message ?? 'Failed to load responses');
          }
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session]);

  const filtered = filter === 'all' ? rsvps : rsvps.filter((r) => r.attending === filter);
  const yesCount = rsvps.filter((r) => r.attending === 'yes').length;
  const noCount = rsvps.filter((r) => r.attending === 'no').length;

  if (!session) {
    return (
      <div className="responses-page">
        <div className="responses-login-wrapper">
          <m.div
            className="responses-login-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaEnvelopeOpen className="login-icon" />
            <h1 className="login-title">Wedding Responses</h1>
            <p className="login-subtitle">Sign in to view your guest list</p>

            <form onSubmit={handleLogin} className="login-form">
              <label className="login-field">
                <span>Email</span>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
              </label>
              <label className="login-field">
                <span>Password</span>
                <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </label>
              {loginError && <p className="login-error">{loginError}</p>}
              <m.button type="submit" className="login-submit" disabled={logging} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                {logging ? 'Signing in…' : 'Sign In'}
              </m.button>
            </form>
          </m.div>
        </div>
      </div>
    );
  }

  return (
    <div className="responses-page">
      <header className="responses-header">
        <div className="responses-header-inner">
          <h1 className="responses-title">
            <FaEnvelopeOpen style={{ marginRight: 12 }} />
            Guest Responses
          </h1>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="responses-stats">
        <m.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="stat-number">{rsvps.length}</span>
          <span className="stat-label">Total</span>
        </m.div>
        <m.div className="stat-card stat-yes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <FaUserCheck className="stat-icon" />
          <span className="stat-number">{yesCount}</span>
          <span className="stat-label">Attending</span>
        </m.div>
        <m.div className="stat-card stat-no" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <FaUserTimes className="stat-icon" />
          <span className="stat-number">{noCount}</span>
          <span className="stat-label">Declined</span>
        </m.div>
      </div>

      {/* Filter */}
      <div className="responses-filter">
        {(['all', 'yes', 'no'] as const).map((f) => (
          <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'yes' ? '✓ Attending' : '✗ Declined'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="responses-content">
        {loading && <p className="responses-status">Loading responses…</p>}
        {fetchError && <p className="responses-status error">{fetchError}</p>}

        {!loading && !fetchError && filtered.length === 0 && (
          <p className="responses-status">No responses yet.</p>
        )}

        <AnimatePresence>
          {filtered.map((rsvp, i) => (
            <m.div
              key={rsvp.id}
              className={`response-card ${rsvp.attending === 'yes' ? 'is-attending' : 'is-declined'}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="response-card-header">
                <div className="response-avatar">
                  {rsvp.name.charAt(0).toUpperCase()}
                </div>
                <div className="response-info">
                  <h3 className="response-name">{rsvp.name}</h3>
                  <span className="response-date">
                    {new Date(rsvp.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <span className={`response-badge ${rsvp.attending === 'yes' ? 'badge-yes' : 'badge-no'}`}>
                  {rsvp.attending === 'yes' ? <><FaHeart size={10} /> Attending</> : <><FaTimesCircle size={10} /> Declined</>}
                </span>
              </div>
              {rsvp.message && (
                <div className="response-message">
                  <FaQuoteLeft className="quote-icon" />
                  <p>{rsvp.message}</p>
                </div>
              )}
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResponsesPage;
