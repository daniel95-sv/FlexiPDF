import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, Trash2, CheckCircle2 } from 'lucide-react';
import type { PageThumbnailData } from '../../hooks/usePDFThumbnails';

interface PageThumbnailProps {
  page: PageThumbnailData;
  mode: 'organize' | 'remove' | 'rotate' | 'extract';
  onRotate?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  index: number;
}

export function PageThumbnail({ page, mode, onRotate, onToggleSelect, index }: PageThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: page.id,
    disabled: mode !== 'organize' // Only allow dragging in organize mode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleInteract = (e: React.MouseEvent) => {
    if (mode === 'remove' || mode === 'extract') {
      e.stopPropagation();
      onToggleSelect?.(page.id);
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRotate?.(page.id);
  };

  return (
    <div 
      ref={setNodeRef} 
      {...attributes} 
      {...(mode === 'organize' ? listeners : {})}
      onClick={handleInteract}
      style={{
        ...style,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        cursor: mode === 'organize' ? 'grab' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s',
        boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        border: isDragging ? '2px solid #3b82f6' : (page.selected && mode === 'remove' ? '2px solid #ef4444' : (page.selected && mode === 'extract' ? '2px solid #3b82f6' : '2px solid transparent')),
        transform: isDragging ? `${style.transform} scale(1.05)` : style.transform,
        opacity: isDragging ? 0.8 : (page.selected && mode === 'remove' ? 0.75 : 1),
        width: '140px',
        height: '200px',
      }}
    >
      {/* Page Number Badge */}
      <div style={{ position: 'absolute', top: '-0.75rem', left: '-0.75rem', width: '2rem', height: '2rem', backgroundColor: '#1f2937', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10 }}>
        {index + 1}
      </div>

      {/* Mode-specific overlays */}
      {mode === 'remove' && page.selected && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <Trash2 style={{ width: '3rem', height: '3rem', color: '#dc2626', filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.07))' }} strokeWidth={2.5} />
        </div>
      )}

      {mode === 'extract' && page.selected && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', display: 'flex', border: '2px solid #3b82f6', zIndex: 10, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '9999px', padding: '0.25rem' }}>
             <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>
      )}

      {/* Thumbnail Container */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f9fafb', borderRadius: '0.25rem', border: '1px solid #f3f4f6' }}>
        <img 
          src={page.dataUrl} 
          alt={`Page ${page.originalIndex + 1}`} 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', pointerEvents: 'none', transition: 'transform 0.3s', transform: `rotate(${page.rotation}deg)` }}
        />
      </div>

      {/* Action Buttons */}
      {mode === 'rotate' && (
        <button 
          onClick={handleRotate}
          style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: '#ffffff', borderRadius: '9999px', padding: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', zIndex: 20, cursor: 'pointer' }}
          title="Rotate 90°"
        >
          <RotateCw style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      )}

      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, width: '100%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Orig: {page.originalIndex + 1}
      </div>
    </div>
  );
}
