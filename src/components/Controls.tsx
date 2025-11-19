"use client";

import { ReactNode } from "react";

interface ControlsProps {
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  onTryAR?: () => void;
  tryARLabel?: string;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  onScaleChange?: (value: number) => void;
  showScale?: boolean;
  extraButtons?: ReactNode;
  className?: string;
  compact?: boolean;
}

const buttonClasses =
  "flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg transition hover:scale-105 hover:bg-white active:scale-95";

export function Controls({
  onRotateLeft,
  onRotateRight,
  onReset,
  onDelete,
  onTryAR,
  tryARLabel = "Try in AR",
  scale = 1,
  minScale = 0.8,
  maxScale = 1.2,
  onScaleChange,
  showScale,
  extraButtons,
  className = "",
  compact,
}: ControlsProps) {
  return (
    <div
      className={`glass-panel pointer-events-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-white/20 bg-white/30 p-4 text-slate-900 shadow-2xl backdrop-blur-lg ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onRotateLeft && (
            <button type="button" onClick={onRotateLeft} className={buttonClasses} aria-label="Rotate left">
              ↺
            </button>
          )}
          {onRotateRight && (
            <button type="button" onClick={onRotateRight} className={buttonClasses} aria-label="Rotate right">
              ↻
            </button>
          )}
          {onReset && (
            <button type="button" onClick={onReset} className={buttonClasses} aria-label="Reset">
              ⟳
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className={`${buttonClasses} text-rose-600`} aria-label="Remove">
              ✕
            </button>
          )}
        </div>
        {onTryAR && (
          <button
            type="button"
            onClick={onTryAR}
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-xl transition hover:bg-blue-600"
          >
            {tryARLabel}
          </button>
        )}
      </div>

      {showScale && onScaleChange && (
        <div className={`flex flex-col gap-2 ${compact ? "md:flex-row md:items-center" : ""}`}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <span>Scale</span>
            <span>{Math.round(scale * 100)}%</span>
          </div>
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step={0.01}
            value={scale}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400"
            onChange={(event) => onScaleChange(Number(event.target.value))}
          />
        </div>
      )}

      {extraButtons}
    </div>
  );
}
