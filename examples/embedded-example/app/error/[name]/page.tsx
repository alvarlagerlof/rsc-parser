export default function Pokemon({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // @ts-expect-error Incorrect on purpose
  const name = params.name;

  return <span>The pokemon is: {name}</span>;
}
