import React from 'react';
import { FaHeart, FaChevronDown } from 'react-icons/fa';
import './InvitationCover.css';

interface InvitationCoverProps {
  showNames: boolean;
  showButton?: boolean;
  onExplore?: () => void;
  className?: string;
}

const InvitationCover: React.FC<InvitationCoverProps> = ({ showNames, showButton = true, onExplore, className = '' }) => (
  <article className={`final-invitation ${className}`.trim()}>
    {/* Frame Background */}
    <div className="invitation-board-bg" aria-hidden="true" />
    <div className="invitation-letter-frame">
      <div className={`final-invitation-names ${showNames ? 'is-visible' : ''}`}>
        <p className="final-invitation-eyebrow">With all our love, we invite you</p>

        <h1 className="final-name-mahmoud">Mahmoud</h1>
        <span className="final-invitation-ampersand">&amp;</span>
        <h1 className="final-name-salma">Salma</h1>

        <div className="final-invitation-divider" aria-hidden="true">
          <span />
          <FaHeart size={11} />
          <span />
        </div>

        <p className="final-invitation-date">10 · 10 · 2026</p>

        <button className="final-invitation-scroll-hint" type="button" onClick={onExplore} aria-label="Scroll down">
          <FaChevronDown />
          <FaChevronDown />
        </button>

        {showButton && (
          <button className="final-invitation-scroll" type="button" onClick={onExplore}>
            Click to explore
          </button>
        )}
      </div>
    </div>
  </article>
);

export default InvitationCover;