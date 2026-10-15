import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { m } from 'framer-motion';
import Hero from './components/Hero';
import BigDay from './components/BigDay';
import KeyMoments from './components/KeyMoments';
import OurStory from './components/OurStory';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Rsvp from './components/Rsvp';
import Footer from './components/Footer';
import InvitationGate, { ZOOM_S } from './components/InvitationGate';
import FlyingPetals from './components/FlyingPetals';
import { VolumeIcon, VolumeOffIcon } from './components/Icons';

// admin-only page: kept out of the guests' download
const ResponsesPage = lazy(() => import('./components/ResponsesPage'));

function WeddingSite() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  // gate-fold invitation first: the site waits far away behind it, zooms up to size, then the gate is gone
  const [gate, setGate] = useState<'shown' | 'zoom' | 'gone'>('shown');
  // petals are tossed in from the sides once the guest is inside the site, and keep coming
  const [petals, setPetals] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('is-gated', gate !== 'gone');
  }, [gate]);

  const enterSite = () => {
    setGate('gone');
    setPetals(true);
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/music.mp3');
    audio.loop = true;
    audio.preload = 'none';
    const onPlay = () => setMusicPlaying(true);
    const onPause = () => setMusicPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const playMusic = () => audioRef.current?.play().catch(() => setMusicPlaying(false));

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) playMusic();
    else audio.pause();
  };

  return (
    <>
      {/* single-page invitation: opens straight into the hero, no navigation bar */}
      <m.div
        className="site"
        data-gated={gate !== 'gone' || undefined}
        initial={false}
        animate={gate === 'shown' ? { scale: 0.5, borderRadius: 22 } : { scale: 1, borderRadius: 0 }}
        transition={{ duration: ZOOM_S, ease: [0.55, 0, 0.3, 1] }}
      >
        <main>
          <Hero onBegin={playMusic} />
          <BigDay />
          <KeyMoments />
          <OurStory />
          <Gallery />
          <Location />
          <Rsvp />
        </main>
        <Footer />
      </m.div>

      {gate !== 'gone' && (
        <InvitationGate onOpen={playMusic} onZoom={() => setGate('zoom')} onEnter={enterSite} />
      )}
      {petals && <FlyingPetals />}

      <button
        className="music-toggle"
        type="button"
        onClick={toggleMusic}
        aria-pressed={musicPlaying}
        aria-label="Background music"
      >
        {musicPlaying ? <VolumeIcon /> : <VolumeOffIcon />}
      </button>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<WeddingSite />} />
      <Route path="/responses" element={<Suspense fallback={null}><ResponsesPage /></Suspense>} />
    </Routes>
  );
}

export default App;
