import Link from 'next/link';

export default function Home() {
  return (
    <>
      <p>Home page</p>
      <Link href="/other">Go to other page</Link>
      <br />
      <Link href="/action">Go to action page</Link>
      <br />
      <Link href="/suspense">Go to suspense page</Link>
      <br />
      <Link href="/error/foo">Go to error page</Link>
    </>
  );
}
