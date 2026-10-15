import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Gallery.css';

const Gallery: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const textDark = '#382350';
  
  const images = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="gallery-section">
      
      {/* Corner Flowers Decoration (Cropped with faded edges) */}
      <div style={{ 
        position: 'absolute', bottom: '-20px', left: '-20px', 
        width: '400px', height: '400px', 
        backgroundImage: 'url(/flower.png)', 
        backgroundSize: '250% auto', 
        backgroundPosition: 'bottom left',
        backgroundRepeat: 'no-repeat',
        WebkitMaskImage: 'radial-gradient(circle at bottom left, black 40%, transparent 70%)',
        maskImage: 'radial-gradient(circle at bottom left, black 40%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none', opacity: 0.9 
      }} />
      <div style={{ 
        position: 'absolute', top: '-20px', right: '-20px', 
        width: '400px', height: '400px', 
        backgroundImage: 'url(/flower.png)', 
        backgroundSize: '250% auto', 
        backgroundPosition: 'top right',
        backgroundRepeat: 'no-repeat',
        WebkitMaskImage: 'radial-gradient(circle at top right, black 40%, transparent 70%)',
        maskImage: 'radial-gradient(circle at top right, black 40%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none', opacity: 0.9 
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="gallery-header">
          <div className="gallery-title-wrapper">
            <p className="gallery-subtitle">Our Gallery</p>
            <h2 className="gallery-title">Moments we'll always cherish</h2>
          </div>
        <button className="view-all-btn">
          View All
          <div className="underline" />
        </button>
      </div>

      <div className="gallery-carousel-wrapper">
        <button className="carousel-btn left" onClick={() => scroll('left')}>
          <FaArrowLeft size={12} color={textDark} />
        </button>
        
        <div className="gallery-scroll-container" ref={scrollRef}>
          {images.map((src, index) => (
            <motion.div 
              key={index}
              className="gallery-image-wrapper"
              whileHover={{ scale: 1.02 }}
            >
              <img src={src} alt={`Gallery ${index}`} className="gallery-img" />
            </motion.div>
          ))}
        </div>

        <button className="carousel-btn right" onClick={() => scroll('right')}>
          <FaArrowRight size={12} color={textDark} />
        </button>
      </div>
      </div>
    </section>
  );
};

export default Gallery;
