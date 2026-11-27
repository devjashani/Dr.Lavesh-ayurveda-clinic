'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripHorizontal, RotateCcw } from 'lucide-react';

interface DraggablePanelProps {
  children: React.ReactNode;
  className?: string;
  handleTitle?: string;
  headerActions?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Reusable viewport-clamped floating panel supporting free mouse & touch drag.
 * Starts at (0, 0) relative to its CSS anchor and moves freely via translate3d.
 */
export function DraggablePanel({
  children,
  className = '',
  handleTitle = 'Drag to move',
  headerActions,
  ariaLabel,
}: DraggablePanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef<{
    startPointerX: number;
    startPointerY: number;
    startOffsetX: number;
    startOffsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  const isMoved = offset.x !== 0 || offset.y !== 0;

  const resetPosition = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOffset({ x: 0, y: 0 });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch; ignore clicks inside buttons/inputs
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select')) return;

    e.stopPropagation();
    const panelEl = panelRef.current;
    if (!panelEl) return;

    const rect = panelEl.getBoundingClientRect();
    const padding = 8;

    // Natural un-offset rect = current rect - current offset
    const baseLeft = rect.left - offset.x;
    const baseTop = rect.top - offset.y;

    const minX = padding - baseLeft;
    const maxX = Math.max(minX, window.innerWidth - padding - rect.width - baseLeft);
    const minY = padding - baseTop;
    const maxY = Math.max(minY, window.innerHeight - padding - rect.height - baseTop);

    dragStateRef.current = {
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      minX,
      maxX,
      minY,
      maxY,
    };

    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const st = dragStateRef.current;
      if (!st) return;

      const rawX = st.startOffsetX + (e.clientX - st.startPointerX);
      const rawY = st.startOffsetY + (e.clientY - st.startPointerY);

      const clampedX = Math.min(Math.max(rawX, st.minX), st.maxX);
      const clampedY = Math.min(Math.max(rawY, st.minY), st.maxY);

      setOffset({ x: clampedX, y: clampedY });
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  // Re-clamp on viewport resize so panel never sits off-screen
  useEffect(() => {
    const handleResize = () => {
      const panelEl = panelRef.current;
      if (!panelEl) return;
      setOffset((prev) => {
        if (prev.x === 0 && prev.y === 0) return prev;
        const rect = panelEl.getBoundingClientRect();
        const padding = 8;
        const baseLeft = rect.left - prev.x;
        const baseTop = rect.top - prev.y;
        const minX = padding - baseLeft;
        const maxX = Math.max(minX, window.innerWidth - padding - rect.width - baseLeft);
        const minY = padding - baseTop;
        const maxY = Math.max(minY, window.innerHeight - padding - rect.height - baseTop);
        return {
          x: Math.min(Math.max(prev.x, minX), maxX),
          y: Math.min(Math.max(prev.y, minY), maxY),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      ref={panelRef}
      aria-label={ariaLabel}
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`${className} ${isDragging ? 'ring-2 ring-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.65)]' : ''}`}
    >
      {/* Dedicated Drag Handle Bar */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={() => resetPosition()}
        title={`${handleTitle} (double-click to reset)`}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 border-b border-white/10 bg-white/[0.04] select-none touch-none shrink-0 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
          <GripHorizontal className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
          <span>{handleTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          {isMoved && (
            <button
              type="button"
              onClick={resetPosition}
              title="Reset box position"
              aria-label="Reset box position"
              className="p-1 text-neutral-400 hover:text-amber-300 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          {headerActions}
        </div>
      </div>

      {children}
    </aside>
  );
}
