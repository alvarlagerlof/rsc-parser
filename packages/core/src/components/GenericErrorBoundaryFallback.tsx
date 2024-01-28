import React from "react";

export function GenericErrorBoundaryFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="rounded-lg bg-red-100 p-4">
      <p className="dark:text-red-400">Something went wrong:</p>
      <pre className="text-red-600 dark:text-red-500">{error.message}</pre>
    </div>
  );
}
