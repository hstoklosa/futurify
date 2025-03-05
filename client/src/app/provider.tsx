import { useState, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import { Spinner } from "@components/ui/spinner";
import { TooltipProvider } from "@components/ui/tooltip";
import { createQueryClient } from "@lib/react-query";
import AuthLoader from "@/features/auth/components/auth-loader";

const ScreenSpinner = () => (
  <Spinner
    size="lg"
    className="h-screen w-screen bg-background"
  />
);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <Suspense fallback={<ScreenSpinner />}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider
            delayDuration={400}
            skipDelayDuration={200}
          >
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            <Toaster />
            <AuthLoader renderLoading={() => <ScreenSpinner />}>
              {children}
            </AuthLoader>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </Suspense>
  );
};

export default AppProvider;
