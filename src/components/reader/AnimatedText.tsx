"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  charsPerSecond: number;
  className?: string;
  onComplete?: () => void;
};

export function AnimatedText({
  text,
  charsPerSecond,
  className,
  onComplete,
}: AnimatedTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = useMemo(() => text.length, [text]);

  useEffect(() => {
    if (!totalChars) {
      return;
    }

    const intervalMs = Math.max(16, Math.floor(1000 / charsPerSecond));
    const timer = window.setInterval(() => {
      setVisibleChars((current) => {
        const nextValue = Math.min(totalChars, current + 1);
        if (nextValue === totalChars) {
          window.clearInterval(timer);
        }
        return nextValue;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [charsPerSecond, totalChars, onComplete]);

  useEffect(() => {
    if (visibleChars === totalChars && totalChars > 0) {
      onComplete?.();
    }
  }, [onComplete, totalChars, visibleChars]);

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {text.slice(0, visibleChars)}
    </motion.p>
  );
}
