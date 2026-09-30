import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-signal text-black hover:bg-signal/90 shadow-glow-signal font-extrabold uppercase tracking-wider",
        neon:
          "bg-transparent border border-accent text-accent hover:bg-accent/10 shadow-glow uppercase font-mono tracking-wider",
        cyan:
          "bg-accent text-black hover:bg-accent/90 shadow-glow font-extrabold uppercase tracking-wider",
        orange:
          "bg-gradient-to-r from-neon-orange to-amber-500 text-black hover:opacity-95 shadow-glow-orange font-bold",
        secondary:
          "bg-cyber-surface border border-cyber-border text-slate-200 hover:border-slate-500 hover:bg-cyber-light/40",
        ghost:
          "hover:bg-cyber-card text-slate-300 hover:text-white",
        link:
          "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-xl",
        sm: "h-8 px-3 rounded-lg text-[11px]",
        lg: "h-11 px-6 rounded-2xl text-sm",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
