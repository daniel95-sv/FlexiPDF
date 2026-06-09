import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { PageThumbnail } from './PageThumbnail';
import type { PageThumbnailData } from '../../hooks/usePDFThumbnails';

export interface PDFVisualizerProps {
  thumbnails: PageThumbnailData[];
  mode: 'organize' | 'remove' | 'rotate' | 'extract';
  onUpdate: (updatedThumbnails: PageThumbnailData[]) => void;
}

export function PDFVisualizer({ thumbnails, mode, onUpdate }: PDFVisualizerProps) {
  const [items, setItems] = useState<PageThumbnailData[]>(thumbnails);

  // Sync internal state if external thumbnails change entirely
  useEffect(() => {
    setItems(thumbnails);
  }, [thumbnails]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts to allow clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onUpdate(newItems);
        return newItems;
      });
    }
  };

  const handleRotate = (id: string) => {
    setItems((items) => {
      const newItems = items.map(item => {
        if (item.id === id) {
          return { ...item, rotation: (item.rotation + 90) % 360 };
        }
        return item;
      });
      onUpdate(newItems);
      return newItems;
    });
  };

  const handleToggleSelect = (id: string) => {
    setItems((items) => {
      const newItems = items.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      onUpdate(newItems);
      return newItems;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-gray-50/50 p-6 rounded-xl border border-gray-100 min-h-[400px]">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-6 justify-center">
            {items.map((page, index) => (
              <PageThumbnail 
                key={page.id}
                page={page}
                index={index}
                mode={mode}
                onRotate={handleRotate}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
