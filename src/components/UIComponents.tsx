import { motion, useMotionValue, useTransform } from "motion/react";
import React, { ReactNode, useState } from "react";
import { RefreshCw } from "lucide-react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  onRefresh?: () => void;
  key?: React.Key;
}

export const GlassCard = ({ children, className = "", delay = 0, onClick, onRefresh }: GlassCardProps) => {
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const opacity = useTransform(y, [0, 80], [0, 1]);
  const scale = useTransform(y, [0, 80], [0.5, 1]);
  const rotate = useTransform(y, [0, 150], [0, 360]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.3 } } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", damping: 15 }
      }}
      drag={onRefresh ? "y" : false}
      dragConstraints={{ top: 0, bottom: onRefresh ? 150 : 0 }}
      dragElastic={0.3}
      style={{ y, rotateX, rotateY, perspective: 1000 }}
      onDragEnd={(_, info) => {
        if (onRefresh && info.offset.y > 80 && !isRefreshing) {
          setIsRefreshing(true);
          onRefresh();
          setTimeout(() => setIsRefreshing(false), 2000);
        }
      }}
      onClick={onClick}
      className={`glass-card relative ${className} ${onClick ? 'cursor-pointer active:scale-95 transition-all active:brightness-125' : ''} ${onRefresh ? 'touch-none' : ''}`}
    >
      {onRefresh && (
        <motion.div 
          style={{ opacity, scale, rotate }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center p-2 bg-brand-cyan/20 rounded-full border border-brand-cyan/40"
        >
          <RefreshCw className={`w-5 h-5 text-brand-cyan ${isRefreshing ? "animate-spin" : ""}`} />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
};

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  subLabel?: string;
  color?: "cyan" | "gold" | "white";
  onClick?: () => void;
  className?: string;
}

export const ActionButton = ({ icon, label, subLabel, color = "white", onClick, className = "" }: ActionButtonProps) => {
  const colorClass = color === "cyan" ? "text-brand-cyan border-brand-cyan/40 bg-brand-cyan/5" : 
                     color === "gold" ? "text-brand-gold border-brand-gold/40 bg-brand-gold/5" : "text-white border-white/10";
  const glowClass = color === "cyan" ? "neo-glow-cyan" : 
                    color === "gold" ? "neo-glow-gold" : "";

  return (
    <motion.button 
      whileHover={{ 
        scale: 1.05, 
        rotateX: -10, 
        rotateY: 10, 
        y: -10,
        boxShadow: "0 30px 60px rgba(0,229,255,0.2)" 
      }}
      whileTap={{ scale: 0.94, rotateZ: [-2, 2, 0] }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      onClick={onClick}
      className={`glass-button flex-col gap-3 group ${colorClass} ${glowClass} ${className} w-full min-h-[160px] relative`}
    >
      <motion.div 
        style={{ translateZ: 50 }}
        className="p-5 rounded-full bg-white/5 group-hover:bg-brand-cyan/20 transition-all duration-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] group-active:scale-110"
      >
        {icon}
      </motion.div>
      <div className="text-center px-2" style={{ transform: "translateZ(30px)" }}>
        <p className="text-xl font-black tracking-tight leading-none mb-1 text-white">{label}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-black">{subLabel}</p>
      </div>
      
      {/* Decorative Shine Effect */}
      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-[100%] transition-all duration-1000" />
    </motion.button>
  );
};
