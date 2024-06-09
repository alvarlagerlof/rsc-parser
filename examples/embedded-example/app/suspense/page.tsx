import Link from "next/link";
import { Suspense } from "react";

export default function SuspensePage() {
  return (
    <>
      <Link href="/">Go to home page</Link>
      <Suspense fallback="Loading...">
        <SlowComponent />
      </Suspense>
    </>
  );
}

async function SlowComponent() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Slow component</div>;
}
