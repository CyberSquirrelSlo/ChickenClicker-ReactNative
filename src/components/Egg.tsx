// src/components/Egg.tsx
import React from 'react';

export type EggKind = 'normal' | 'golden';

export type EggProps = {
  id: string;
  leftPct: number;     // 0..100
  delayMs?: number;    // optional CSS animation delay
  kind?: EggKind;      // normal | golden
};

const Egg: React.FC<EggProps> = ({ id, leftPct, delayMs = 0, kind = 'normal' }) => {
  const style: React.CSSProperties = {
    left: `${Math.max(5, Math.min(95, leftPct))}%`,
    animationDelay: `${delayMs}ms`,
  };

  if (kind === 'golden') {
    const gradId = `gold-egg-${id}`;
    return (
      <div className="egg golden" style={style} aria-label={`egg-${id}`}>
        <svg width="22" height="28" viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>
          <ellipse cx="11" cy="15" rx="9" ry="12" fill={`url(#${gradId})`} stroke="#a16207" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // normal egg (emoji)
  return (
    <div className="egg normal" style={style} aria-label={`egg-${id}`}>
      🥚
    </div>
  );
};

export default Egg;
