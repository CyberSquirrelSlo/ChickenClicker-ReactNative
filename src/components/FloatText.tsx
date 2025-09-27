// src/components/FloatText.tsx
import React from 'react';

export type FloatTextProps = {
  id: string;
  leftPct: number;      // 0..100
  text: string;         // e.g. "+1" or "+2"
  kind?: 'normal' | 'golden';
};

const FloatText: React.FC<FloatTextProps> = ({ id, leftPct, text, kind = 'normal' }) => {
  return (
    <div
      className={`floattext ${kind}`}
      style={{ left: `${Math.max(5, Math.min(95, leftPct))}%` }}
      aria-label={`float-${id}`}
    >
      {text}
    </div>
  );
};

export default FloatText;
