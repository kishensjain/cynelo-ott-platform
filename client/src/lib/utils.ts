import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
| Library          | Job                                   |
| ---------------- | ------------------------------------- |
| `clsx`           | Combine/conditionally include classes |
| `tailwind-merge` | Resolve conflicting Tailwind classes  |
| `cn`             | Convenient wrapper around both        |

Example:
cn("bg-red-500 text-white p-4", "font-bold", isActive && "bg-blue-500", isDisabled && "opacity-50")

Suppose: isActive = true and isDisabled = false

clsx evaluates the conditional properties:
isActive && "bg-blue-500"   → "bg-blue-500"
isDisabled && "opacity-50"  → false

So clsx combines them: bg-red-500 text-white p-4 font-bold bg-blue-500

twMerge recognizes conflicting classes: bg-red-500 and bg-blue-500

So the result becomes: bg-blue-500 text-white p-4 font-bold
*/