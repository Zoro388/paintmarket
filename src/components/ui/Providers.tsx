"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 1000 * 60 * 2, retry: 1, refetchOnWindowFocus: false },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1C1C1C",
            color: "#F0F0F0",
            border: "0.5px solid #404040",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "12px 16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          },
          success: { iconTheme: { primary: "#D4AF78", secondary: "#0F0F0F" } },
          error:   { iconTheme: { primary: "#f87171", secondary: "#FFFFFF" } },
          duration: 3500,
        }}
      />
    </QueryClientProvider>
  );
}
