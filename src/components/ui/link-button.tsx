import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string };

/**
 * base-ui's Button enforces button semantics and should not wrap an <a>.
 * For link-styled buttons, apply buttonVariants() directly to next/link instead.
 */
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
