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
      className={`relative flex flex-col items-center bg-white rounded-lg shadow-sm border-2 transition-all p-2 cursor-pointer select-none
        ${isDragging ? 'shadow-xl border-blue-500 scale-105' : 'border-transparent hover:shadow-md hover:border-gray-200'}
        ${page.selected && mode === 'remove' ? 'border-red-500 opacity-75' : ''}
        ${page.selected && mode === 'extract' ? 'border-blue-500 ring-2 ring-blue-200' : ''}
      `}
      style={{
        ...style,
        width: '140px',
        height: '200px',
        cursor: mode === 'organize' ? 'grab' : 'pointer'
      }}
    >
      {/* Page Number Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10">
        {index + 1}
      </div>

      {/* Mode-specific overlays */}
      {mode === 'remove' && page.selected && (
        <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center z-10">
          <Trash2 className="w-12 h-12 text-red-600 drop-shadow-md" strokeWidth={2.5} />
        </div>
      )}

      {mode === 'extract' && page.selected && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex border-2 border-blue-500 z-10 pointer-events-none">
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
             <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Thumbnail Container */}
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-gray-50 rounded border border-gray-100">
        <img 
          src={page.dataUrl} 
          alt={`Page ${page.originalIndex + 1}`} 
          className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        />
      </div>

      {/* Action Buttons */}
      {mode === 'rotate' && (
        <button 
          onClick={handleRotate}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 hover:text-blue-600 transition-colors z-20 border border-gray-200"
          title="Rotate 90°"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      )}

      {/* Info footer */}
      <div className="mt-2 text-xs text-gray-400 font-medium w-full text-center truncate">
        Orig: {page.originalIndex + 1}
      </div>
    </div>
  );
}
