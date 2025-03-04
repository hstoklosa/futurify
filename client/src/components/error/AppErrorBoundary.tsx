import React from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => {
            console.log("Error: ", error);
            return (
              <div>
                <div>Something went wrong!</div>
                <button onClick={() => resetErrorBoundary()}></button>
              </div>
            );
          }}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default AppErrorBoundary;
