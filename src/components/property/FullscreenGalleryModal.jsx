import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

export default function FullscreenGalleryModal({ images = [], activeIndex = 0, isOpen, onClose, onIndexChange }) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(activeIndex);
    setIsZoomed(false);
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrev();
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, currentIndex]);

  if (!isOpen || !images.length) return null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    const nextIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    const nextIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  };

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.96)',
        backdropFilter: 'blur(8px)',
        zIndex: 3500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none'
      }}
      onClick={onClose}
    >
      {/* Barra Superior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          color: '#FFFFFF',
          zIndex: 10
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.04em' }}>
          Foto {currentIndex + 1} de {images.length}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isZoomed ? 'Reduzir Zoom' : 'Aumentar Zoom'}
          >
            {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Imagem Central Maximizado */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '0 1rem',
          overflow: isZoomed ? 'auto' : 'hidden'
        }}
      >
        <img
          src={currentImage}
          alt={`Visualização em tela cheia ${currentIndex + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
          style={{
            maxWidth: isZoomed ? '160%' : '94vw',
            maxHeight: isZoomed ? '160vh' : '82vh',
            objectFit: 'contain',
            borderRadius: '4px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            transition: 'max-width 0.25s ease, max-height 0.25s ease'
          }}
        />

        {/* Setas de Navegação */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Anterior (Seta Esquerda)"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Próxima (Seta Direita)"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas Inferiores */}
      {images.length > 1 && (
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            maxHeight: '80px',
            zIndex: 10
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setIsZoomed(false);
                if (onIndexChange) onIndexChange(idx);
              }}
              style={{
                padding: 0,
                border: idx === currentIndex ? '2px solid #FFFFFF' : '2px solid transparent',
                borderRadius: '4px',
                overflow: 'hidden',
                background: 'none',
                cursor: 'pointer',
                opacity: idx === currentIndex ? 1 : 0.5,
                flexShrink: 0
              }}
            >
              <img
                src={img}
                alt={`Miniatura ${idx + 1}`}
                style={{ width: '56px', height: '42px', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
