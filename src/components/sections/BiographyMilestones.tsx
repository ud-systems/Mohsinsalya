import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  milestone_number: string;
  title: string;
  content: string;
}

interface BiographyMilestonesProps {
  milestones: Milestone[];
  isLoading: boolean;
}

export function BiographyMilestones({ milestones, isLoading }: BiographyMilestonesProps) {
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Default to the first one expanded
  useEffect(() => {
    if (milestones.length > 0 && !activeMilestone) {
      setActiveMilestone(milestones[0].id);
    }
  }, [milestones, activeMilestone]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#f5f2e8] animate-pulse flex items-center justify-center">
        <div className="text-black/20 font-serif text-2xl">Chronology Loading...</div>
      </div>
    );
  }

  // De-duplicate and sort milestones by number
  const displayItems = Array.from(
    new Map(milestones.map((m) => [m.id, m])).values()
  ).sort((a, b) => (a.milestone_number || '').localeCompare(b.milestone_number || ''));

  return (
    <section className="bg-[#f5f2e8] h-auto md:min-h-screen md:h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {displayItems.map((milestone) => {
          const isActive = activeMilestone === milestone.id;

          return (
            <motion.div
              key={milestone.id}
              layout="position"
              initial={false}
              animate={{
                backgroundColor: isActive ? "#fcfaf2" : "#000000",
                flex: isMobile ? "none" : (isActive ? 6 : 1),
                height: isMobile ? (isActive ? "auto" : "60px") : "100%",
                boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "0 0px 0px 0px rgba(0, 0, 0, 0)"
              }}
              transition={{
                layout: { 
                  type: "spring", 
                  stiffness: 180, 
                  damping: 28, 
                  mass: 1 
                },
                backgroundColor: { duration: 0.6 },
                boxShadow: { duration: 0.6 },
                height: { 
                  type: "spring", 
                  stiffness: 180, 
                  damping: 28 
                }
              }}
              onClick={() => setActiveMilestone(milestone.id)}
              className={cn(
                "relative cursor-pointer flex flex-col overflow-hidden",
                "border-b md:border-b-0 md:border-r transition-colors duration-500",
                isActive
                  ? "border-black/5 cursor-default z-10"
                  : "text-white hover:bg-neutral-900 border-white/5 z-0"
              )}
            >
              {/* Number & Progress Track (Decorative) */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1 transition-all duration-1000",
                isActive ? "bg-black/10" : "bg-white/5"
              )} />

              {/* COLLAPSED STATE: Branding */}
              <AnimatePresence initial={false}>
                {!isActive && (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-row md:flex-col items-center justify-between md:justify-start pt-0 md:pt-24 px-6 md:px-0 overflow-hidden"
                  >
                    <span className="text-sm md:text-2xl font-serif opacity-30 md:mb-16 tracking-tighter md:mx-auto">
                      {milestone.milestone_number}
                    </span>
                    <div className="md:h-full md:relative flex items-center justify-center flex-1 md:flex-none">
                      <h3 className="text-xs md:text-3xl font-serif whitespace-nowrap md:-rotate-90 md:origin-center tracking-[0.15em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                        {milestone.title}
                      </h3>
                    </div>
                    <div className="md:hidden opacity-30">
                      <span className="text-xs">+</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPANDED STATE: immersive Story Panel */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.2,
                      ease: "easeOut"
                    }}
                    className="relative md:h-full flex flex-col justify-center p-8 sm:p-12 md:p-24 lg:p-32 max-w-5xl mx-auto text-left"
                  >
                    <div className="flex items-center gap-6 mb-6 md:mb-12">
                      <span className="text-sm md:text-2xl font-serif text-black/40 tracking-[0.3em]">
                        CHAPTER {milestone.milestone_number}
                      </span>
                      <div className="h-px flex-1 bg-black/10" />
                    </div>
                    
                    <h2 className="display-xl text-black mb-6 md:mb-12 italic font-extralight">
                      {milestone.title}
                    </h2>
                    
                    <div className="max-w-3xl">
                      <p className="text-black/80 text-base md:text-2xl leading-relaxed font-serif">
                        {milestone.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
