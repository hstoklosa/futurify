import { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";

import { Spinner } from "@components/ui/spinner";
import { queryConfig } from "@/lib/react-query";
import { TooltipProvider } from "@components/ui/tooltip";
import AuthLoader from "@features/auth/components/AuthLoader";

const ScreenSpinner = () => (
  <Spinner
    size="lg"
    className="h-screen w-screen bg-background"
  />
);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <Suspense fallback={<ScreenSpinner />}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider
            delayDuration={400}
            skipDelayDuration={200}
          >
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
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
