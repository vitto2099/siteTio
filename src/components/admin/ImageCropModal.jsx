import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Crop, Move } from 'lucide-react';

const ASPECT_RATIOS = [
  { label: 'Livre', value: null },
  { label: 'Horizontal (16:9)', value: 16 / 9 },
  { label: 'Horizontal (4:3)', value: 4 / 3 },
  { label: 'Quadrado (1:1)', value: 1 },
  { label: 'Vertical (4:5)', value: 4 / 5 },
  { label: 'Vertical (9:16)', value: 9 / 16 }
];

export default function ImageCropModal({ imageUrl, isOpen, onClose, onSave }) {
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageObjRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !imageUrl) return;
    setImageLoaded(false);
    setRotation(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
    img.src = imageUrl;
  }, [imageUrl, isOpen]);

  // Redesenhar o Canvas de pré-visualização de corte
  useEffect(() => {
    if (!imageLoaded || !imageObjRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageObjRef.current;

    const canvasWidth = 600;
    const targetRatio = aspectRatio || (img.width / img.height);
    const canvasHeight = Math.round(canvasWidth / targetRatio);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    // Centralizar para aplicar rotação e pan
    ctx.translate(canvasWidth / 2 + pan.x, canvasHeight / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calcular escala de cobertura base
    const isRotated = rotation % 180 !== 0;
    const sourceW = isRotated ? img.height : img.width;
    const sourceH = isRotated ? img.width : img.height;

    const baseScale = Math.max(canvasWidth / sourceW, canvasHeight / sourceH);
    const finalScale = baseScale * zoom;

    ctx.drawImage(
      img,
      (-img.width * finalScale) / 2,
      (-img.height * finalScale) / 2,
      img.width * finalScale,
      img.height * finalScale
    );

    ctx.restore();
  }, [imageLoaded, aspectRatio, rotation, zoom, pan]);

  if (!isOpen) return null;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleApplyCrop = () => {
    if (!canvasRef.current) return;
    // Exportar em alta qualidade compactada JPEG
    const croppedDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
    onSave(croppedDataUrl);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--primary-dark)',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crop size={18} color="#94A3B8" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Recortar e Ajustar Imagem
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de Visualização e Edição com Canvas */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            maxHeight: '52vh',
            overflow: 'hidden',
            position: 'relative',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {!imageLoaded ? (
            <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Carregando imagem para edição...</div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                maxHeight: '48vh',
                display: 'block',
                borderRadius: '4px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.5)'
              }}
            />
          )}

          {/* Dica de arrastar */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#CBD5E1',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              pointerEvents: 'none'
            }}
          >
            <Move size={12} /> Clique e arraste para posicionar a foto
          </div>
        </div>

        {/* Barra de Controles e Proporções */}
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Proporções */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Formato / Proporção
            </label>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {ASPECT_RATIOS.map((item, idx) => {
                const isActive = aspectRatio === item.value;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAspectRatio(item.value);
                      setPan({ x: 0, y: 0 });
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--primary-dark)' : '1px solid var(--border-subtle)',
                      backgroundColor: isActive ? 'var(--primary-dark)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : 'var(--text-body)'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom e Rotação */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Zoom Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: '1 1 200px' }}>
              <ZoomOut size={16} color="var(--text-muted)" />
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary-dark)' }}
              />
              <ZoomIn size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '40px' }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Botão de Girar 90º */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleRotate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
            >
              <RotateCw size={14} /> Girar 90°
            </button>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.65rem'
          }}
        >
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-navy btn-sm"
            onClick={handleApplyCrop}
            style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Check size={16} /> Salvar Recorte
          </button>
        </div>
      </div>
    </div>
  );
}
