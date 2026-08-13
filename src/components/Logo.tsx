import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="Prompt Buddy Logo" 
      className={`object-contain ${className}`} 
      onError={(e) => {
        // Fallback placeholder if image not uploaded yet
        (e.target as HTMLImageElement).src = "https://placehold.co/200x200/3b82f6/ffffff?text=PB";
      }}
    />
  );
}
