import React from 'react';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="site-footer">
    <p className="footer-names">Mahmoud &amp; Salma</p>

    <div className="footer-divider" aria-hidden="true">
      <span />
      <FaHeart />
      <span />
    </div>

    <p className="footer-details">10 · 10 · 2026  </p>
    <p className="footer-note">Thank you for being part of our story</p>
  </footer>
);

export default Footer;
