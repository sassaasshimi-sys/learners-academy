"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const toggleVisibility = (e: React.MouseEvent) => {
      e.preventDefault()
      setIsVisible(!isVisible)
    }

    return (
      <div className="relative group">
        <Input
          {...props}
          type={isVisible ? "text" : "password"}
          className={cn("pr-10 transition-premium", className)}
          ref={ref}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-colors"
              onClick={toggleVisibility}
              tabIndex={-1}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isVisible ? (
                  <motion.div
                    key="eye-off"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }
)

SecureInput.displayName = "SecureInput"
