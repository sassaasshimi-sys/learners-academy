import { Transition } from "framer-motion"

/**
 * Premium Spring Configurations
 * Designed for a tactile, "heavy" but responsive feel.
 */

export const STIFF_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
}

export const SOFT_SPRING: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 1,
}

export const BOUNCY_SPRING: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 15,
  mass: 1,
}

/**
 * Standard staggered animation variants for parent containers
 */
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Standard staggered item variants for child elements
 */
export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: STIFF_SPRING,
  },
}

/**
 * Premium Hover Lift Variant
 */
export const HOVER_LIFT = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -4, 
    scale: 1.01,
    transition: STIFF_SPRING 
  },
}
