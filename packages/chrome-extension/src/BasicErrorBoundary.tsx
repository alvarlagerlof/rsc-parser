import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error }: { error: Error }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p className="dark:text-red-500">Something went wrong:</p>
      <pre className="text-red-600 dark:text-red-500">{error.message}</pre>
    </div>
  );
}

export function BasicErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
  );
}
