export function GenericErrorBoundaryFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="bg-red-100 rounded-lg p-4">
      <p>Something went wrong:</p>
      <pre className="text-red-600">{error.message}</pre>
    </div>
  );
}
