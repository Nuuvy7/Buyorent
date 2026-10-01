import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-accent/10 border-accent/50 text-ink",
        amber:
          "bg-neon-amber/10 border-neon-amber/50 text-ink",
        orange:
          "bg-neon-orange/10 border-neon-orange/50 text-ink",
        purple:
          "bg-neon-purple/10 border-neon-purple/50 text-ink",
        solid:
          "bg-signal text-[#ffffff] border-signal font-extrabold",
        muted:
          "bg-cyber-surface border-cyber-border text-slate-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
