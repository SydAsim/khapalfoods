import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Check if THIS unique user has visited before
    const hasVisited = localStorage.getItem('kf_unique_visitor');
    
    // Use a local count starting at 0
    let currentGlobalCount = parseInt(localStorage.getItem('kf_global_count') || '0', 10);

    if (!hasVisited) {
      // New unique visitor!
      localStorage.setItem('kf_unique_visitor', 'true');
      currentGlobalCount += 1;
      localStorage.setItem('kf_global_count', currentGlobalCount.toString());
      setVisitorCount(currentGlobalCount);
    } else {
      // Returning visitor
      if (currentGlobalCount === 0) {
        // If somehow they are marked as visited but count is 0, ensure it's at least 1
        currentGlobalCount = 1;
        localStorage.setItem('kf_global_count', '1');
      }
      setVisitorCount(currentGlobalCount);
    }
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
