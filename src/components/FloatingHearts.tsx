import { motion } from "framer-motion";

interface FloatingElementProps {
  delay: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  type: "heart" | "petal" | "sparkle";
}

const FloatingElement = ({ delay, x, y, size, duration, type }: FloatingElementProps) => {
  const getEmoji = () => {
    switch (type) {
      case "heart":
        return "💕";
      case "petal":
        return "🌸";
      case "sparkle":
        return "✨";
      default:
        return "💕";
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7, 0],
        scale: [0.3, 1, 0.85, 1, 0.3],
        y: [0, -20, -15, -35, -60],
        x: [0, 8, -5, 10, 0],
        rotate: [0, 15, -10, 20, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {getEmoji()}
    </motion.div>
  );
};

const FloatingHearts = () => {
  const elements: FloatingElementProps[] = [
    // Hearts
    { delay: 0, x: 25, y: 35, size: 20, duration: 8, type: "heart" },
    { delay: 1.5, x: 70, y: 45, size: 18, duration: 9, type: "heart" },
    { delay: 3, x: 45, y: 25, size: 22, duration: 7, type: "heart" },
    { delay: 0.8, x: 55, y: 65, size: 16, duration: 10, type: "heart" },
    { delay: 2.2, x: 35, y: 55, size: 20, duration: 8, type: "heart" },
    
    // Petals
    { delay: 0.5, x: 80, y: 30, size: 16, duration: 11, type: "petal" },
    { delay: 2, x: 20, y: 70, size: 14, duration: 9, type: "petal" },
    { delay: 3.5, x: 60, y: 20, size: 18, duration: 10, type: "petal" },
    
    // Sparkles
    { delay: 1, x: 40, y: 40, size: 12, duration: 7, type: "sparkle" },
    { delay: 2.5, x: 75, y: 60, size: 14, duration: 8, type: "sparkle" },
    { delay: 4, x: 30, y: 25, size: 10, duration: 9, type: "sparkle" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {elements.map((element, index) => (
        <FloatingElement key={index} {...element} />
      ))}
    </div>
  );
};

export default FloatingHearts;
