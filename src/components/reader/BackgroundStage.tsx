import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./BackgroundStage.module.css";

type BackgroundStageProps = {
  src: string;
  alt: string;
};

export function BackgroundStage({ src, alt }: BackgroundStageProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-full w-full"
      >
        <Image src={src} alt={alt} fill priority className="object-cover" />
      </motion.div>
      <div className={`${styles.overlay} absolute inset-0`} />
    </div>
  );
}
