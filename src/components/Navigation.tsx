import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/assets/new mohsin logo.png';
import favicon from '/favicon.png';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'BIOGRAPHY', href: '/biography' },
  { label: 'MARKETS', href: '/markets' },
  { label: 'INSIGHTS', href: '/insights' },
  { label: 'CHARITY', href: '/charity-works' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="fixed top-8 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 pointer-events-none">
        {/* Left Pill - Logo / Favicon */}
        <div className="flex items-center pointer-events-auto md:bg-white/80 md:backdrop-blur-md md:border md:border-black/5 md:pl-1 md:pr-4 md:py-1 md:rounded-r-2xl md:rounded-l-[5px] md:shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            {/* Desktop Logo */}
            <img src={logo} alt="Mohsin Salya" className="h-10 w-auto hidden md:block" />
            {/* Mobile Favicon */}
            <img src={favicon} alt="MS" className="h-10 w-10 block md:hidden" />
          </Link>
        </div>

        {/* Right Pill - Nav Items */}
        <div className="flex items-center gap-1 pointer-events-auto md:bg-white/80 md:backdrop-blur-md md:border md:border-black/5 md:p-2 md:rounded-2xl md:shadow-sm">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href.startsWith('/#') && location.hash === item.href.substring(1));
              
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-[10px] font-sans font-bold tracking-widest transition-all duration-300 rounded-md",
                    isActive 
                      ? "bg-black text-white" 
                      : "text-black/60 hover:text-black hover:bg-black/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* Desktop Work With Us */}
          <Link
            to="/contact"
            className="hidden md:block bg-[#2D3639] text-white px-5 py-2.5 rounded-xl text-[10px] font-sans font-bold tracking-widest hover:bg-[#1a2022] transition-colors ml-2 shadow-sm"
          >
            WORK WITH ME
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-md bg-black text-white transition-transform active:scale-95"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-background noise-overlay"
          >
            <div className="flex flex-col h-full p-8 pt-32">
              <div className="flex-1 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Link
                        to={item.href}
                        className={cn(
                          "block py-4 text-4xl font-serif tracking-tight transition-all duration-300",
                          isActive ? "text-accent pl-4 border-l-2 border-accent" : "text-black/40 hover:text-black"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 + 0.1 }}
                className="mt-auto space-y-8"
              >
                <Link
                  to="/contact"
                  className="block w-full py-6 text-center text-[10px] font-sans font-bold tracking-[0.2em] bg-black text-white rounded-2xl shadow-xl shadow-black/10 relative flex items-center justify-center gap-2"
                >
                  WORK WITH ME
                  <ArrowUpRight size={14} className="opacity-60" />
                </Link>

                <div className="flex justify-between items-center pt-8 border-t border-black/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-sans font-bold tracking-widest text-black/20 uppercase">Legal</p>
                    <p className="block text-xs font-sans text-black/40">All rights reserved.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-sans font-bold tracking-widest text-black/20 uppercase">Mohsin Salya</p>
                    <p className="text-xs font-sans text-black/40">© 2026</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
