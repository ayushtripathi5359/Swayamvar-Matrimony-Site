import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import LoginModal from "@/components/LoginModal";
import brideImage from "@/assets/bride-illustration.png";
import groomImage from "@/assets/groom-illustration.png";

const Index = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Trigger blur after characters meet (slower, more graceful)
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2800);

    // Show modal after blur settles
    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 3400);

    return () => {
      clearTimeout(timer);
      clearTimeout(modalTimer);
    };
  }, []);

  // Animation configurations
  const springConfig = {
    type: "spring" as const,
    stiffness: 25,
    damping: 18,
    mass: 1.2,
  };

  const rotateSpring = {
    type: "spring" as const,
    stiffness: 30,
    damping: 15,
    delay: 0.3,
  };

  return (
    <div className="min-h-screen romantic-gradient overflow-hidden relative">
      {/* Ambient background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(350 50% 85%) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(25 80% 85%) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blur Overlay */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ backgroundColor: "hsla(30, 40%, 97%, 0.5)" }}
          />
        )}
      </AnimatePresence>

      {/* Floating Hearts */}
      {animationComplete && <FloatingHearts />}

      {/* Characters Container */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Bride - Left Side */}
        <motion.div
          className="absolute left-0 md:left-[8%] lg:left-[12%] bottom-0 z-10"
          initial={{ x: "-100vw", rotate: -5, opacity: 0 }}
          animate={{ 
            x: animationComplete ? "-8%" : "0%",
            rotate: 0,
            opacity: 1,
          }}
          transition={{
            x: springConfig,
            rotate: rotateSpring,
            opacity: { duration: 1 },
          }}
        >
          <motion.img
            src={brideImage}
            alt="Bride illustration"
            className="h-[60vh] md:h-[70vh] lg:h-[85vh] w-auto object-contain"
            style={{
              filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))",
            }}
            animate={animationComplete ? {
              y: [0, -8, 0],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Groom - Right Side */}
        <motion.div
          className="absolute right-0 md:right-[8%] lg:right-[12%] bottom-0 z-10"
          initial={{ x: "100vw", rotate: 5, opacity: 0 }}
          animate={{ 
            x: animationComplete ? "8%" : "0%",
            rotate: 0,
            opacity: 1,
          }}
          transition={{
            x: springConfig,
            rotate: rotateSpring,
            opacity: { duration: 1 },
          }}
        >
          <motion.img
            src={groomImage}
            alt="Groom illustration"
            className="h-[60vh] md:h-[70vh] lg:h-[85vh] w-auto object-contain"
            style={{
              filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))",
            }}
            animate={animationComplete ? {
              y: [0, -8, 0],
            } : {}}
            transition={{
              duration: 4,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Center meeting glow effect */}
        <AnimatePresence>
          {animationComplete && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full z-5"
              style={{
                background: "radial-gradient(circle, hsla(350, 60%, 55%, 0.15) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Login Modal */}
      <LoginModal isVisible={showModal} />

      {/* Bottom Decorative Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(350 60% 55% / 0.3) 50%, transparent 100%)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: animationComplete ? 1 : 0,
          opacity: animationComplete ? 1 : 0,
        }}
        transition={{ delay: 3.5, duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default Index;
