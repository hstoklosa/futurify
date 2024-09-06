import { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import { Spinner } from "@/components/ui/spinner";
import { queryConfig } from "@lib/react-query";

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
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          <Toaster />
          <AuthLoader renderLoading={() => <ScreenSpinner />}>{children}</AuthLoader>
        </QueryClientProvider>
      </HelmetProvider>
    </Suspense>
  );
};

export default AppProvider;
