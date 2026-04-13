import React from 'react';

export function GenericErrorBoundaryFallback({ error }: { error: unknown }) {
  return (
    <div role="alert" className="rounded-lg bg-red-100 p-4">
      <p className="dark:text-red-400">Something went wrong:</p>
      <pre className="text-red-600 dark:text-red-500">
        {error instanceof Error ? error.message : String(error)}
      </pre>
    </div>
  );
}
