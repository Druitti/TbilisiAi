"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary:
    "relative text-white font-semibold backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] " +
    "bg-[linear-gradient(135deg,#667eea_0%,#764ba2_25%,#f093fb_50%,#4facfe_75%,#00f2fe_100%)] " +
    "bg-[length:200%_200%] animate-gradient " +
    "hover:shadow-[0_12px_48px_rgba(102,126,234,0.4)] " +
    "hover:border-white/30 transition-all duration-500",
  secondary:
    "relative font-semibold " +
    "border-2 border-transparent  " +
    "bg-clip-padding " +
    "[background-image:linear-gradient(white,white),linear-gradient(135deg,#667eea_0%,#764ba2_25%,#f093fb_50%,#4facfe_75%,#00f2fe_100%)] " +
    "[background-origin:border-box] " +
    "[background-clip:padding-box,border-box] " +
    "bg-[length:100%_100%,200%_200%] " +
    "[animation:gradient_8s_ease_infinite] " +
    "hover:shadow-[0_8px_32px_rgba(102,126,234,0.3)] transition-all duration-500",
};

type ButtonBase = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsLink = ButtonBase & { href: string; type?: never };
type ButtonAsButton = ButtonBase & {
  href?: never;
  type?: "button" | "submit" | "reset";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBase>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "", ...rest } = props;
  const classNames = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <span className={variant === "primary" ? "text-white" : "text-foreground inline-block"}>
      {children}
    </span>
  );

  if ("href" in rest && rest.href) {
    const { href } = rest;
    return (
      <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={classNames}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  const { type = "button", ...buttonRest } = rest;
  return (
    <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <button type={type} className={classNames} {...buttonRest}>
        {inner}
      </button>
    </motion.span>
  );
}