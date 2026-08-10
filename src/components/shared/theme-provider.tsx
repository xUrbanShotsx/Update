"use client"
// Thin pass-through — next-themes ships a Client Component, and the root layout
// that mounts it is a Server Component.

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
