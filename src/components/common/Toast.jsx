import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <CheckCircle2 size={17} style={{ color: '#FFFFFF', opacity: 0.9, flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
}
