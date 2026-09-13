import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-sm text-ink outline-none transition placeholder:text-[#9aa3b2] focus:border-brand",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-[#3a4150]", className)} {...props} />;
}
