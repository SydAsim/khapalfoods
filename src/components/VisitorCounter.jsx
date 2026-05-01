import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    /**
     * Security Fix: 
     * To maintain data integrity and prevent client-side manipulation, 
     * we move the visitor counting logic to a secure server-side endpoint.
     * The server should handle uniqueness (e.g., via session cookies or IP hashing)
     * and increment the global count in a database using atomic operations.
     */
    const syncVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitor-count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        // Fallback or silent error handling for analytics
        console.error('Visitor count synchronization failed');
      }
    };

    syncVisitorCount();
  }, []);

  if (visitorCount === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default"
      title="Total Unique Visitors"
    >
      <div className="flex items-center overflow-hidden rounded shadow-sm border" style={{ borderColor: 'rgba(92,61,46,0.3)' }}>
        <div className="px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#5C3D2E', color: '#FDF6EC' }}>
          Visitors
        </div>
        <div className="px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#C9A227', color: '#5C3D2E' }}>
          {visitorCount.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}