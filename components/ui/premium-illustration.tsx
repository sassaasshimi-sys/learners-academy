import React from 'react'
import { motion } from "framer-motion"

interface IllustrationProps {
  className?: string
  type?: 'empty' | 'searching' | 'error'
}

export function PremiumIllustration({ className, type = 'empty' }: IllustrationProps) {
  if (type === 'empty') {
    return (
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <circle cx="60" cy="60" r="50" fill="url(#grad1)" fillOpacity="0.05" />
        <motion.path
          d="M40 45H80M40 60H70M40 75H60"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="text-primary/40"
        />
        <rect x="35" y="35" width="50" height="55" rx="4" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <defs>
          <linearGradient id="grad1" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    )
  }

  // Add more types as needed...
  return null
}
