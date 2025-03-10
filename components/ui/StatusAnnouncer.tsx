// components/ui/StatusAnnouncer.tsx
import { useEffect, useState } from 'react';

interface StatusAnnouncerProps {
  message: string | null;
  assertive?: boolean;
  clearDelay?: number;
}

export function StatusAnnouncer({ 
  message, 
  assertive = false, 
  clearDelay = 5000 
}: StatusAnnouncerProps) {
  const [announcement, setAnnouncement] = useState(message);
  
  // Update announcement when message changes
  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      
      // Clear announcement after delay (for non-error messages)
      if (!assertive && clearDelay > 0) {
        const timer = setTimeout(() => {
          setAnnouncement(null);
        }, clearDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setAnnouncement(null);
    }
  }, [message, assertive, clearDelay]);
  
  if (!announcement) return null;
  
  return (
    <div 
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}