import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initial load duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Elegant text animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.3em] text-primary uppercase">
                Mohsin Salya
              </h1>
            </motion.div>
            
            {/* Progress line */}
            <motion.div 
              className="h-px bg-primary/20 mt-4 w-48 relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 192 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-[10px] uppercase tracking-[0.2em] mt-4 font-sans"
            >
              Visionary Entrepreneur
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
