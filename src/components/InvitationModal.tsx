import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationUrl: string;
}

export function InvitationModal({ isOpen, onClose, destinationUrl }: InvitationModalProps) {
  const isRoutingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      isRoutingRef.current = false;
      document.body.style.overflow = 'hidden';
      
      // Auto-redirect after sequence completes (e.g. 3.5 seconds)
      const timer = setTimeout(() => {
        if (!isRoutingRef.current) {
          isRoutingRef.current = true;
          window.location.href = destinationUrl;
        }
      }, 3500);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, destinationUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#111111]"
          onClick={(e) => {
            // Optional: allow click to skip animation and go directly
            if (!isRoutingRef.current) {
              isRoutingRef.current = true;
              window.location.href = destinationUrl;
            }
          }}
        >
          {/* Decorative Lines */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="absolute top-0 w-px bg-gradient-to-b from-[#FF6B00]/40 to-transparent"
          />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 w-px bg-gradient-to-t from-[#FF6B00]/40 to-transparent"
          />

          <div className="text-center px-6 mix-blend-difference z-10">
            {/* Step 1: Small eyebrow text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-[#FF6B00] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-6"
            >
              The Next Stage
            </motion.p>
            
            {/* Step 2: Main Invitation text */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              className="text-white text-3xl sm:text-5xl md:text-6xl font-serif font-light tracking-wider leading-snug"
            >
              あなたを、特別な場所へ<br/>ご招待します。
            </motion.h2>

            {/* Step 3: Entering text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              className="mt-16 sm:mt-24 flex flex-col items-center"
            >
               <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] mb-4">
                 Entering Registration...
               </span>
               <div className="w-16 h-px bg-white/20 relative overflow-hidden">
                 <motion.div 
                   initial={{ x: "-100%" }}
                   animate={{ x: "100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 left-0 w-full h-full bg-[#FF6B00]"
                 />
               </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
