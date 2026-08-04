import * as React from "react"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive" }>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 uppercase tracking-wider font-mono",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border bg-card text-card-foreground", className)} {...props} />
))
Card.displayName = "Card"

export const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }>(({ className, variant = "default", ...props }, ref) => (
  <div ref={ref} className={cn(
    "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase",
    variant === "default" && "border-transparent bg-primary text-primary-foreground",
    variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
    variant === "destructive" && "border-transparent bg-destructive text-destructive-foreground",
    variant === "success" && "border-transparent bg-accent text-accent-foreground",
    variant === "warning" && "border-transparent bg-[#eab308] text-white",
    variant === "outline" && "text-foreground",
    className
  )} {...props} />
))
Badge.displayName = "Badge"

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-xs font-bold uppercase tracking-wider font-mono leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground mb-2 block", className)} {...props} />
))
Label.displayName = "Label"
