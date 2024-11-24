import { motion } from "framer-motion";

export function LoadingDots() {
  return (
    <div className="flex space-x-2 justify-center items-center">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="h-2 w-2 rounded-full bg-muted"
          animate={{
            backgroundColor: ["#d1d5db", "#000000", "#d1d5db"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
} 